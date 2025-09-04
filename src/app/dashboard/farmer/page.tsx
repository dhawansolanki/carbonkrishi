'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Header from '@/components/Header'
import { 
  Leaf, 
  MapPin, 
  Camera, 
  TrendingUp, 
  Coins, 
  Calendar,
  Upload,
  CheckCircle,
  Loader2
} from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

export default function FarmerDashboard() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [farmData, setFarmData] = useState({
    farmSize: '',
    location: '',
    cropType: '',
    practiceType: '',
    fertilizer: '',
    waterUsage: '',
    treesPlanted: ''
  })
  const [dashboardData, setDashboardData] = useState({
    totalCredits: 0,
    monthlyEarnings: 0,
    farmSize: 0,
    verificationStatus: 'pending',
    practices: [],
    transactions: []
  })
  const [selectedPractice, setSelectedPractice] = useState('')
  const [uploadFiles, setUploadFiles] = useState<FileList | null>(null)
  
  // Check authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem('token')
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    
    if (!token || user.role !== 'farmer') {
      toast({
        title: 'Authentication required',
        description: 'Please log in as a farmer to access this page',
        variant: 'destructive'
      })
      router.push('/login')
      return
    }
    
    // Fetch farmer dashboard data
    fetchDashboardData()
  }, [])
  
  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem('token')
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/farmer/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data')
      }
      
      const data = await response.json()
      setDashboardData({
        totalCredits: data.totalCredits || 0,
        monthlyEarnings: data.monthlyEarnings || 0,
        farmSize: data.farmSize || 0,
        verificationStatus: data.verificationStatus || 'pending',
        practices: data.practices || [],
        transactions: data.transactions || []
      })
      
      // Also fetch practices for the dropdown
      const practicesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/farmer/practices`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (practicesResponse.ok) {
        const practicesData = await practicesResponse.json()
        // Set practices data if needed
      }
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFarmData(prev => ({ ...prev, [field]: value }))
  }
  
  const handleSubmitPractice = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setIsLoading(true)
      const token = localStorage.getItem('token')
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/farmer/practice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(farmData)
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit practice')
      }
      
      toast({
        title: 'Success',
        description: 'Farm practice submitted successfully',
        variant: 'default'
      })
      
      // Reset form
      setFarmData({
        farmSize: '',
        location: '',
        cropType: '',
        practiceType: '',
        fertilizer: '',
        waterUsage: '',
        treesPlanted: ''
      })
      
      // Refresh dashboard data
      fetchDashboardData()
      
    } catch (error) {
      console.error('Error submitting practice:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to submit practice',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadFiles(e.target.files)
    }
  }
  
  const handleUploadEvidence = async (e: React.FormEvent, type: string) => {
    e.preventDefault()
    
    if (!selectedPractice) {
      toast({
        title: 'Error',
        description: 'Please select a practice first',
        variant: 'destructive'
      })
      return
    }
    
    if (!uploadFiles || uploadFiles.length === 0) {
      toast({
        title: 'Error',
        description: 'Please select files to upload',
        variant: 'destructive'
      })
      return
    }
    
    try {
      setIsLoading(true)
      const token = localStorage.getItem('token')
      
      const formData = new FormData()
      for (let i = 0; i < uploadFiles.length; i++) {
        formData.append('evidence', uploadFiles[i])
      }
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/farmer/practice/${selectedPractice}/evidence`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to upload evidence')
      }
      
      toast({
        title: 'Success',
        description: 'Evidence uploaded successfully',
        variant: 'default'
      })
      
      // Reset form
      setUploadFiles(null)
      setSelectedPractice('')
      
      // Refresh dashboard data
      fetchDashboardData()
      
    } catch (error) {
      console.error('Error uploading evidence:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to upload evidence',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-green-600 mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            किसान Dashboard
          </h1>
          <p className="text-gray-600">
            अपनी farming activities को track करें और carbon credits earn करें
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Credits</p>
                <p className="text-2xl font-bold text-green-600">{dashboardData.totalCredits}</p>
              </div>
              <Coins className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Monthly Earnings</p>
                <p className="text-2xl font-bold text-blue-600">₹{dashboardData.monthlyEarnings.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Farm Size</p>
                <p className="text-2xl font-bold text-purple-600">{dashboardData.farmSize} Acres</p>
              </div>
              <MapPin className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Verification Status</p>
                <p className={`text-lg font-bold ${
                  dashboardData.verificationStatus === 'verified' 
                    ? 'text-green-600' 
                    : dashboardData.verificationStatus === 'rejected'
                    ? 'text-red-600'
                    : 'text-yellow-600'
                }`}>
                  {dashboardData.verificationStatus.charAt(0).toUpperCase() + dashboardData.verificationStatus.slice(1)}
                </p>
              </div>
              <CheckCircle className={`h-8 w-8 ${
                dashboardData.verificationStatus === 'verified' 
                  ? 'text-green-600' 
                  : dashboardData.verificationStatus === 'rejected'
                  ? 'text-red-600'
                  : 'text-yellow-600'
              }`} />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6 overflow-x-auto">
              {[
                { id: 'overview', label: 'Overview', icon: TrendingUp },
                { id: 'farm-data', label: 'Farm Data Entry', icon: Leaf },
                { id: 'upload', label: 'Upload Evidence', icon: Camera },
                { id: 'history', label: 'Transaction History', icon: Calendar }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Farm Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">Current Practices</h4>
                    {dashboardData.practices && dashboardData.practices.length > 0 ? (
                      <ul className="space-y-1 text-sm text-green-700">
                        {dashboardData.practices.slice(0, 5).map((practice: any, index: number) => (
                          <li key={index}>• {practice.type} ({practice.verificationStatus})</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-green-700">No practices submitted yet. Add your first sustainable practice!</p>
                    )}
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Next Actions</h4>
                    <ul className="space-y-1 text-sm text-blue-700">
                      <li>• Upload soil test report</li>
                      <li>• Submit monthly farm photos</li>
                      <li>• Update fertilizer usage data</li>
                      <li>• Schedule verification visit</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'farm-data' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Farm Data Entry</h3>
                <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmitPractice}>
                  <div className="space-y-2">
                    <Label htmlFor="farmSize">Farm Size (Acres)</Label>
                    <Input
                      id="farmSize"
                      type="number"
                      placeholder="Enter farm size"
                      value={farmData.farmSize}
                      onChange={(e) => handleInputChange('farmSize', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="Village, District, State"
                      value={farmData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cropType">Crop Type</Label>
                    <select 
                      id="cropType"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={farmData.cropType}
                      onChange={(e) => handleInputChange('cropType', e.target.value)}
                      required
                    >
                      <option value="">Select Crop</option>
                      <option value="rice">Rice</option>
                      <option value="wheat">Wheat</option>
                      <option value="sugarcane">Sugarcane</option>
                      <option value="cotton">Cotton</option>
                      <option value="vegetables">Vegetables</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="practiceType">Sustainable Practice</Label>
                    <select 
                      id="practiceType"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={farmData.practiceType}
                      onChange={(e) => handleInputChange('practiceType', e.target.value)}
                      required
                    >
                      <option value="">Select Practice</option>
                      <option value="organic">Organic Farming</option>
                      <option value="reduced-tillage">Reduced Tillage</option>
                      <option value="crop-rotation">Crop Rotation</option>
                      <option value="cover-crops">Cover Crops</option>
                      <option value="agroforestry">Agroforestry</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="fertilizer">Fertilizer Usage (kg/acre)</Label>
                    <Input
                      id="fertilizer"
                      type="number"
                      placeholder="Enter fertilizer amount"
                      value={farmData.fertilizer}
                      onChange={(e) => handleInputChange('fertilizer', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="waterUsage">Water Usage (liters/day)</Label>
                    <Input
                      id="waterUsage"
                      type="number"
                      placeholder="Enter water usage"
                      value={farmData.waterUsage}
                      onChange={(e) => handleInputChange('waterUsage', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="treesPlanted">Trees Planted (this season)</Label>
                    <Input
                      id="treesPlanted"
                      type="number"
                      placeholder="Number of trees planted"
                      value={farmData.treesPlanted}
                      onChange={(e) => handleInputChange('treesPlanted', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <Button 
                      type="submit" 
                      className="w-full bg-green-600 hover:bg-green-700"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        'Submit Farm Data'
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'upload' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Upload Evidence</h3>
                
                <div className="mb-4">
                  <Label htmlFor="practiceSelect">Select Practice</Label>
                  <select
                    id="practiceSelect"
                    className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                    value={selectedPractice}
                    onChange={(e) => setSelectedPractice(e.target.value)}
                  >
                    <option value="">Select a practice</option>
                    {dashboardData.practices && dashboardData.practices.map((practice: any, index: number) => (
                      <option key={index} value={practice._id}>
                        {practice.type} - {new Date(practice.createdAt).toLocaleDateString()}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-sm text-gray-600 mb-2">Farm Photos</p>
                    <input
                      type="file"
                      id="farm-photos"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <Button 
                      variant="outline" 
                      onClick={() => document.getElementById('farm-photos')?.click()}
                      disabled={!selectedPractice || isLoading}
                    >
                      Select Images
                    </Button>
                    {uploadFiles && uploadFiles.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">{uploadFiles.length} files selected</p>
                        <Button 
                          className="mt-2 bg-green-600 hover:bg-green-700"
                          onClick={(e) => handleUploadEvidence(e, 'photos')}
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            'Upload Files'
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-sm text-gray-600 mb-2">Soil Test Reports</p>
                    <input
                      type="file"
                      id="soil-reports"
                      multiple
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <Button 
                      variant="outline" 
                      onClick={() => document.getElementById('soil-reports')?.click()}
                      disabled={!selectedPractice || isLoading}
                    >
                      Select Documents
                    </Button>
                    {uploadFiles && uploadFiles.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">{uploadFiles.length} files selected</p>
                        <Button 
                          className="mt-2 bg-green-600 hover:bg-green-700"
                          onClick={(e) => handleUploadEvidence(e, 'documents')}
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            'Upload Files'
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Transaction History</h3>
                <div className="space-y-4">
                  {dashboardData.transactions && dashboardData.transactions.length > 0 ? (
                    dashboardData.transactions.map((transaction: any, index: number) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg flex justify-between items-center">
                        <div>
                          <p className="font-semibold">{transaction.credits} Credits Sold</p>
                          <p className="text-sm text-gray-600">To: {transaction.buyer}</p>
                          <p className="text-sm text-gray-600">{new Date(transaction.date).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">₹{transaction.amount.toLocaleString()}</p>
                          <span className={`text-sm px-2 py-1 rounded-full ${
                            transaction.status === 'completed' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No transactions yet</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

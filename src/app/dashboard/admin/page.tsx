'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Header from '@/components/Header'
import { 
  TrendingUp, 
  Users, 
  CheckCircle2,
  BarChart,
  Loader2,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'

export default function AdminDashboard() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  
  const [dashboardData, setDashboardData] = useState({
    totalFarmers: 0,
    totalCompanies: 0,
    totalCredits: 0,
    pendingVerifications: 0,
    recentVerifications: [],
    recentTransactions: []
  })

  // Check authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem('token')
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    
    if (!token || user.role !== 'admin') {
      toast({
        title: 'Authentication required',
        description: 'Please log in as an admin to access this page',
        variant: 'destructive'
      })
      router.push('/login')
      return
    }
    
    // Fetch admin dashboard data
    fetchDashboardData()
  }, [])
  
  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem('token')
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data')
      }
      
      const data = await response.json()
      setDashboardData({
        totalFarmers: data.totalFarmers || 0,
        totalCompanies: data.totalCompanies || 0,
        totalCredits: data.totalCredits || 0,
        pendingVerifications: data.pendingVerifications || 0,
        recentVerifications: data.recentVerifications || [],
        recentTransactions: data.recentTransactions || []
      })
      
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
  
  const handleVerification = async (practiceId: string, status: 'verified' | 'rejected') => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem('token')
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ practiceId, status })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update verification status')
      }
      
      toast({
        title: 'Success',
        description: `Practice ${status === 'verified' ? 'verified' : 'rejected'} successfully`,
        variant: 'default'
      })
      
      // Refresh dashboard data
      fetchDashboardData()
      
    } catch (error) {
      console.error('Error updating verification:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update verification status',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  const filteredVerifications = dashboardData.recentVerifications
    .filter((item: any) => {
      // Apply search filter
      if (searchTerm && !item.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !item.practiceType.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false
      }
      
      // Apply status filter
      if (filterStatus !== 'all' && item.verificationStatus !== filterStatus) {
        return false
      }
      
      return true
    })

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-indigo-600 mb-4" />
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
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Manage verifications and monitor platform activity
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Farmers</p>
                <p className="text-2xl font-bold text-indigo-600">{dashboardData.totalFarmers}</p>
              </div>
              <Users className="h-8 w-8 text-indigo-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Companies</p>
                <p className="text-2xl font-bold text-blue-600">{dashboardData.totalCompanies}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Credits</p>
                <p className="text-2xl font-bold text-green-600">{dashboardData.totalCredits}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Verifications</p>
                <p className="text-2xl font-bold text-yellow-600">{dashboardData.pendingVerifications}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6 overflow-x-auto">
              {[
                { id: 'overview', label: 'Overview', icon: TrendingUp },
                { id: 'verifications', label: 'Verifications', icon: CheckCircle2 },
                { id: 'transactions', label: 'Transactions', icon: BarChart }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
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
                <h3 className="text-xl font-semibold">Platform Overview</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-indigo-800 mb-2">Recent Verifications</h4>
                    {dashboardData.recentVerifications && dashboardData.recentVerifications.length > 0 ? (
                      <div className="space-y-3">
                        {dashboardData.recentVerifications.slice(0, 3).map((verification: any, index: number) => (
                          <div key={index} className="bg-white p-3 rounded-md shadow-sm">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-medium">{verification.practiceType}</p>
                                <p className="text-xs text-gray-500">Farmer: {verification.farmerName}</p>
                                <p className="text-xs text-gray-500">Submitted: {new Date(verification.submittedDate).toLocaleDateString()}</p>
                              </div>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                verification.verificationStatus === 'verified' 
                                  ? 'bg-green-100 text-green-800' 
                                  : verification.verificationStatus === 'rejected'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {verification.verificationStatus.charAt(0).toUpperCase() + verification.verificationStatus.slice(1)}
                              </span>
                            </div>
                          </div>
                        ))}
                        <Button 
                          variant="outline" 
                          className="w-full mt-2 text-indigo-600 border-indigo-200"
                          onClick={() => setActiveTab('verifications')}
                        >
                          View All Verifications
                        </Button>
                      </div>
                    ) : (
                      <p className="text-sm text-indigo-700">No recent verifications</p>
                    )}
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Recent Transactions</h4>
                    {dashboardData.recentTransactions && dashboardData.recentTransactions.length > 0 ? (
                      <div className="space-y-3">
                        {dashboardData.recentTransactions.slice(0, 3).map((transaction: any, index: number) => (
                          <div key={index} className="bg-white p-3 rounded-md shadow-sm">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-medium">{transaction.credits} Credits</p>
                                <p className="text-xs text-gray-500">From: {transaction.farmerName}</p>
                                <p className="text-xs text-gray-500">To: {transaction.companyName}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-blue-600 font-medium">₹{transaction.amount.toLocaleString()}</p>
                                <p className="text-xs text-gray-500">{new Date(transaction.date).toLocaleDateString()}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                        <Button 
                          variant="outline" 
                          className="w-full mt-2 text-blue-600 border-blue-200"
                          onClick={() => setActiveTab('transactions')}
                        >
                          View All Transactions
                        </Button>
                      </div>
                    ) : (
                      <p className="text-sm text-blue-700">No recent transactions</p>
                    )}
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg mt-6">
                  <h4 className="font-semibold text-gray-800 mb-4">Platform Statistics</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-md shadow-sm">
                      <p className="text-sm text-gray-500">CO2 Offset</p>
                      <p className="text-xl font-bold text-gray-800">{(dashboardData.totalCredits * 0.5).toFixed(1)} tons</p>
                    </div>
                    <div className="bg-white p-4 rounded-md shadow-sm">
                      <p className="text-sm text-gray-500">Verification Rate</p>
                      <p className="text-xl font-bold text-gray-800">
                        {dashboardData.recentVerifications.length > 0 
                          ? Math.round((dashboardData.recentVerifications.filter((v: any) => v.verificationStatus === 'verified').length / dashboardData.recentVerifications.length) * 100) 
                          : 0}%
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-md shadow-sm">
                      <p className="text-sm text-gray-500">Total Transaction Value</p>
                      <p className="text-xl font-bold text-gray-800">
                        ₹{dashboardData.recentTransactions.reduce((sum: number, t: any) => sum + t.amount, 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'verifications' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Practice Verifications</h3>
                
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                      placeholder="Search by farmer name or practice type"
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <div className="w-full md:w-64 flex items-center space-x-2">
                    <Filter size={18} className="text-gray-400" />
                    <select
                      className="flex-1 p-2 border border-gray-300 rounded-md"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <option value="all">All Statuses</option>
                      <option value="pending">Pending</option>
                      <option value="verified">Verified</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>
                
                {filteredVerifications.length > 0 ? (
                  <div className="space-y-4">
                    {filteredVerifications.map((verification: any, index: number) => (
                      <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                        <div className="flex flex-col md:flex-row justify-between">
                          <div className="mb-4 md:mb-0">
                            <div className="flex items-center mb-2">
                              <h4 className="font-semibold text-gray-800">{verification.practiceType}</h4>
                              <span className={`ml-2 text-xs px-2 py-1 rounded-full ${
                                verification.verificationStatus === 'verified' 
                                  ? 'bg-green-100 text-green-800' 
                                  : verification.verificationStatus === 'rejected'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {verification.verificationStatus.charAt(0).toUpperCase() + verification.verificationStatus.slice(1)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">Farmer: {verification.farmerName}</p>
                            <p className="text-sm text-gray-600">Farm Size: {verification.farmSize} acres</p>
                            <p className="text-sm text-gray-600">Location: {verification.location}</p>
                            <p className="text-sm text-gray-600">Submitted: {new Date(verification.submittedDate).toLocaleDateString()}</p>
                            <div className="mt-2">
                              <p className="text-sm font-medium text-gray-700">Evidence:</p>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {verification.evidence && verification.evidence.map((item: string, i: number) => (
                                  <a 
                                    key={i} 
                                    href={item} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-xs bg-gray-100 text-blue-600 px-2 py-1 rounded hover:bg-gray-200"
                                  >
                                    Evidence {i + 1}
                                  </a>
                                ))}
                                {(!verification.evidence || verification.evidence.length === 0) && (
                                  <span className="text-xs text-gray-500">No evidence uploaded</span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col justify-between items-end">
                            <div className="text-right mb-4 md:mb-0">
                              <p className="text-lg font-bold text-indigo-600">{verification.creditsPotential} Credits</p>
                              <p className="text-xs text-gray-500">Potential Value: ₹{(verification.creditsPotential * 150).toLocaleString()}</p>
                            </div>
                            
                            {verification.verificationStatus === 'pending' && (
                              <div className="flex space-x-2">
                                <Button 
                                  className="bg-green-600 hover:bg-green-700"
                                  onClick={() => handleVerification(verification._id, 'verified')}
                                  disabled={isLoading}
                                >
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Verify
                                </Button>
                                <Button 
                                  className="bg-red-600 hover:bg-red-700"
                                  onClick={() => handleVerification(verification._id, 'rejected')}
                                  disabled={isLoading}
                                >
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Reject
                                </Button>
                              </div>
                            )}
                            
                            {verification.verificationStatus !== 'pending' && (
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1 text-gray-400" />
                                <span className="text-xs text-gray-500">
                                  {verification.verificationStatus === 'verified' ? 'Verified' : 'Rejected'} on {new Date(verification.verificationDate || Date.now()).toLocaleDateString()}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <CheckCircle2 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h4 className="text-lg font-medium text-gray-900">No verifications found</h4>
                    <p className="text-gray-500 mt-1">Try adjusting your search or filters</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'transactions' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Transaction History</h3>
                
                {dashboardData.recentTransactions && dashboardData.recentTransactions.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Farmer
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Company
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Credits
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {dashboardData.recentTransactions.map((transaction: any, index: number) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(transaction.date).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{transaction.farmerName}</div>
                              <div className="text-sm text-gray-500">{transaction.farmerLocation}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{transaction.companyName}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {transaction.credits}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                              ₹{transaction.amount.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                transaction.status === 'completed' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <BarChart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h4 className="text-lg font-medium text-gray-900">No transactions yet</h4>
                    <p className="text-gray-500 mt-1">Transaction history will appear here</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

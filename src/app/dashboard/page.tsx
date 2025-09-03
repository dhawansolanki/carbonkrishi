'use client'

import { useState } from 'react'
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
  CheckCircle
} from 'lucide-react'

export default function FarmerDashboard() {
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

  const handleInputChange = (field: string, value: string) => {
    setFarmData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Farmer Dashboard
          </h1>
          <p className="text-gray-600">
            Monitor your sustainable farming activities and generate carbon credits
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Credits</p>
                <p className="text-2xl font-bold text-green-600">247</p>
              </div>
              <Coins className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Monthly Earnings</p>
                <p className="text-2xl font-bold text-blue-600">₹12,350</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Farm Size</p>
                <p className="text-2xl font-bold text-purple-600">5.2 Acres</p>
              </div>
              <MapPin className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Verification Status</p>
                <p className="text-lg font-bold text-green-600">Verified</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: TrendingUp },
                { id: 'farm-data', label: 'Farm Data Entry', icon: Leaf },
                { id: 'upload', label: 'Upload Evidence', icon: Camera },
                { id: 'history', label: 'Transaction History', icon: Calendar }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
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
                <h3 className="text-xl font-semibold">Farm Activity Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">Active Sustainable Practices</h4>
                    <ul className="space-y-1 text-sm text-green-700">
                      <li>• Organic fertilizer application</li>
                      <li>• Crop rotation system in place</li>
                      <li>• Water conservation techniques</li>
                      <li>• 50 trees planted this growing season</li>
                    </ul>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Pending Actions</h4>
                    <ul className="space-y-1 text-sm text-blue-700">
                      <li>• Upload soil analysis report</li>
                      <li>• Submit monthly farm documentation</li>
                      <li>• Update fertilizer application records</li>
                      <li>• Schedule verification inspection</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'farm-data' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Farm Information Management</h3>
                <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="farmSize">Farm Size (Acres)</Label>
                    <Input
                      id="farmSize"
                      type="number"
                      placeholder="Enter total farm area"
                      value={farmData.farmSize}
                      onChange={(e) => handleInputChange('farmSize', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="Village, District, State"
                      value={farmData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cropType">Crop Type</Label>
                    <select 
                      id="cropType"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={farmData.cropType}
                      onChange={(e) => handleInputChange('cropType', e.target.value)}
                    >
                      <option value="">Select primary crop type</option>
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
                    >
                      <option value="">Select sustainable practice</option>
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
                      placeholder="Enter fertilizer quantity"
                      value={farmData.fertilizer}
                      onChange={(e) => handleInputChange('fertilizer', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="waterUsage">Water Usage (liters/day)</Label>
                    <Input
                      id="waterUsage"
                      type="number"
                      placeholder="Enter daily water consumption"
                      value={farmData.waterUsage}
                      onChange={(e) => handleInputChange('waterUsage', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="treesPlanted">Trees Planted (this season)</Label>
                    <Input
                      id="treesPlanted"
                      type="number"
                      placeholder="Total trees planted this season"
                      value={farmData.treesPlanted}
                      onChange={(e) => handleInputChange('treesPlanted', e.target.value)}
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      Save Farm Information
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'upload' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Upload Evidence</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-sm text-gray-600 mb-2">Farm Photos</p>
                    <Button variant="outline">Upload Images</Button>
                  </div>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-sm text-gray-600 mb-2">Soil Test Reports</p>
                    <Button variant="outline">Upload Documents</Button>
                  </div>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-sm text-gray-600 mb-2">GPS Coordinates</p>
                    <Button variant="outline">Share Location</Button>
                  </div>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-sm text-gray-600 mb-2">Practice Videos</p>
                    <Button variant="outline">Upload Videos</Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Transaction History</h3>
                <div className="space-y-4">
                  {[
                    { date: '2024-01-15', credits: 25, amount: '₹3,750', buyer: 'TechCorp Ltd', status: 'Completed' },
                    { date: '2024-01-10', credits: 18, amount: '₹2,700', buyer: 'GreenEnergy Co', status: 'Completed' },
                    { date: '2024-01-05', credits: 32, amount: '₹4,800', buyer: 'EcoSolutions', status: 'Pending' },
                  ].map((transaction, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg flex justify-between items-center">
                      <div>
                        <p className="font-semibold">{transaction.credits} Credits Sold</p>
                        <p className="text-sm text-gray-600">To: {transaction.buyer}</p>
                        <p className="text-sm text-gray-600">{transaction.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">{transaction.amount}</p>
                        <span className={`text-sm px-2 py-1 rounded-full ${
                          transaction.status === 'Completed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {transaction.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

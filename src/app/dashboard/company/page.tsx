'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Header from '@/components/Header'
import { 
  TrendingUp, 
  Coins, 
  ShoppingCart,
  BarChart,
  Loader2,
  Search,
  Filter,
  ArrowRight
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'

export default function CompanyDashboard() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  
  const [dashboardData, setDashboardData] = useState({
    totalCredits: 0,
    totalSpent: 0,
    availableCredits: 0,
    pendingTransactions: 0,
    recentTransactions: [],
    availableMarketplace: []
  })

  // Check authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem('token')
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    
    if (!token || user.role !== 'company') {
      toast({
        title: 'Authentication required',
        description: 'Please log in as a company to access this page',
        variant: 'destructive'
      })
      router.push('/login')
      return
    }
    
    // Fetch company dashboard data
    fetchDashboardData()
  }, [])
  
  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem('token')
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/company/dashboard`, {
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
        totalSpent: data.totalSpent || 0,
        availableCredits: data.availableCredits || 0,
        pendingTransactions: data.pendingTransactions || 0,
        recentTransactions: data.recentTransactions || [],
        availableMarketplace: data.availableMarketplace || []
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
  
  const handlePurchaseCredits = async (creditId: string) => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem('token')
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/marketplace/purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ creditId })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to purchase credits')
      }
      
      toast({
        title: 'Success',
        description: 'Carbon credits purchased successfully',
        variant: 'default'
      })
      
      // Refresh dashboard data
      fetchDashboardData()
      
    } catch (error) {
      console.error('Error purchasing credits:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to purchase credits',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  const filteredMarketplace = dashboardData.availableMarketplace
    .filter((item: any) => {
      // Apply search filter
      if (searchTerm && !item.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !item.location.toLowerCase().includes(searchTerm.toLowerCase())) {
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
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600 mb-4" />
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
            Company Dashboard
          </h1>
          <p className="text-gray-600">
            Purchase and manage carbon credits to offset your carbon footprint
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Credits Purchased</p>
                <p className="text-2xl font-bold text-blue-600">{dashboardData.totalCredits}</p>
              </div>
              <Coins className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Amount Spent</p>
                <p className="text-2xl font-bold text-purple-600">₹{dashboardData.totalSpent.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Available Credits</p>
                <p className="text-2xl font-bold text-green-600">{dashboardData.availableCredits}</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Transactions</p>
                <p className="text-2xl font-bold text-yellow-600">{dashboardData.pendingTransactions}</p>
              </div>
              <BarChart className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6 overflow-x-auto">
              {[
                { id: 'overview', label: 'Overview', icon: TrendingUp },
                { id: 'marketplace', label: 'Marketplace', icon: ShoppingCart },
                { id: 'transactions', label: 'Transactions', icon: BarChart }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
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
                <h3 className="text-xl font-semibold">Company Overview</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                              </div>
                              <p className="text-blue-600 font-medium">₹{transaction.amount.toLocaleString()}</p>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{new Date(transaction.date).toLocaleDateString()}</p>
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
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">Available in Marketplace</h4>
                    {dashboardData.availableMarketplace && dashboardData.availableMarketplace.length > 0 ? (
                      <div className="space-y-3">
                        {dashboardData.availableMarketplace.slice(0, 3).map((item: any, index: number) => (
                          <div key={index} className="bg-white p-3 rounded-md shadow-sm">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-medium">{item.credits} Credits</p>
                                <p className="text-xs text-gray-500">Farmer: {item.farmerName}</p>
                                <p className="text-xs text-gray-500">Location: {item.location}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-green-600 font-medium">₹{item.price.toLocaleString()}</p>
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  item.verificationStatus === 'verified' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {item.verificationStatus.charAt(0).toUpperCase() + item.verificationStatus.slice(1)}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                        <Button 
                          variant="outline" 
                          className="w-full mt-2 text-green-600 border-green-200"
                          onClick={() => setActiveTab('marketplace')}
                        >
                          Browse Marketplace
                        </Button>
                      </div>
                    ) : (
                      <p className="text-sm text-green-700">No credits currently available</p>
                    )}
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg mt-6">
                  <h4 className="font-semibold text-gray-800 mb-4">Carbon Offset Impact</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-md shadow-sm">
                      <p className="text-sm text-gray-500">CO2 Offset</p>
                      <p className="text-xl font-bold text-gray-800">{(dashboardData.totalCredits * 0.5).toFixed(1)} tons</p>
                    </div>
                    <div className="bg-white p-4 rounded-md shadow-sm">
                      <p className="text-sm text-gray-500">Trees Planted</p>
                      <p className="text-xl font-bold text-gray-800">{dashboardData.totalCredits * 10}</p>
                    </div>
                    <div className="bg-white p-4 rounded-md shadow-sm">
                      <p className="text-sm text-gray-500">Farmers Supported</p>
                      <p className="text-xl font-bold text-gray-800">
                        {new Set(dashboardData.recentTransactions.map((t: any) => t.farmerId)).size}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'marketplace' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Carbon Credit Marketplace</h3>
                
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                      placeholder="Search by farmer name or location"
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
                      <option value="verified">Verified Only</option>
                      <option value="pending">Pending Verification</option>
                    </select>
                  </div>
                </div>
                
                {filteredMarketplace.length > 0 ? (
                  <div className="space-y-4">
                    {filteredMarketplace.map((item: any, index: number) => (
                      <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                        <div className="flex flex-col md:flex-row justify-between">
                          <div className="mb-4 md:mb-0">
                            <div className="flex items-center mb-2">
                              <h4 className="font-semibold text-gray-800">{item.farmerName}</h4>
                              <span className={`ml-2 text-xs px-2 py-1 rounded-full ${
                                item.verificationStatus === 'verified' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {item.verificationStatus.charAt(0).toUpperCase() + item.verificationStatus.slice(1)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">Location: {item.location}</p>
                            <p className="text-sm text-gray-600">Practice: {item.practiceType}</p>
                            <p className="text-sm text-gray-600">Available Credits: {item.credits}</p>
                          </div>
                          
                          <div className="flex flex-col justify-between items-end">
                            <div className="text-right mb-4 md:mb-0">
                              <p className="text-lg font-bold text-green-600">₹{item.price.toLocaleString()}</p>
                              <p className="text-xs text-gray-500">₹{(item.price / item.credits).toFixed(2)} per credit</p>
                            </div>
                            
                            <Button 
                              className="bg-blue-600 hover:bg-blue-700"
                              onClick={() => handlePurchaseCredits(item._id)}
                              disabled={isLoading || item.verificationStatus !== 'verified'}
                            >
                              {isLoading ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Processing...
                                </>
                              ) : (
                                <>
                                  Purchase Credits
                                  <ArrowRight className="ml-2 h-4 w-4" />
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <ShoppingCart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h4 className="text-lg font-medium text-gray-900">No carbon credits found</h4>
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
                              <div className="text-sm text-gray-500">{transaction.location}</div>
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
                    <p className="text-gray-500 mt-1">Your transaction history will appear here</p>
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

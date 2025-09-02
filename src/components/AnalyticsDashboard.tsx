'use client'

import { useState } from 'react'
// Note: Install recharts with: npm install recharts
// For now, using placeholder charts - replace with actual recharts when installed
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Leaf, 
  MapPin, 
  Calendar,
  DollarSign,
  Target
} from 'lucide-react'

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState('6months')

  // Sample data for charts
  const monthlyCredits = [
    { month: 'Jul', credits: 120, revenue: 18000 },
    { month: 'Aug', credits: 145, revenue: 21750 },
    { month: 'Sep', credits: 180, revenue: 27000 },
    { month: 'Oct', credits: 220, revenue: 33000 },
    { month: 'Nov', credits: 195, revenue: 29250 },
    { month: 'Dec', credits: 280, revenue: 42000 }
  ]

  const practiceDistribution = [
    { name: 'Organic Farming', value: 35, color: '#10B981' },
    { name: 'Agroforestry', value: 25, color: '#3B82F6' },
    { name: 'Water Conservation', value: 20, color: '#8B5CF6' },
    { name: 'Crop Rotation', value: 15, color: '#F59E0B' },
    { name: 'Others', value: 5, color: '#EF4444' }
  ]

  const stateWiseData = [
    { state: 'Punjab', farmers: 45, credits: 680 },
    { state: 'Haryana', farmers: 38, credits: 520 },
    { state: 'UP', farmers: 52, credits: 750 },
    { state: 'Bihar', farmers: 29, credits: 410 },
    { state: 'Gujarat', farmers: 34, credits: 480 },
    { state: 'Maharashtra', farmers: 41, credits: 590 }
  ]

  const kpiData = [
    {
      title: 'Total Carbon Credits',
      value: '2,847',
      change: '+12.5%',
      trend: 'up',
      icon: Leaf,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Active Farmers',
      value: '239',
      change: '+8.2%',
      trend: 'up',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Total Revenue',
      value: '₹4.27L',
      change: '+15.3%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Avg. Price/Credit',
      value: '₹150',
      change: '-2.1%',
      trend: 'down',
      icon: Target,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">Carbon credit platform performance metrics</p>
        </div>
        <div className="mt-4 md:mt-0">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="1month">Last Month</option>
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => (
          <div key={index} className={`${kpi.bgColor} p-6 rounded-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                <p className={`text-2xl font-bold ${kpi.color} mt-1`}>{kpi.value}</p>
                <div className="flex items-center mt-2">
                  {kpi.trend === 'up' ? (
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm font-medium ${
                    kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {kpi.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">vs last period</span>
                </div>
              </div>
              <kpi.icon className={`h-8 w-8 ${kpi.color}`} />
            </div>
          </div>
        ))}
      </div>

        {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Credits Trend */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Credits & Revenue</h3>
          <div className="h-64 flex items-end justify-between space-x-2 p-4 bg-gray-50 rounded-lg">
            {monthlyCredits.map((data, index) => (
              <div key={data.month} className="flex flex-col items-center space-y-2">
                <div 
                  className="bg-green-500 rounded-t-md w-8 transition-all hover:bg-green-600"
                  style={{ height: `${(data.credits / 300) * 200}px` }}
                  title={`${data.credits} credits`}
                ></div>
                <span className="text-xs text-gray-600">{data.month}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-center space-x-4 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
              <span>Credits Generated</span>
            </div>
          </div>
        </div>

        {/* Practice Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sustainable Practices Distribution</h3>
          <div className="space-y-3">
            {practiceDistribution.map((practice, index) => (
              <div key={practice.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: practice.color }}
                  ></div>
                  <span className="text-sm text-gray-700">{practice.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full"
                      style={{ 
                        backgroundColor: practice.color,
                        width: `${practice.value * 2}%`
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{practice.value}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* State-wise Performance */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">State-wise Performance</h3>
          <div className="space-y-4">
            {stateWiseData.map((state, index) => (
              <div key={state.state} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="font-medium text-gray-900">{state.state}</span>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="text-center">
                    <div className="text-blue-600 font-semibold">{state.farmers}</div>
                    <div className="text-gray-500">Farmers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-green-600 font-semibold">{state.credits}</div>
                    <div className="text-gray-500">Credits</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[
              {
                type: 'credit_generated',
                farmer: 'राम कुमार शर्मा',
                amount: 45,
                time: '2 hours ago',
                icon: Leaf,
                color: 'text-green-600'
              },
              {
                type: 'credit_sold',
                farmer: 'सुनीता देवी',
                amount: 32,
                buyer: 'TechCorp Ltd',
                time: '4 hours ago',
                icon: DollarSign,
                color: 'text-blue-600'
              },
              {
                type: 'farmer_joined',
                farmer: 'मुकेश पटेल',
                location: 'Gujarat',
                time: '6 hours ago',
                icon: Users,
                color: 'text-purple-600'
              },
              {
                type: 'verification_completed',
                farmer: 'लक्ष्मी नायडू',
                amount: 28,
                time: '8 hours ago',
                icon: Target,
                color: 'text-orange-600'
              }
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <activity.icon className={`h-5 w-5 ${activity.color}`} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.type === 'credit_generated' && `${activity.farmer} generated ${activity.amount} credits`}
                    {activity.type === 'credit_sold' && `${activity.farmer} sold ${activity.amount} credits to ${activity.buyer}`}
                    {activity.type === 'farmer_joined' && `${activity.farmer} joined from ${activity.location}`}
                    {activity.type === 'verification_completed' && `${activity.farmer}'s ${activity.amount} credits verified`}
                  </p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Impact Summary */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg p-8">
        <h3 className="text-2xl font-bold mb-6">Environmental Impact Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">7,120 tons</div>
            <div className="text-sm opacity-90">CO₂ Offset</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">15,680 acres</div>
            <div className="text-sm opacity-90">Sustainable Farming</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">239 farmers</div>
            <div className="text-sm opacity-90">Lives Impacted</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">₹4.27L</div>
            <div className="text-sm opacity-90">Additional Income</div>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-gray-900">Growing Adoption</p>
                <p className="text-sm text-gray-600">Organic farming practices show 35% adoption rate among registered farmers</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-gray-900">Regional Performance</p>
                <p className="text-sm text-gray-600">Uttar Pradesh leads with 52 active farmers and 750 credits generated</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-gray-900">Revenue Growth</p>
                <p className="text-sm text-gray-600">15.3% increase in total revenue compared to previous period</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-gray-900">Market Stability</p>
                <p className="text-sm text-gray-600">Average credit price remains stable at ₹150 with minor fluctuations</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

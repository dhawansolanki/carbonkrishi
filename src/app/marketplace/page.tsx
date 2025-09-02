'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Header from '@/components/Header'
import { 
  Search, 
  Filter, 
  MapPin, 
  Leaf, 
  Star, 
  ShoppingCart,
  Eye,
  CheckCircle,
  TrendingUp
} from 'lucide-react'

export default function Marketplace() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [cartItems, setCartItems] = useState<number[]>([])

  const carbonCredits = [
    {
      id: 1,
      farmer: 'राम कुमार शर्मा',
      location: 'Sonipat, Haryana',
      credits: 45,
      pricePerCredit: 150,
      practice: 'Organic Farming',
      cropType: 'Rice',
      farmSize: '3.2 acres',
      rating: 4.8,
      verified: true,
      description: 'Certified organic rice farming with zero chemical fertilizers and pesticides',
      image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 2,
      farmer: 'सुनीता देवी',
      location: 'Muzaffarpur, Bihar',
      credits: 32,
      pricePerCredit: 140,
      practice: 'Agroforestry',
      cropType: 'Wheat',
      farmSize: '2.8 acres',
      rating: 4.9,
      verified: true,
      description: 'Integrated crop-tree farming system with 100+ trees planted',
      image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 3,
      farmer: 'मुकेश पटेल',
      location: 'Anand, Gujarat',
      credits: 58,
      pricePerCredit: 160,
      practice: 'Water Conservation',
      cropType: 'Cotton',
      farmSize: '4.5 acres',
      rating: 4.7,
      verified: true,
      description: 'Drip irrigation and rainwater harvesting implementation',
      image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 4,
      farmer: 'लक्ष्मी नायडू',
      location: 'Warangal, Telangana',
      credits: 41,
      pricePerCredit: 145,
      practice: 'Crop Rotation',
      cropType: 'Vegetables',
      farmSize: '2.1 acres',
      rating: 4.6,
      verified: true,
      description: 'Multi-crop rotation system reducing soil degradation',
      image: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    }
  ]

  const addToCart = (creditId: number) => {
    setCartItems(prev => [...prev, creditId])
  }

  const removeFromCart = (creditId: number) => {
    setCartItems(prev => prev.filter(id => id !== creditId))
  }

  const filteredCredits = carbonCredits.filter(credit => {
    const matchesSearch = credit.farmer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         credit.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         credit.practice.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (selectedFilter === 'all') return matchesSearch
    if (selectedFilter === 'organic') return matchesSearch && credit.practice === 'Organic Farming'
    if (selectedFilter === 'agroforestry') return matchesSearch && credit.practice === 'Agroforestry'
    if (selectedFilter === 'water') return matchesSearch && credit.practice === 'Water Conservation'
    
    return matchesSearch
  })

  const totalCartValue = cartItems.reduce((total, itemId) => {
    const credit = carbonCredits.find(c => c.id === itemId)
    return total + (credit ? credit.credits * credit.pricePerCredit : 0)
  }, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Marketplace Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Carbon Credit Marketplace
          </h1>
          <p className="text-lg text-gray-600">
            Verified carbon credits from Indian farmers practicing sustainable agriculture
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <div className="text-2xl font-bold text-green-600">2,847</div>
            <div className="text-sm text-gray-600">Total Credits Available</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <div className="text-2xl font-bold text-blue-600">₹142</div>
            <div className="text-sm text-gray-600">Average Price per Credit</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <div className="text-2xl font-bold text-purple-600">156</div>
            <div className="text-sm text-gray-600">Verified Farmers</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <div className="text-2xl font-bold text-orange-600">98.2%</div>
            <div className="text-sm text-gray-600">Verification Rate</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search by farmer name, location, or practice..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                className="p-2 border border-gray-300 rounded-md"
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
              >
                <option value="all">All Practices</option>
                <option value="organic">Organic Farming</option>
                <option value="agroforestry">Agroforestry</option>
                <option value="water">Water Conservation</option>
              </select>
            </div>

            {cartItems.length > 0 && (
              <div className="flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-lg">
                <ShoppingCart className="h-5 w-5 text-green-600" />
                <span className="text-green-800 font-semibold">
                  {cartItems.length} items - ₹{totalCartValue.toLocaleString()}
                </span>
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  Checkout
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Carbon Credits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCredits.map((credit) => (
            <div key={credit.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img 
                  src={credit.image} 
                  alt={`${credit.farmer}'s farm`}
                  className="w-full h-48 object-cover"
                />
                {credit.verified && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs flex items-center">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Verified
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{credit.farmer}</h3>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600 ml-1">{credit.rating}</span>
                  </div>
                </div>
                
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">{credit.location}</span>
                </div>
                
                <div className="flex items-center text-gray-600 mb-3">
                  <Leaf className="h-4 w-4 mr-1" />
                  <span className="text-sm">{credit.practice} • {credit.cropType}</span>
                </div>
                
                <p className="text-sm text-gray-600 mb-4">{credit.description}</p>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <div className="text-sm text-gray-600">Available Credits</div>
                      <div className="text-xl font-bold text-green-600">{credit.credits}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Price per Credit</div>
                      <div className="text-xl font-bold text-blue-600">₹{credit.pricePerCredit}</div>
                    </div>
                  </div>
                  
                  <div className="text-center mb-3">
                    <div className="text-sm text-gray-600">Total Value</div>
                    <div className="text-2xl font-bold text-purple-600">
                      ₹{(credit.credits * credit.pricePerCredit).toLocaleString()}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Details
                    </Button>
                    
                    {cartItems.includes(credit.id) ? (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 text-red-600 border-red-600 hover:bg-red-50"
                        onClick={() => removeFromCart(credit.id)}
                      >
                        Remove
                      </Button>
                    ) : (
                      <Button 
                        size="sm" 
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        onClick={() => addToCart(credit.id)}
                      >
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        Buy Credits
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCredits.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No credits found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Impact Section */}
        <div className="mt-16 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg p-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Your Carbon Impact</h2>
            <p className="text-lg mb-6">
              Every carbon credit purchase directly supports sustainable farming and helps combat climate change
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 mx-auto mb-2" />
                <div className="text-2xl font-bold">2.5 tons</div>
                <div className="text-sm opacity-90">CO₂ offset per credit</div>
              </div>
              <div className="text-center">
                <Leaf className="h-12 w-12 mx-auto mb-2" />
                <div className="text-2xl font-bold">156</div>
                <div className="text-sm opacity-90">Farmers supported</div>
              </div>
              <div className="text-center">
                <MapPin className="h-12 w-12 mx-auto mb-2" />
                <div className="text-2xl font-bold">12 states</div>
                <div className="text-sm opacity-90">Across India</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

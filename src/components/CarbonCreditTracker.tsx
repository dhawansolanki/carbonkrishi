'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Satellite, 
  Camera, 
  MapPin,
  Leaf,
  TrendingUp,
  Eye,
  Download
} from 'lucide-react'

interface CarbonCredit {
  id: string
  farmerId: string
  farmerName: string
  practice: string
  cropType: string
  farmSize: number
  location: string
  creditsGenerated: number
  status: 'pending' | 'verifying' | 'verified' | 'rejected'
  submissionDate: string
  verificationDate?: string
  evidenceUploaded: boolean
  satelliteVerified: boolean
  aiAnalysisScore: number
  blockchainHash?: string
}

export default function CarbonCreditTracker() {
  const [selectedCredit, setSelectedCredit] = useState<CarbonCredit | null>(null)
  
  const carbonCredits: CarbonCredit[] = [
    {
      id: 'CC-2024-001',
      farmerId: 'F001',
      farmerName: 'राम कुमार शर्मा',
      practice: 'Organic Farming',
      cropType: 'Rice',
      farmSize: 3.2,
      location: 'Sonipat, Haryana',
      creditsGenerated: 45,
      status: 'verified',
      submissionDate: '2024-01-15',
      verificationDate: '2024-01-20',
      evidenceUploaded: true,
      satelliteVerified: true,
      aiAnalysisScore: 92,
      blockchainHash: '0x1a2b3c4d5e6f7890abcdef1234567890'
    },
    {
      id: 'CC-2024-002',
      farmerId: 'F002',
      farmerName: 'सुनीता देवी',
      practice: 'Agroforestry',
      cropType: 'Wheat',
      farmSize: 2.8,
      location: 'Muzaffarpur, Bihar',
      creditsGenerated: 32,
      status: 'verifying',
      submissionDate: '2024-01-18',
      evidenceUploaded: true,
      satelliteVerified: false,
      aiAnalysisScore: 87
    },
    {
      id: 'CC-2024-003',
      farmerId: 'F003',
      farmerName: 'मुकेश पटेल',
      practice: 'Water Conservation',
      cropType: 'Cotton',
      farmSize: 4.5,
      location: 'Anand, Gujarat',
      creditsGenerated: 58,
      status: 'pending',
      submissionDate: '2024-01-22',
      evidenceUploaded: false,
      satelliteVerified: false,
      aiAnalysisScore: 0
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'text-green-600 bg-green-100'
      case 'verifying': return 'text-blue-600 bg-blue-100'
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      case 'rejected': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle className="h-4 w-4" />
      case 'verifying': return <Clock className="h-4 w-4" />
      case 'pending': return <AlertCircle className="h-4 w-4" />
      case 'rejected': return <AlertCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Carbon Credit Tracking & Verification
        </h2>
        <p className="text-gray-600">
          Real-time tracking of carbon credit generation and verification process
        </p>
      </div>

      <div className="p-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Verified Credits</p>
                <p className="text-2xl font-bold text-green-700">45</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Under Verification</p>
                <p className="text-2xl font-bold text-blue-700">32</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600 font-medium">Pending Review</p>
                <p className="text-2xl font-bold text-yellow-700">58</p>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Total Value</p>
                <p className="text-2xl font-bold text-purple-700">₹20,250</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Credits List */}
        <div className="space-y-4">
          {carbonCredits.map((credit) => (
            <div key={credit.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{credit.id}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(credit.status)}`}>
                      {getStatusIcon(credit.status)}
                      <span className="ml-1 capitalize">{credit.status}</span>
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div>
                      <p className="font-medium">Farmer</p>
                      <p>{credit.farmerName}</p>
                    </div>
                    <div>
                      <p className="font-medium">Practice</p>
                      <p>{credit.practice}</p>
                    </div>
                    <div>
                      <p className="font-medium">Credits Generated</p>
                      <p className="text-green-600 font-semibold">{credit.creditsGenerated}</p>
                    </div>
                    <div>
                      <p className="font-medium">Submission Date</p>
                      <p>{credit.submissionDate}</p>
                    </div>
                  </div>

                  {/* Verification Progress */}
                  <div className="mt-4">
                    <div className="flex items-center space-x-6 text-sm">
                      <div className={`flex items-center space-x-1 ${credit.evidenceUploaded ? 'text-green-600' : 'text-gray-400'}`}>
                        <Camera className="h-4 w-4" />
                        <span>Evidence Uploaded</span>
                        {credit.evidenceUploaded && <CheckCircle className="h-4 w-4" />}
                      </div>
                      
                      <div className={`flex items-center space-x-1 ${credit.satelliteVerified ? 'text-green-600' : 'text-gray-400'}`}>
                        <Satellite className="h-4 w-4" />
                        <span>Satellite Verified</span>
                        {credit.satelliteVerified && <CheckCircle className="h-4 w-4" />}
                      </div>
                      
                      {credit.aiAnalysisScore > 0 && (
                        <div className="flex items-center space-x-1 text-blue-600">
                          <Leaf className="h-4 w-4" />
                          <span>AI Score: {credit.aiAnalysisScore}%</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4 lg:mt-0 lg:ml-6 flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedCredit(credit)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View Details
                  </Button>
                  
                  {credit.status === 'verified' && (
                    <Button 
                      size="sm" 
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Certificate
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Detailed View Modal */}
        {selectedCredit && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">
                    Credit Details: {selectedCredit.id}
                  </h3>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedCredit(null)}
                  >
                    Close
                  </Button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Farmer Information */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Farmer Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Name</p>
                      <p className="font-medium">{selectedCredit.farmerName}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Farmer ID</p>
                      <p className="font-medium">{selectedCredit.farmerId}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Location</p>
                      <p className="font-medium">{selectedCredit.location}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Farm Size</p>
                      <p className="font-medium">{selectedCredit.farmSize} acres</p>
                    </div>
                  </div>
                </div>

                {/* Practice Information */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Sustainable Practice</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Practice Type</p>
                      <p className="font-medium">{selectedCredit.practice}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Crop Type</p>
                      <p className="font-medium">{selectedCredit.cropType}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Credits Generated</p>
                      <p className="font-medium text-green-600">{selectedCredit.creditsGenerated}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Estimated Value</p>
                      <p className="font-medium text-green-600">₹{(selectedCredit.creditsGenerated * 150).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* Verification Status */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Verification Status</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Camera className="h-5 w-5 text-gray-600" />
                        <span>Evidence Documentation</span>
                      </div>
                      {selectedCredit.evidenceUploaded ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <Clock className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Satellite className="h-5 w-5 text-gray-600" />
                        <span>Satellite Verification</span>
                      </div>
                      {selectedCredit.satelliteVerified ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <Clock className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Leaf className="h-5 w-5 text-gray-600" />
                        <span>AI Analysis Score</span>
                      </div>
                      <span className="font-semibold text-blue-600">{selectedCredit.aiAnalysisScore}%</span>
                    </div>
                  </div>
                </div>

                {/* Blockchain Information */}
                {selectedCredit.blockchainHash && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Blockchain Registry</h4>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Transaction Hash</p>
                      <p className="font-mono text-sm text-blue-600 break-all">{selectedCredit.blockchainHash}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Shield, 
  Link as LinkIcon, 
  Copy, 
  Search, 
  CheckCircle, 
  Clock,
  Hash,
  Calendar,
  User,
  Leaf
} from 'lucide-react'

interface BlockchainTransaction {
  hash: string
  creditId: string
  farmerName: string
  buyerName?: string
  creditsAmount: number
  transactionType: 'mint' | 'transfer' | 'retire'
  timestamp: string
  blockNumber: number
  gasUsed: string
  status: 'confirmed' | 'pending'
}

export default function BlockchainRegistry() {
  const [searchHash, setSearchHash] = useState('')
  const [selectedTransaction, setSelectedTransaction] = useState<BlockchainTransaction | null>(null)

  const transactions: BlockchainTransaction[] = [
    {
      hash: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12',
      creditId: 'CC-2024-001',
      farmerName: 'राम कुमार शर्मा',
      buyerName: 'TechCorp Ltd',
      creditsAmount: 45,
      transactionType: 'transfer',
      timestamp: '2024-01-20T10:30:00Z',
      blockNumber: 18542156,
      gasUsed: '0.0021 ETH',
      status: 'confirmed'
    },
    {
      hash: '0x2b3c4d5e6f7890abcdef1234567890abcdef1234',
      creditId: 'CC-2024-002',
      farmerName: 'सुनीता देवी',
      creditsAmount: 32,
      transactionType: 'mint',
      timestamp: '2024-01-18T14:45:00Z',
      blockNumber: 18541892,
      gasUsed: '0.0018 ETH',
      status: 'confirmed'
    },
    {
      hash: '0x3c4d5e6f7890abcdef1234567890abcdef123456',
      creditId: 'CC-2024-003',
      farmerName: 'मुकेश पटेल',
      creditsAmount: 58,
      transactionType: 'mint',
      timestamp: '2024-01-22T09:15:00Z',
      blockNumber: 18542890,
      gasUsed: '0.0025 ETH',
      status: 'pending'
    }
  ]

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case 'mint': return 'bg-green-100 text-green-800'
      case 'transfer': return 'bg-blue-100 text-blue-800'
      case 'retire': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    return status === 'confirmed' ? 'text-green-600' : 'text-yellow-600'
  }

  const filteredTransactions = transactions.filter(tx => 
    searchHash === '' || 
    tx.hash.toLowerCase().includes(searchHash.toLowerCase()) ||
    tx.creditId.toLowerCase().includes(searchHash.toLowerCase())
  )

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3 mb-4">
          <Shield className="h-8 w-8 text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Blockchain Registry</h2>
            <p className="text-gray-600">Immutable carbon credit transaction records</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder="Search by transaction hash or credit ID..."
            className="pl-10"
            value={searchHash}
            onChange={(e) => setSearchHash(e.target.value)}
          />
        </div>
      </div>

      <div className="p-6">
        {/* Registry Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600">1,247</div>
            <div className="text-sm text-blue-600">Total Transactions</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">892</div>
            <div className="text-sm text-green-600">Credits Minted</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-purple-600">355</div>
            <div className="text-sm text-purple-600">Credits Transferred</div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-orange-600">99.9%</div>
            <div className="text-sm text-orange-600">Uptime</div>
          </div>
        </div>

        {/* Transactions List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
          
          {filteredTransactions.map((transaction) => (
            <div key={transaction.hash} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTransactionTypeColor(transaction.transactionType)}`}>
                      {transaction.transactionType.toUpperCase()}
                    </span>
                    <div className={`flex items-center space-x-1 ${getStatusColor(transaction.status)}`}>
                      {transaction.status === 'confirmed' ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <Clock className="h-4 w-4" />
                      )}
                      <span className="text-sm font-medium capitalize">{transaction.status}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600 font-medium">Transaction Hash</p>
                      <div className="flex items-center space-x-2">
                        <p className="font-mono text-blue-600">{transaction.hash.slice(0, 10)}...</p>
                        <button 
                          onClick={() => copyToClipboard(transaction.hash)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-gray-600 font-medium">Credit ID</p>
                      <p className="text-green-600 font-semibold">{transaction.creditId}</p>
                    </div>
                    
                    <div>
                      <p className="text-gray-600 font-medium">Amount</p>
                      <p className="font-semibold">{transaction.creditsAmount} Credits</p>
                    </div>
                    
                    <div>
                      <p className="text-gray-600 font-medium">Block Number</p>
                      <p className="font-mono">{transaction.blockNumber.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center space-x-6 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>From: {transaction.farmerName}</span>
                    </div>
                    {transaction.buyerName && (
                      <div className="flex items-center space-x-1">
                        <LinkIcon className="h-4 w-4" />
                        <span>To: {transaction.buyerName}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(transaction.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 lg:mt-0 lg:ml-6">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedTransaction(transaction)}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No transactions found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        )}

        {/* Transaction Details Modal */}
        {selectedTransaction && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">Transaction Details</h3>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedTransaction(null)}
                  >
                    Close
                  </Button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Transaction Info */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Transaction Information</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600">Transaction Hash</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-sm">{selectedTransaction.hash}</span>
                        <button 
                          onClick={() => copyToClipboard(selectedTransaction.hash)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600">Block Number</span>
                      <span className="font-mono">{selectedTransaction.blockNumber.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600">Gas Used</span>
                      <span className="font-mono">{selectedTransaction.gasUsed}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600">Timestamp</span>
                      <span>{new Date(selectedTransaction.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Credit Details */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Credit Details</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-gray-600">Credit ID</span>
                      <span className="font-semibold text-green-600">{selectedTransaction.creditId}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-gray-600">Credits Amount</span>
                      <span className="font-semibold">{selectedTransaction.creditsAmount}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-gray-600">Transaction Type</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTransactionTypeColor(selectedTransaction.transactionType)}`}>
                        {selectedTransaction.transactionType.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Parties Involved */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Parties Involved</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span className="text-gray-600">Farmer</span>
                      <span className="font-medium">{selectedTransaction.farmerName}</span>
                    </div>
                    
                    {selectedTransaction.buyerName && (
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <span className="text-gray-600">Buyer</span>
                        <span className="font-medium">{selectedTransaction.buyerName}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Verification Badge */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-8 w-8 text-green-600" />
                    <div>
                      <h5 className="font-semibold text-gray-900">Blockchain Verified</h5>
                      <p className="text-sm text-gray-600">
                        This transaction is immutably recorded on the blockchain and cannot be altered or deleted.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Blockchain Info */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="h-8 w-8" />
            <h3 className="text-xl font-bold">Blockchain Security</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <Hash className="h-5 w-5 mb-2" />
              <p className="font-semibold">Immutable Records</p>
              <p className="opacity-90">All transactions are permanently recorded</p>
            </div>
            <div>
              <CheckCircle className="h-5 w-5 mb-2" />
              <p className="font-semibold">Transparent Verification</p>
              <p className="opacity-90">Public verification of all carbon credits</p>
            </div>
            <div>
              <Leaf className="h-5 w-5 mb-2" />
              <p className="font-semibold">Environmental Impact</p>
              <p className="opacity-90">Trackable carbon offset contributions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

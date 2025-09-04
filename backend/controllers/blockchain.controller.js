const CarbonCredit = require('../models/carbonCredit.model');
const Transaction = require('../models/transaction.model');
const crypto = require('crypto');

// Helper function to generate a random hash
const generateHash = (data) => {
  return crypto.createHash('sha256').update(JSON.stringify(data) + Date.now()).digest('hex');
};

// @desc    Get blockchain registry entries
// @route   GET /api/blockchain/registry
// @access  Public
const getBlockchainRegistry = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    
    // Build filter
    let filter = { 'blockchainDetails.registered': true };
    
    if (search) {
      filter = {
        ...filter,
        $or: [
          { 'blockchainDetails.transactionHash': { $regex: search, $options: 'i' } },
          { _id: search.match(/^[0-9a-fA-F]{24}$/) ? search : null }
        ]
      };
    }
    
    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);
    
    // Get registered credits
    const registeredCredits = await CarbonCredit.find(filter)
      .sort({ 'blockchainDetails.timestamp': -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate({
        path: 'farmerId',
        select: 'farmDetails.farmName farmDetails.farmLocation'
      });
      
    // Get total count for pagination
    const total = await CarbonCredit.countDocuments(filter);
    
    res.json({
      registry: registeredCredits.map(credit => ({
        id: credit._id,
        transactionHash: credit.blockchainDetails.transactionHash,
        blockNumber: credit.blockchainDetails.blockNumber,
        timestamp: credit.blockchainDetails.timestamp,
        creditAmount: credit.creditAmount,
        status: credit.status,
        farmerName: credit.farmerId?.farmDetails?.farmName || 'Anonymous Farmer',
        location: credit.metadata?.location || {},
        practiceType: credit.metadata?.practiceType || 'Unknown'
      })),
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get blockchain transaction details
// @route   GET /api/blockchain/transaction/:hash
// @access  Public
const getTransactionDetails = async (req, res) => {
  try {
    const { hash } = req.params;
    
    // Check for carbon credit with this hash
    const credit = await CarbonCredit.findOne({
      'blockchainDetails.transactionHash': hash
    }).populate({
      path: 'farmerId',
      select: 'farmDetails.farmName farmDetails.farmLocation userId'
    });
    
    // Check for marketplace transaction with this hash
    const transaction = await Transaction.findOne({
      'blockchainDetails.transactionHash': hash
    }).populate({
      path: 'sellerId',
      select: 'farmDetails.farmName'
    }).populate({
      path: 'buyerId',
      select: 'companyDetails.companyName'
    });
    
    if (!credit && !transaction) {
      return res.status(404).json({ message: 'Blockchain transaction not found' });
    }
    
    if (credit) {
      return res.json({
        type: 'credit_generation',
        transactionHash: credit.blockchainDetails.transactionHash,
        blockNumber: credit.blockchainDetails.blockNumber,
        timestamp: credit.blockchainDetails.timestamp,
        data: {
          creditId: credit._id,
          farmerId: credit.farmerId?._id,
          farmerName: credit.farmerId?.farmDetails?.farmName || 'Anonymous Farmer',
          location: credit.metadata?.location || {},
          practiceType: credit.metadata?.practiceType || 'Unknown',
          creditAmount: credit.creditAmount,
          status: credit.status,
          verificationScore: credit.verificationDetails?.verificationScore || 0,
          verificationMethod: credit.verificationDetails?.verificationMethod || 'Unknown'
        }
      });
    }
    
    if (transaction) {
      return res.json({
        type: 'credit_transfer',
        transactionHash: transaction.blockchainDetails.transactionHash,
        blockNumber: transaction.blockchainDetails.blockNumber,
        timestamp: transaction.blockchainDetails.timestamp,
        data: {
          transactionId: transaction._id,
          seller: transaction.sellerId?.farmDetails?.farmName || 'Anonymous Farmer',
          buyer: transaction.buyerId?.companyDetails?.companyName || 'Anonymous Company',
          totalCredits: transaction.totalCredits,
          totalAmount: transaction.totalAmount,
          status: transaction.status,
          credits: transaction.carbonCredits.map(c => ({
            creditId: c.creditId,
            quantity: c.quantity,
            pricePerCredit: c.pricePerCredit
          }))
        }
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Register a carbon credit on blockchain
// @route   POST /api/blockchain/register
// @access  Private (Admin only)
const registerOnBlockchain = async (req, res) => {
  try {
    const { creditId } = req.body;
    
    const credit = await CarbonCredit.findById(creditId);
    
    if (!credit) {
      return res.status(404).json({ message: 'Carbon credit not found' });
    }
    
    if (credit.blockchainDetails.registered) {
      return res.status(400).json({ message: 'Credit already registered on blockchain' });
    }
    
    // Simulate blockchain registration
    credit.blockchainDetails = {
      registered: true,
      transactionHash: `0x${generateHash(credit)}`,
      blockNumber: Math.floor(Math.random() * 1000000),
      timestamp: new Date()
    };
    
    await credit.save();
    
    res.json({
      message: 'Carbon credit registered on blockchain successfully',
      blockchainDetails: credit.blockchainDetails
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Verify a blockchain transaction
// @route   GET /api/blockchain/verify/:hash
// @access  Public
const verifyTransaction = async (req, res) => {
  try {
    const { hash } = req.params;
    
    // Check if transaction exists in our system
    const creditExists = await CarbonCredit.exists({
      'blockchainDetails.transactionHash': hash
    });
    
    const transactionExists = await Transaction.exists({
      'blockchainDetails.transactionHash': hash
    });
    
    if (!creditExists && !transactionExists) {
      return res.status(404).json({
        verified: false,
        message: 'Transaction hash not found on blockchain'
      });
    }
    
    // Simulate blockchain verification
    res.json({
      verified: true,
      message: 'Transaction verified on blockchain',
      verificationTimestamp: new Date()
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getBlockchainRegistry,
  getTransactionDetails,
  registerOnBlockchain,
  verifyTransaction
};

const CarbonCredit = require('../models/carbonCredit.model');
const Farmer = require('../models/farmer.model');
const Transaction = require('../models/transaction.model');

// @desc    Get marketplace statistics
// @route   GET /api/marketplace/stats
// @access  Public
const getMarketplaceStats = async (req, res) => {
  try {
    // Get total available credits
    const totalAvailableCredits = await CarbonCredit.aggregate([
      { $match: { status: 'available' } },
      { $group: { _id: null, total: { $sum: '$creditAmount' } } }
    ]);

    // Get total sold credits
    const totalSoldCredits = await CarbonCredit.aggregate([
      { $match: { status: 'sold' } },
      { $group: { _id: null, total: { $sum: '$creditAmount' } } }
    ]);

    // Get average price per credit
    const avgPricePerCredit = await CarbonCredit.aggregate([
      { $match: { status: 'available' } },
      { $group: { _id: null, avg: { $avg: '$pricePerCredit' } } }
    ]);

    // Get total farmers
    const totalFarmers = await Farmer.countDocuments();

    // Get practice type distribution
    const practiceDistribution = await CarbonCredit.aggregate([
      { $group: { _id: '$metadata.practiceType', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Get state distribution
    const stateDistribution = await CarbonCredit.aggregate([
      { $group: { _id: '$metadata.location.state', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Get recent transactions
    const recentTransactions = await Transaction.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('totalCredits totalAmount createdAt')
      .lean();

    res.json({
      totalAvailableCredits: totalAvailableCredits[0]?.total || 0,
      totalSoldCredits: totalSoldCredits[0]?.total || 0,
      avgPricePerCredit: avgPricePerCredit[0]?.avg || 0,
      totalFarmers,
      practiceDistribution: practiceDistribution.map(item => ({
        practice: item._id || 'Unknown',
        count: item.count
      })),
      stateDistribution: stateDistribution.map(item => ({
        state: item._id || 'Unknown',
        count: item.count
      })),
      recentTransactions: recentTransactions.map(tx => ({
        date: tx.createdAt,
        credits: tx.totalCredits,
        amount: tx.totalAmount
      }))
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get available carbon credits for public view
// @route   GET /api/marketplace/credits
// @access  Public
const getPublicCredits = async (req, res) => {
  try {
    // Get query parameters for filtering
    const { 
      state, 
      practiceType,
      page = 1,
      limit = 10
    } = req.query;

    // Build filter
    const filter = { status: 'available' };
    
    if (state) {
      filter['metadata.location.state'] = state;
    }
    
    if (practiceType) {
      filter['metadata.practiceType'] = practiceType;
    }

    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Get credits with pagination
    const credits = await CarbonCredit.find(filter)
      .sort({ pricePerCredit: 1 })
      .skip(skip)
      .limit(Number(limit))
      .populate({
        path: 'farmerId',
        select: 'farmDetails.farmName farmDetails.farmLocation'
      });

    // Get total count for pagination
    const total = await CarbonCredit.countDocuments(filter);

    // Get unique states and practice types for filters
    const states = await CarbonCredit.distinct('metadata.location.state');
    const practices = await CarbonCredit.distinct('metadata.practiceType');

    res.json({
      credits: credits.map(credit => ({
        id: credit._id,
        farmerName: credit.farmerId.farmDetails?.farmName || 'Anonymous Farmer',
        location: credit.metadata.location || {},
        practiceType: credit.metadata.practiceType,
        creditAmount: credit.creditAmount,
        pricePerCredit: credit.pricePerCredit,
        verificationScore: credit.verificationDetails.verificationScore
      })),
      filters: {
        states,
        practices
      },
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

// @desc    Get credit details by ID
// @route   GET /api/marketplace/credit/:id
// @access  Public
const getCreditDetails = async (req, res) => {
  try {
    const { id } = req.params;
    
    const credit = await CarbonCredit.findById(id)
      .populate({
        path: 'farmerId',
        select: 'farmDetails.farmName farmDetails.farmLocation userId'
      });
      
    if (!credit) {
      return res.status(404).json({ message: 'Carbon credit not found' });
    }

    res.json({
      id: credit._id,
      farmerId: credit.farmerId._id,
      farmerName: credit.farmerId.farmDetails?.farmName || 'Anonymous Farmer',
      location: credit.metadata.location || {},
      practiceType: credit.metadata.practiceType,
      practiceDetails: credit.metadata.additionalInfo || {},
      creditAmount: credit.creditAmount,
      pricePerCredit: credit.pricePerCredit,
      totalPrice: credit.creditAmount * credit.pricePerCredit,
      status: credit.status,
      verificationDetails: {
        method: credit.verificationDetails.verificationMethod,
        score: credit.verificationDetails.verificationScore,
        date: credit.verificationDetails.verificationDate,
        verifier: credit.verificationDetails.verifier
      },
      blockchainDetails: credit.blockchainDetails,
      generationDate: credit.generationDate,
      expiryDate: credit.expiryDate
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getMarketplaceStats,
  getPublicCredits,
  getCreditDetails
};

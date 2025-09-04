const User = require('../models/user.model');
const Farmer = require('../models/farmer.model');
const Company = require('../models/company.model');
const CarbonCredit = require('../models/carbonCredit.model');
const Transaction = require('../models/transaction.model');

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private (Admin only)
const getDashboard = async (req, res) => {
  try {
    // Get user counts
    const totalFarmers = await User.countDocuments({ role: 'farmer' });
    const totalCompanies = await User.countDocuments({ role: 'company' });
    
    // Get practice verification stats
    const pendingPractices = await Farmer.aggregate([
      { $unwind: '$sustainablePractices' },
      { $match: { 'sustainablePractices.verificationStatus': 'pending' } },
      { $count: 'total' }
    ]);
    
    // Get carbon credit stats
    const totalCredits = await CarbonCredit.aggregate([
      { $group: { _id: null, total: { $sum: '$creditAmount' } } }
    ]);
    
    const availableCredits = await CarbonCredit.aggregate([
      { $match: { status: 'available' } },
      { $group: { _id: null, total: { $sum: '$creditAmount' } } }
    ]);
    
    const soldCredits = await CarbonCredit.aggregate([
      { $match: { status: 'sold' } },
      { $group: { _id: null, total: { $sum: '$creditAmount' } } }
    ]);
    
    // Get transaction stats
    const totalTransactions = await Transaction.countDocuments();
    
    const transactionVolume = await Transaction.aggregate([
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    
    // Get recent transactions
    const recentTransactions = await Transaction.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('buyerId', 'companyDetails.companyName')
      .populate('sellerId', 'farmDetails.farmName');
    
    res.json({
      userStats: {
        totalFarmers,
        totalCompanies,
        totalUsers: totalFarmers + totalCompanies
      },
      verificationStats: {
        pendingPractices: pendingPractices[0]?.total || 0
      },
      creditStats: {
        totalCredits: totalCredits[0]?.total || 0,
        availableCredits: availableCredits[0]?.total || 0,
        soldCredits: soldCredits[0]?.total || 0
      },
      transactionStats: {
        totalTransactions,
        transactionVolume: transactionVolume[0]?.total || 0
      },
      recentTransactions: recentTransactions.map(t => ({
        id: t._id,
        date: t.createdAt,
        buyer: t.buyerId?.companyDetails?.companyName || 'Unknown Company',
        seller: t.sellerId?.farmDetails?.farmName || 'Unknown Farmer',
        credits: t.totalCredits,
        amount: t.totalAmount
      }))
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all pending practice verifications
// @route   GET /api/admin/verifications
// @access  Private (Admin only)
const getPendingVerifications = async (req, res) => {
  try {
    // Find all farmers with pending practices
    const farmers = await Farmer.find({
      'sustainablePractices.verificationStatus': 'pending'
    }).populate('userId', 'name email');
    
    // Extract pending practices
    const pendingPractices = [];
    farmers.forEach(farmer => {
      farmer.sustainablePractices.forEach(practice => {
        if (practice.verificationStatus === 'pending') {
          pendingPractices.push({
            practiceId: practice._id,
            farmerId: farmer._id,
            farmerName: farmer.userId?.name || 'Unknown Farmer',
            farmerEmail: farmer.userId?.email || 'Unknown',
            farmName: farmer.farmDetails?.farmName || 'Unknown Farm',
            practiceType: practice.practiceType,
            description: practice.description,
            areaUnderPractice: practice.areaUnderPractice,
            startDate: practice.startDate,
            evidenceUrls: practice.evidenceUrls,
            submissionDate: practice.createdAt
          });
        }
      });
    });
    
    res.json(pendingPractices);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Verify a sustainable practice
// @route   PUT /api/admin/verify-practice/:farmerId/:practiceId
// @access  Private (Admin only)
const verifyPractice = async (req, res) => {
  try {
    const { farmerId, practiceId } = req.params;
    const { 
      verificationStatus, 
      verificationNotes,
      carbonCredits,
      pricePerCredit
    } = req.body;
    
    // Find the farmer
    const farmer = await Farmer.findById(farmerId);
    
    if (!farmer) {
      return res.status(404).json({ message: 'Farmer not found' });
    }
    
    // Find the practice
    const practiceIndex = farmer.sustainablePractices.findIndex(
      p => p._id.toString() === practiceId
    );
    
    if (practiceIndex === -1) {
      return res.status(404).json({ message: 'Practice not found' });
    }
    
    // Update practice verification status
    farmer.sustainablePractices[practiceIndex].verificationStatus = verificationStatus;
    farmer.sustainablePractices[practiceIndex].verificationNotes = verificationNotes;
    farmer.sustainablePractices[practiceIndex].verificationDate = new Date();
    farmer.sustainablePractices[practiceIndex].verifiedBy = req.user._id;
    
    await farmer.save();
    
    // If verified and carbon credits are assigned, create carbon credits
    if (verificationStatus === 'verified' && carbonCredits > 0) {
      const practice = farmer.sustainablePractices[practiceIndex];
      
      // Calculate verification score (1-10 scale)
      const verificationScore = Math.min(10, Math.max(1, Math.round(Math.random() * 3) + 7)); // 7-10 range
      
      // Create carbon credit
      const newCredit = await CarbonCredit.create({
        farmerId: farmer._id,
        creditAmount: carbonCredits,
        pricePerCredit: pricePerCredit || 10, // Default price
        status: 'available',
        generationDate: new Date(),
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year expiry
        metadata: {
          practiceType: practice.practiceType,
          practiceId: practice._id,
          location: farmer.farmDetails?.farmLocation || {},
          additionalInfo: {
            description: practice.description,
            areaUnderPractice: practice.areaUnderPractice
          }
        },
        verificationDetails: {
          verificationMethod: 'Expert Verification',
          verificationScore,
          verificationDate: new Date(),
          verifier: req.user.name
        },
        blockchainDetails: {
          registered: false
        }
      });
      
      // Update farmer's carbon credit count
      farmer.totalCarbonCredits = (farmer.totalCarbonCredits || 0) + carbonCredits;
      farmer.availableCarbonCredits = (farmer.availableCarbonCredits || 0) + carbonCredits;
      await farmer.save();
      
      return res.json({
        message: 'Practice verified and carbon credits issued',
        verificationStatus,
        carbonCredit: {
          id: newCredit._id,
          amount: newCredit.creditAmount,
          pricePerCredit: newCredit.pricePerCredit
        }
      });
    }
    
    res.json({
      message: 'Practice verification status updated',
      verificationStatus
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all users (for admin management)
// @route   GET /api/admin/users
// @access  Private (Admin only)
const getAllUsers = async (req, res) => {
  try {
    const { role, page = 1, limit = 10, search } = req.query;
    
    // Build filter
    let filter = {};
    
    if (role && ['farmer', 'company', 'admin'].includes(role)) {
      filter.role = role;
    }
    
    if (search) {
      filter = {
        ...filter,
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      };
    }
    
    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);
    
    // Get users
    const users = await User.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .select('-password');
      
    // Get total count for pagination
    const total = await User.countDocuments(filter);
    
    // Get additional profile info for each user
    const usersWithProfiles = await Promise.all(users.map(async (user) => {
      let profile = null;
      
      if (user.role === 'farmer') {
        profile = await Farmer.findOne({ userId: user._id });
      } else if (user.role === 'company') {
        profile = await Company.findOne({ userId: user._id });
      }
      
      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        createdAt: user.createdAt,
        profile: profile ? {
          id: profile._id,
          ...(user.role === 'farmer' ? {
            farmName: profile.farmDetails?.farmName,
            location: profile.farmDetails?.farmLocation,
            totalCredits: profile.totalCarbonCredits
          } : {
            companyName: profile.companyDetails?.companyName,
            industry: profile.companyDetails?.industry,
            totalPurchased: profile.carbonCredits?.purchased
          })
        } : null
      };
    }));
    
    res.json({
      users: usersWithProfiles,
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

// @desc    Get all carbon credits (for admin management)
// @route   GET /api/admin/credits
// @access  Private (Admin only)
const getAllCredits = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    // Build filter
    let filter = {};
    
    if (status && ['available', 'sold', 'expired'].includes(status)) {
      filter.status = status;
    }
    
    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);
    
    // Get credits
    const credits = await CarbonCredit.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate('farmerId', 'farmDetails.farmName');
      
    // Get total count for pagination
    const total = await CarbonCredit.countDocuments(filter);
    
    res.json({
      credits: credits.map(credit => ({
        id: credit._id,
        farmerId: credit.farmerId._id,
        farmerName: credit.farmerId?.farmDetails?.farmName || 'Unknown Farmer',
        practiceType: credit.metadata?.practiceType,
        creditAmount: credit.creditAmount,
        pricePerCredit: credit.pricePerCredit,
        status: credit.status,
        generationDate: credit.generationDate,
        expiryDate: credit.expiryDate,
        blockchainRegistered: credit.blockchainDetails?.registered || false
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

module.exports = {
  getDashboard,
  getPendingVerifications,
  verifyPractice,
  getAllUsers,
  getAllCredits
};

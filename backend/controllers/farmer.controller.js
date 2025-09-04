const Farmer = require('../models/farmer.model');
const CarbonCredit = require('../models/carbonCredit.model');
const mongoose = require('mongoose');

// @desc    Submit new sustainable practice data
// @route   POST /api/farmer/practice
// @access  Private (Farmer only)
const submitPractice = async (req, res) => {
  try {
    const {
      practiceType,
      description,
      areaUnderPractice,
      startDate,
      evidenceUrls
    } = req.body;

    const farmer = await Farmer.findOne({ userId: req.user._id });
    
    if (!farmer) {
      return res.status(404).json({ message: 'Farmer profile not found' });
    }

    // Create new practice
    const newPractice = {
      practiceType,
      description,
      areaUnderPractice,
      startDate: startDate || new Date(),
      evidenceUrls: evidenceUrls || [],
      verificationStatus: 'pending'
    };

    // Add to farmer's practices
    farmer.sustainablePractices.push(newPractice);
    await farmer.save();

    res.status(201).json({
      message: 'Sustainable practice submitted successfully',
      practice: farmer.sustainablePractices[farmer.sustainablePractices.length - 1]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all practices for a farmer
// @route   GET /api/farmer/practices
// @access  Private (Farmer only)
const getPractices = async (req, res) => {
  try {
    const farmer = await Farmer.findOne({ userId: req.user._id });
    
    if (!farmer) {
      return res.status(404).json({ message: 'Farmer profile not found' });
    }

    res.json(farmer.sustainablePractices);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Upload evidence for a practice
// @route   PUT /api/farmer/practice/:practiceId/evidence
// @access  Private (Farmer only)
const uploadEvidence = async (req, res) => {
  try {
    const { practiceId } = req.params;

    const farmer = await Farmer.findOne({ userId: req.user._id });
    
    if (!farmer) {
      return res.status(404).json({ message: 'Farmer profile not found' });
    }

    // Find the practice
    const practiceIndex = farmer.sustainablePractices.findIndex(
      practice => practice._id.toString() === practiceId
    );

    if (practiceIndex === -1) {
      return res.status(404).json({ message: 'Practice not found' });
    }

    // Process uploaded files
    const evidenceUrls = [];
    if (req.files && req.files.length > 0) {
      // Get the server URL from request
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      
      // Add file paths to evidence URLs
      req.files.forEach(file => {
        // Convert backslashes to forward slashes for URLs if on Windows
        const relativePath = file.path.replace(/\\/g, '/').split('uploads/')[1];
        evidenceUrls.push(`${baseUrl}/uploads/${relativePath}`);
      });
    }

    // Add additional evidence URLs from request body if any
    if (req.body.evidenceUrls && Array.isArray(req.body.evidenceUrls)) {
      evidenceUrls.push(...req.body.evidenceUrls);
    }

    // Add evidence URLs
    farmer.sustainablePractices[practiceIndex].evidenceUrls = [
      ...farmer.sustainablePractices[practiceIndex].evidenceUrls,
      ...evidenceUrls
    ];

    // Reset verification status to pending if already verified
    if (farmer.sustainablePractices[practiceIndex].verificationStatus === 'verified') {
      farmer.sustainablePractices[practiceIndex].verificationStatus = 'pending';
    }

    await farmer.save();

    res.json({
      message: 'Evidence uploaded successfully',
      practice: farmer.sustainablePractices[practiceIndex],
      uploadedFiles: req.files ? req.files.length : 0,
      evidenceUrls
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get carbon credits for a farmer
// @route   GET /api/farmer/credits
// @access  Private (Farmer only)
const getCarbonCredits = async (req, res) => {
  try {
    const farmer = await Farmer.findOne({ userId: req.user._id });
    
    if (!farmer) {
      return res.status(404).json({ message: 'Farmer profile not found' });
    }

    const credits = await CarbonCredit.find({ farmerId: farmer._id });

    res.json({
      totalCredits: farmer.totalCarbonCredits,
      availableCredits: farmer.availableCarbonCredits,
      soldCredits: farmer.soldCarbonCredits,
      totalEarnings: farmer.totalEarnings,
      credits
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get farmer dashboard summary
// @route   GET /api/farmer/dashboard
// @access  Private (Farmer only)
const getDashboard = async (req, res) => {
  try {
    const farmer = await Farmer.findOne({ userId: req.user._id });
    
    if (!farmer) {
      return res.status(404).json({ message: 'Farmer profile not found' });
    }

    // Get practice statistics
    const practiceStats = farmer.sustainablePractices.reduce(
      (stats, practice) => {
        stats.totalArea += practice.areaUnderPractice || 0;
        stats.practiceTypes[practice.practiceType] = 
          (stats.practiceTypes[practice.practiceType] || 0) + 1;
        
        if (practice.verificationStatus === 'verified') {
          stats.verifiedPractices++;
        } else if (practice.verificationStatus === 'pending') {
          stats.pendingPractices++;
        }
        
        return stats;
      },
      { 
        totalArea: 0, 
        practiceTypes: {}, 
        verifiedPractices: 0, 
        pendingPractices: 0 
      }
    );

    // Get recent transactions
    const transactions = await mongoose.model('Transaction')
      .find({ sellerId: farmer._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('buyerId', 'companyDetails.companyName');

    res.json({
      farmerInfo: {
        name: req.user.name,
        farmName: farmer.farmDetails?.farmName || 'Your Farm',
        location: farmer.farmDetails?.farmLocation || {}
      },
      creditStats: {
        totalCredits: farmer.totalCarbonCredits || 0,
        availableCredits: farmer.availableCarbonCredits || 0,
        soldCredits: farmer.soldCarbonCredits || 0,
        totalEarnings: farmer.totalEarnings || 0
      },
      practiceStats,
      recentTransactions: transactions.map(t => ({
        id: t._id,
        date: t.createdAt,
        buyer: t.buyerId?.companyDetails?.companyName || 'Unknown Company',
        credits: t.totalCredits,
        amount: t.totalAmount,
        status: t.status
      }))
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  submitPractice,
  getPractices,
  uploadEvidence,
  getCarbonCredits,
  getDashboard
};

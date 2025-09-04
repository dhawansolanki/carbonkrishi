const Company = require('../models/company.model');
const CarbonCredit = require('../models/carbonCredit.model');
const Transaction = require('../models/transaction.model');
const Farmer = require('../models/farmer.model');
const mongoose = require('mongoose');

// @desc    Get company dashboard data
// @route   GET /api/company/dashboard
// @access  Private (Company only)
const getDashboard = async (req, res) => {
  try {
    const company = await Company.findOne({ userId: req.user._id });
    
    if (!company) {
      return res.status(404).json({ message: 'Company profile not found' });
    }

    // Get recent transactions
    const transactions = await Transaction.find({ buyerId: company._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('sellerId', 'farmDetails.farmName');

    // Calculate carbon offset stats
    const offsetStats = {
      totalPurchased: company.carbonCredits.purchased || 0,
      totalRetired: company.carbonCredits.retired || 0,
      available: (company.carbonCredits.purchased || 0) - (company.carbonCredits.retired || 0),
      offsetPercentage: company.carbonFootprint?.annualEmissions 
        ? Math.round(((company.carbonCredits.retired || 0) / company.carbonFootprint.annualEmissions) * 100)
        : 0
    };

    res.json({
      companyInfo: {
        name: req.user.name,
        companyName: company.companyDetails?.companyName || req.user.name,
        industry: company.companyDetails?.industry || 'Not specified'
      },
      carbonFootprint: company.carbonFootprint || {
        annualEmissions: 0,
        emissionGoals: 0,
        reportingYear: new Date().getFullYear()
      },
      offsetStats,
      recentTransactions: transactions.map(t => ({
        id: t._id,
        date: t.createdAt,
        seller: t.sellerId?.farmDetails?.farmName || 'Unknown Farmer',
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

// @desc    Update company carbon footprint data
// @route   PUT /api/company/carbon-footprint
// @access  Private (Company only)
const updateCarbonFootprint = async (req, res) => {
  try {
    const { annualEmissions, emissionGoals, reportingYear } = req.body;
    
    const company = await Company.findOne({ userId: req.user._id });
    
    if (!company) {
      return res.status(404).json({ message: 'Company profile not found' });
    }

    company.carbonFootprint = {
      ...company.carbonFootprint,
      annualEmissions: annualEmissions || company.carbonFootprint?.annualEmissions,
      emissionGoals: emissionGoals || company.carbonFootprint?.emissionGoals,
      reportingYear: reportingYear || company.carbonFootprint?.reportingYear || new Date().getFullYear()
    };

    await company.save();

    res.json({
      message: 'Carbon footprint data updated successfully',
      carbonFootprint: company.carbonFootprint
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get available carbon credits in marketplace
// @route   GET /api/company/marketplace
// @access  Private (Company only)
const getMarketplaceCredits = async (req, res) => {
  try {
    // Get query parameters for filtering
    const { 
      state, 
      practiceType, 
      minPrice, 
      maxPrice,
      minVerificationScore,
      sortBy = 'pricePerCredit',
      sortOrder = 'asc',
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
    
    if (minPrice) {
      filter.pricePerCredit = { $gte: Number(minPrice) };
    }
    
    if (maxPrice) {
      filter.pricePerCredit = { ...filter.pricePerCredit, $lte: Number(maxPrice) };
    }
    
    if (minVerificationScore) {
      filter['verificationDetails.verificationScore'] = { $gte: Number(minVerificationScore) };
    }

    // Build sort
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Get credits with pagination
    const credits = await CarbonCredit.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .populate({
        path: 'farmerId',
        select: 'farmDetails.farmName farmDetails.farmLocation'
      });

    // Get total count for pagination
    const total = await CarbonCredit.countDocuments(filter);

    res.json({
      credits: credits.map(credit => ({
        id: credit._id,
        farmerId: credit.farmerId._id,
        farmerName: credit.farmerId.farmDetails?.farmName || 'Unknown Farmer',
        location: credit.metadata.location || {},
        practiceType: credit.metadata.practiceType,
        creditAmount: credit.creditAmount,
        pricePerCredit: credit.pricePerCredit,
        totalPrice: credit.creditAmount * credit.pricePerCredit,
        verificationScore: credit.verificationDetails.verificationScore,
        verificationMethod: credit.verificationDetails.verificationMethod,
        generationDate: credit.generationDate
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

// @desc    Purchase carbon credits
// @route   POST /api/company/purchase
// @access  Private (Company only)
const purchaseCredits = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { creditIds, paymentMethod } = req.body;
    
    if (!creditIds || !creditIds.length) {
      return res.status(400).json({ message: 'No credits specified for purchase' });
    }

    const company = await Company.findOne({ userId: req.user._id }).session(session);
    
    if (!company) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Company profile not found' });
    }

    // Get all credits to purchase
    const credits = await CarbonCredit.find({ 
      _id: { $in: creditIds },
      status: 'available'
    }).session(session);

    if (credits.length !== creditIds.length) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'Some credits are not available for purchase' });
    }

    // Group credits by farmer
    const creditsByFarmer = {};
    let totalCredits = 0;
    let totalAmount = 0;

    credits.forEach(credit => {
      const farmerId = credit.farmerId.toString();
      
      if (!creditsByFarmer[farmerId]) {
        creditsByFarmer[farmerId] = {
          farmerId,
          credits: []
        };
      }
      
      creditsByFarmer[farmerId].credits.push({
        creditId: credit._id,
        quantity: credit.creditAmount,
        pricePerCredit: credit.pricePerCredit
      });
      
      totalCredits += credit.creditAmount;
      totalAmount += credit.creditAmount * credit.pricePerCredit;
      
      // Update credit status
      credit.status = 'sold';
      credit.save({ session });
    });

    // Create transactions for each farmer
    const transactions = [];
    for (const farmerId in creditsByFarmer) {
      const farmerCredits = creditsByFarmer[farmerId];
      
      // Calculate farmer transaction totals
      const farmerTotalCredits = farmerCredits.credits.reduce(
        (sum, item) => sum + item.quantity, 0
      );
      
      const farmerTotalAmount = farmerCredits.credits.reduce(
        (sum, item) => sum + (item.quantity * item.pricePerCredit), 0
      );
      
      // Create transaction
      const transaction = await Transaction.create([{
        buyerId: company._id,
        sellerId: farmerId,
        carbonCredits: farmerCredits.credits,
        totalCredits: farmerTotalCredits,
        totalAmount: farmerTotalAmount,
        status: 'completed',
        paymentDetails: {
          method: paymentMethod,
          paymentDate: new Date()
        },
        blockchainDetails: {
          registered: true,
          transactionHash: `0x${Math.random().toString(16).substring(2, 34)}`,
          blockNumber: Math.floor(Math.random() * 1000000),
          timestamp: new Date()
        }
      }], { session });
      
      transactions.push(transaction[0]);
      
      // Update farmer stats
      const farmer = await Farmer.findById(farmerId).session(session);
      if (farmer) {
        farmer.totalCarbonCredits = (farmer.totalCarbonCredits || 0) + farmerTotalCredits;
        farmer.soldCarbonCredits = (farmer.soldCarbonCredits || 0) + farmerTotalCredits;
        farmer.totalEarnings = (farmer.totalEarnings || 0) + farmerTotalAmount;
        farmer.availableCarbonCredits = (farmer.availableCarbonCredits || 0) - farmerTotalCredits;
        await farmer.save({ session });
      }
    }

    // Update company stats
    company.carbonCredits.purchased = (company.carbonCredits.purchased || 0) + totalCredits;
    company.transactions.push(...transactions.map(t => t._id));
    await company.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      message: 'Carbon credits purchased successfully',
      transactionIds: transactions.map(t => t._id),
      totalCredits,
      totalAmount
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get purchased credits history
// @route   GET /api/company/purchases
// @access  Private (Company only)
const getPurchaseHistory = async (req, res) => {
  try {
    const company = await Company.findOne({ userId: req.user._id });
    
    if (!company) {
      return res.status(404).json({ message: 'Company profile not found' });
    }

    const transactions = await Transaction.find({ buyerId: company._id })
      .sort({ createdAt: -1 })
      .populate({
        path: 'sellerId',
        select: 'farmDetails.farmName farmDetails.farmLocation'
      })
      .populate({
        path: 'carbonCredits.creditId',
        select: 'metadata.practiceType verificationDetails'
      });

    res.json(transactions.map(t => ({
      id: t._id,
      date: t.createdAt,
      seller: t.sellerId?.farmDetails?.farmName || 'Unknown Farmer',
      location: t.sellerId?.farmDetails?.farmLocation || {},
      credits: t.totalCredits,
      amount: t.totalAmount,
      status: t.status,
      paymentMethod: t.paymentDetails?.method,
      blockchainHash: t.blockchainDetails?.transactionHash,
      practiceTypes: [...new Set(t.carbonCredits.map(
        c => c.creditId?.metadata?.practiceType || 'Unknown'
      ))]
    })));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getDashboard,
  updateCarbonFootprint,
  getMarketplaceCredits,
  purchaseCredits,
  getPurchaseHistory
};

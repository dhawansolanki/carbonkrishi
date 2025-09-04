const CarbonCredit = require('../models/carbonCredit.model');
const Transaction = require('../models/transaction.model');
const Farmer = require('../models/farmer.model');
const Company = require('../models/company.model');

// @desc    Get platform-wide analytics data
// @route   GET /api/analytics/platform
// @access  Public
const getPlatformAnalytics = async (req, res) => {
  try {
    // Get total carbon credits generated and sold
    const totalCreditsGenerated = await CarbonCredit.aggregate([
      { $group: { _id: null, total: { $sum: '$creditAmount' } } }
    ]);

    const totalCreditsSold = await CarbonCredit.aggregate([
      { $match: { status: 'sold' } },
      { $group: { _id: null, total: { $sum: '$creditAmount' } } }
    ]);

    // Get monthly credit generation trend (last 12 months)
    const monthlyGeneration = await CarbonCredit.aggregate([
      {
        $match: {
          generationDate: { $gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1)) }
        }
      },
      {
        $group: {
          _id: { 
            year: { $year: '$generationDate' }, 
            month: { $month: '$generationDate' } 
          },
          credits: { $sum: '$creditAmount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Get monthly transaction volume trend (last 12 months)
    const monthlyTransactions = await Transaction.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1)) }
        }
      },
      {
        $group: {
          _id: { 
            year: { $year: '$createdAt' }, 
            month: { $month: '$createdAt' } 
          },
          volume: { $sum: '$totalAmount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Get practice type distribution
    const practiceDistribution = await CarbonCredit.aggregate([
      {
        $group: {
          _id: '$metadata.practiceType',
          credits: { $sum: '$creditAmount' }
        }
      },
      { $sort: { credits: -1 } }
    ]);

    // Get geographic distribution (by state)
    const geographicDistribution = await CarbonCredit.aggregate([
      {
        $group: {
          _id: '$metadata.location.state',
          credits: { $sum: '$creditAmount' }
        }
      },
      { $sort: { credits: -1 } }
    ]);

    // Format monthly data for charts
    const formatMonthlyData = (data) => {
      const months = [];
      const now = new Date();
      
      // Generate all months in the last year
      for (let i = 0; i < 12; i++) {
        const d = new Date(now);
        d.setMonth(now.getMonth() - i);
        months.unshift({
          year: d.getFullYear(),
          month: d.getMonth() + 1,
          label: d.toLocaleString('default', { month: 'short' }) + ' ' + d.getFullYear()
        });
      }
      
      // Map data to months
      return months.map(m => {
        const entry = data.find(d => 
          d._id.year === m.year && d._id.month === m.month
        );
        
        return {
          date: m.label,
          value: entry ? (entry.credits || entry.volume || 0) : 0,
          count: entry ? (entry.count || 0) : 0
        };
      });
    };

    res.json({
      summary: {
        totalCreditsGenerated: totalCreditsGenerated[0]?.total || 0,
        totalCreditsSold: totalCreditsSold[0]?.total || 0,
        carbonOffsetPercentage: totalCreditsGenerated[0]?.total ? 
          Math.round((totalCreditsSold[0]?.total || 0) / totalCreditsGenerated[0].total * 100) : 0
      },
      trends: {
        monthlyGeneration: formatMonthlyData(monthlyGeneration),
        monthlyTransactions: formatMonthlyData(monthlyTransactions)
      },
      distribution: {
        practiceTypes: practiceDistribution.map(p => ({
          name: p._id || 'Unknown',
          value: p.credits
        })),
        geography: geographicDistribution.map(g => ({
          state: g._id || 'Unknown',
          value: g.credits
        }))
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get farmer-specific analytics
// @route   GET /api/analytics/farmer/:farmerId
// @access  Private (Farmer or Admin)
const getFarmerAnalytics = async (req, res) => {
  try {
    const { farmerId } = req.params;
    
    // Check if user has access to this farmer's data
    if (req.user.role !== 'admin' && (!req.user.farmer || req.user.farmer._id.toString() !== farmerId)) {
      return res.status(403).json({ message: 'Not authorized to access this data' });
    }
    
    const farmer = await Farmer.findById(farmerId);
    
    if (!farmer) {
      return res.status(404).json({ message: 'Farmer not found' });
    }
    
    // Get farmer's carbon credits
    const credits = await CarbonCredit.find({ farmerId });
    
    // Get farmer's transactions
    const transactions = await Transaction.find({ sellerId: farmerId })
      .populate('buyerId', 'companyDetails.companyName');
    
    // Calculate monthly earnings
    const monthlyEarnings = await Transaction.aggregate([
      {
        $match: {
          sellerId: farmer._id,
          createdAt: { $gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1)) }
        }
      },
      {
        $group: {
          _id: { 
            year: { $year: '$createdAt' }, 
            month: { $month: '$createdAt' } 
          },
          earnings: { $sum: '$totalAmount' },
          credits: { $sum: '$totalCredits' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);
    
    // Format monthly data
    const formatMonthlyData = (data) => {
      const months = [];
      const now = new Date();
      
      for (let i = 0; i < 12; i++) {
        const d = new Date(now);
        d.setMonth(now.getMonth() - i);
        months.unshift({
          year: d.getFullYear(),
          month: d.getMonth() + 1,
          label: d.toLocaleString('default', { month: 'short' }) + ' ' + d.getFullYear()
        });
      }
      
      return months.map(m => {
        const entry = data.find(d => 
          d._id.year === m.year && d._id.month === m.month
        );
        
        return {
          date: m.label,
          earnings: entry ? entry.earnings : 0,
          credits: entry ? entry.credits : 0
        };
      });
    };
    
    // Calculate practice type distribution
    const practiceDistribution = farmer.sustainablePractices.reduce((acc, practice) => {
      const type = practice.practiceType;
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});
    
    // Calculate buyer distribution
    const buyerDistribution = transactions.reduce((acc, transaction) => {
      const buyerName = transaction.buyerId?.companyDetails?.companyName || 'Unknown';
      acc[buyerName] = (acc[buyerName] || 0) + transaction.totalAmount;
      return acc;
    }, {});
    
    res.json({
      summary: {
        totalCreditsGenerated: farmer.totalCarbonCredits || 0,
        availableCredits: farmer.availableCarbonCredits || 0,
        soldCredits: farmer.soldCarbonCredits || 0,
        totalEarnings: farmer.totalEarnings || 0
      },
      trends: {
        monthlyEarnings: formatMonthlyData(monthlyEarnings)
      },
      distribution: {
        practices: Object.entries(practiceDistribution).map(([name, value]) => ({ name, value })),
        buyers: Object.entries(buyerDistribution).map(([name, value]) => ({ name, value }))
      },
      recentTransactions: transactions.slice(0, 5).map(t => ({
        id: t._id,
        date: t.createdAt,
        buyer: t.buyerId?.companyDetails?.companyName || 'Unknown Company',
        credits: t.totalCredits,
        amount: t.totalAmount
      }))
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get company-specific analytics
// @route   GET /api/analytics/company/:companyId
// @access  Private (Company or Admin)
const getCompanyAnalytics = async (req, res) => {
  try {
    const { companyId } = req.params;
    
    // Check if user has access to this company's data
    if (req.user.role !== 'admin' && (!req.user.company || req.user.company._id.toString() !== companyId)) {
      return res.status(403).json({ message: 'Not authorized to access this data' });
    }
    
    const company = await Company.findById(companyId);
    
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    
    // Get company's transactions
    const transactions = await Transaction.find({ buyerId: companyId })
      .populate('sellerId', 'farmDetails.farmName');
    
    // Calculate monthly purchases
    const monthlyPurchases = await Transaction.aggregate([
      {
        $match: {
          buyerId: company._id,
          createdAt: { $gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1)) }
        }
      },
      {
        $group: {
          _id: { 
            year: { $year: '$createdAt' }, 
            month: { $month: '$createdAt' } 
          },
          spending: { $sum: '$totalAmount' },
          credits: { $sum: '$totalCredits' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);
    
    // Format monthly data
    const formatMonthlyData = (data) => {
      const months = [];
      const now = new Date();
      
      for (let i = 0; i < 12; i++) {
        const d = new Date(now);
        d.setMonth(now.getMonth() - i);
        months.unshift({
          year: d.getFullYear(),
          month: d.getMonth() + 1,
          label: d.toLocaleString('default', { month: 'short' }) + ' ' + d.getFullYear()
        });
      }
      
      return months.map(m => {
        const entry = data.find(d => 
          d._id.year === m.year && d._id.month === m.month
        );
        
        return {
          date: m.label,
          spending: entry ? entry.spending : 0,
          credits: entry ? entry.credits : 0
        };
      });
    };
    
    // Calculate seller distribution
    const sellerDistribution = transactions.reduce((acc, transaction) => {
      const sellerName = transaction.sellerId?.farmDetails?.farmName || 'Unknown';
      acc[sellerName] = (acc[sellerName] || 0) + transaction.totalCredits;
      return acc;
    }, {});
    
    // Calculate practice type distribution from purchased credits
    const practiceDistribution = {};
    for (const transaction of transactions) {
      for (const creditItem of transaction.carbonCredits) {
        const credit = await CarbonCredit.findById(creditItem.creditId);
        if (credit) {
          const practiceType = credit.metadata?.practiceType || 'Unknown';
          practiceDistribution[practiceType] = (practiceDistribution[practiceType] || 0) + creditItem.quantity;
        }
      }
    }
    
    res.json({
      summary: {
        totalPurchased: company.carbonCredits?.purchased || 0,
        totalRetired: company.carbonCredits?.retired || 0,
        available: (company.carbonCredits?.purchased || 0) - (company.carbonCredits?.retired || 0),
        totalSpending: transactions.reduce((sum, t) => sum + t.totalAmount, 0)
      },
      offsetStats: {
        annualEmissions: company.carbonFootprint?.annualEmissions || 0,
        offsetPercentage: company.carbonFootprint?.annualEmissions 
          ? Math.round(((company.carbonCredits?.retired || 0) / company.carbonFootprint.annualEmissions) * 100)
          : 0,
        emissionGoals: company.carbonFootprint?.emissionGoals || 0
      },
      trends: {
        monthlyPurchases: formatMonthlyData(monthlyPurchases)
      },
      distribution: {
        sellers: Object.entries(sellerDistribution).map(([name, value]) => ({ name, value })),
        practices: Object.entries(practiceDistribution).map(([name, value]) => ({ name, value }))
      },
      recentTransactions: transactions.slice(0, 5).map(t => ({
        id: t._id,
        date: t.createdAt,
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

module.exports = {
  getPlatformAnalytics,
  getFarmerAnalytics,
  getCompanyAnalytics
};

const express = require('express');
const router = express.Router();
const { 
  getDashboard,
  updateCarbonFootprint,
  getMarketplaceCredits,
  purchaseCredits,
  getPurchaseHistory
} = require('../controllers/company.controller');
const { protect, company } = require('../middleware/auth.middleware');

// All routes are protected and require company role
router.use(protect, company);

// Dashboard and company data
router.get('/dashboard', getDashboard);
router.put('/carbon-footprint', updateCarbonFootprint);

// Marketplace and purchases
router.get('/marketplace', getMarketplaceCredits);
router.post('/purchase', purchaseCredits);
router.get('/purchases', getPurchaseHistory);

module.exports = router;

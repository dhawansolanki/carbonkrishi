const express = require('express');
const router = express.Router();
const { 
  getMarketplaceStats,
  getPublicCredits,
  getCreditDetails,
  purchaseCredits
} = require('../controllers/marketplace.controller');
const { protect, company } = require('../middleware/auth.middleware');

// Public routes
router.get('/stats', getMarketplaceStats);
router.get('/credits', getPublicCredits);
router.get('/credit/:id', getCreditDetails);

// Protected routes (company only)
router.post('/purchase', protect, company, purchaseCredits);

module.exports = router;

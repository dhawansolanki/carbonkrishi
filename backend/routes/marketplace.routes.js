const express = require('express');
const router = express.Router();
const { 
  getMarketplaceStats,
  getPublicCredits,
  getCreditDetails
} = require('../controllers/marketplace.controller');

// Public routes
router.get('/stats', getMarketplaceStats);
router.get('/credits', getPublicCredits);
router.get('/credit/:id', getCreditDetails);

module.exports = router;

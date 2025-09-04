const express = require('express');
const router = express.Router();
const { 
  getPlatformAnalytics,
  getFarmerAnalytics,
  getCompanyAnalytics
} = require('../controllers/analytics.controller');
const { protect, admin } = require('../middleware/auth.middleware');

// Public routes
router.get('/platform', getPlatformAnalytics);

// Protected routes
router.get('/farmer/:farmerId', protect, getFarmerAnalytics);
router.get('/company/:companyId', protect, getCompanyAnalytics);

module.exports = router;

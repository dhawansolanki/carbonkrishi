const express = require('express');
const router = express.Router();
const { 
  submitPractice, 
  getPractices, 
  uploadEvidence, 
  getCarbonCredits, 
  getDashboard 
} = require('../controllers/farmer.controller');
const { protect, farmer } = require('../middleware/auth.middleware');
const { upload, handleUploadError } = require('../middleware/upload.middleware');

// All routes are protected and require farmer role
router.use(protect, farmer);

// Dashboard and summary
router.get('/dashboard', getDashboard);

// Sustainable practices
router.post('/practice', submitPractice);
router.get('/practices', getPractices);
router.put('/practice/:practiceId/evidence', upload.array('evidence', 5), handleUploadError, uploadEvidence);

// Carbon credits
router.get('/credits', getCarbonCredits);

module.exports = router;

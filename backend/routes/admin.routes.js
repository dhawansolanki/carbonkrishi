const express = require('express');
const router = express.Router();
const { 
  getDashboard,
  getPendingVerifications,
  verifyPractice,
  verifyPracticeSimple,
  getAllUsers,
  getAllCredits
} = require('../controllers/admin.controller');
const { protect, admin } = require('../middleware/auth.middleware');

// All routes are protected and require admin role
router.use(protect, admin);

// Dashboard
router.get('/dashboard', getDashboard);

// Verification management
router.get('/verifications', getPendingVerifications);
router.post('/verify', verifyPracticeSimple);
router.put('/verify-practice/:farmerId/:practiceId', verifyPractice);

// User management
router.get('/users', getAllUsers);

// Credit management
router.get('/credits', getAllCredits);

module.exports = router;

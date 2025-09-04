const express = require('express');
const router = express.Router();
const { 
  getBlockchainRegistry,
  getTransactionDetails,
  registerOnBlockchain,
  verifyTransaction
} = require('../controllers/blockchain.controller');
const { protect, admin } = require('../middleware/auth.middleware');

// Public routes
router.get('/registry', getBlockchainRegistry);
router.get('/transaction/:hash', getTransactionDetails);
router.get('/verify/:hash', verifyTransaction);

// Protected routes (admin only)
router.post('/register', protect, admin, registerOnBlockchain);

module.exports = router;

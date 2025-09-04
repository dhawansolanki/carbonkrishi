const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farmer',
    required: true
  },
  carbonCredits: [{
    creditId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CarbonCredit',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    pricePerCredit: {
      type: Number,
      required: true,
      min: 0
    }
  }],
  totalCredits: {
    type: Number,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  },
  paymentDetails: {
    method: {
      type: String,
      enum: ['bank_transfer', 'upi', 'wallet', 'other'],
      required: true
    },
    referenceId: String,
    paymentDate: Date
  },
  blockchainDetails: {
    registered: {
      type: Boolean,
      default: false
    },
    transactionHash: String,
    blockNumber: Number,
    timestamp: Date
  },
  certificateUrl: String
}, { timestamps: true });

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;

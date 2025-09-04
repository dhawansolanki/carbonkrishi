const mongoose = require('mongoose');

const carbonCreditSchema = new mongoose.Schema({
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farmer',
    required: true
  },
  practiceId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  creditAmount: {
    type: Number,
    required: true,
    min: 0
  },
  pricePerCredit: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['available', 'reserved', 'sold', 'retired'],
    default: 'available'
  },
  verificationDetails: {
    verificationMethod: {
      type: String,
      enum: ['satellite', 'field_visit', 'iot_sensors', 'documentation', 'combined'],
      required: true
    },
    verificationDate: Date,
    verificationScore: {
      type: Number,
      min: 0,
      max: 100
    },
    verifier: String,
    evidenceUrls: [String]
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
  generationDate: {
    type: Date,
    default: Date.now
  },
  expiryDate: {
    type: Date
  },
  metadata: {
    practiceType: String,
    location: {
      state: String,
      district: String
    },
    farmSize: Number,
    carbonSequestrationRate: Number, // tons of CO2 per acre
    additionalInfo: Object
  }
}, { timestamps: true });

const CarbonCredit = mongoose.model('CarbonCredit', carbonCreditSchema);

module.exports = CarbonCredit;

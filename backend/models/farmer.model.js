const mongoose = require('mongoose');

const farmerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  farmDetails: {
    farmName: String,
    farmSize: Number, // in acres
    farmLocation: {
      state: String,
      district: String,
      village: String,
      pincode: String,
      coordinates: {
        latitude: Number,
        longitude: Number
      }
    },
    soilType: String,
    mainCrops: [String]
  },
  sustainablePractices: [{
    practiceType: {
      type: String,
      enum: ['organic_farming', 'agroforestry', 'water_conservation', 'no_till_farming', 'crop_rotation', 'cover_crops', 'other']
    },
    description: String,
    areaUnderPractice: Number, // in acres
    startDate: Date,
    evidenceUrls: [String], // URLs to uploaded evidence files
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending'
    },
    verificationScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    verifiedBy: String,
    verificationDate: Date,
    carbonCreditsGenerated: Number
  }],
  bankDetails: {
    accountName: String,
    accountNumber: String,
    bankName: String,
    ifscCode: String,
    upiId: String
  },
  totalCarbonCredits: {
    type: Number,
    default: 0
  },
  availableCarbonCredits: {
    type: Number,
    default: 0
  },
  soldCarbonCredits: {
    type: Number,
    default: 0
  },
  totalEarnings: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

const Farmer = mongoose.model('Farmer', farmerSchema);

module.exports = Farmer;

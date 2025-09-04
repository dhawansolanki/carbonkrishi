const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  companyDetails: {
    companyName: String,
    registrationNumber: String,
    industry: String,
    companySize: String,
    website: String,
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String,
      country: String
    },
    contactPerson: {
      name: String,
      designation: String,
      email: String,
      phone: String
    }
  },
  carbonFootprint: {
    annualEmissions: Number, // in tons of CO2
    emissionGoals: Number, // reduction target in percentage
    reportingYear: Number
  },
  carbonCredits: {
    purchased: {
      type: Number,
      default: 0
    },
    retired: {
      type: Number,
      default: 0
    }
  },
  transactions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction'
  }],
  esgReports: [{
    year: Number,
    reportUrl: String,
    submissionDate: Date
  }],
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  }
}, { timestamps: true });

const Company = mongoose.model('Company', companySchema);

module.exports = Company;

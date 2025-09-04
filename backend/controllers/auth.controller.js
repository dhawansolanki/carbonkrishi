const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const Farmer = require('../models/farmer.model');
const Company = require('../models/company.model');

const JWT_SECRET = process.env.JWT_SECRET || 'carbonkrishi-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '30d';

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// @desc    Register a new user (farmer or company)
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { name, email, password, phone, role, ...additionalData } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: role || 'farmer'
    });

    // Create profile based on role
    if (user.role === 'farmer') {
      const { farmDetails, bankDetails } = additionalData;
      await Farmer.create({
        userId: user._id,
        farmDetails: farmDetails || {},
        bankDetails: bankDetails || {}
      });
    } else if (user.role === 'company') {
      const { companyDetails } = additionalData;
      await Company.create({
        userId: user._id,
        companyDetails: companyDetails || {}
      });
    }

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Return user data with token
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    let profile;
    if (user.role === 'farmer') {
      profile = await Farmer.findOne({ userId: user._id });
    } else if (user.role === 'company') {
      profile = await Company.findOne({ userId: user._id });
    }

    res.json({
      user,
      profile
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user basic info
    if (req.body.name) user.name = req.body.name;
    if (req.body.email) user.email = req.body.email;
    if (req.body.phone) user.phone = req.body.phone;
    if (req.body.password) user.password = req.body.password;

    await user.save();

    // Update role-specific profile
    if (user.role === 'farmer' && req.body.farmerProfile) {
      const farmer = await Farmer.findOne({ userId: user._id });
      
      if (req.body.farmerProfile.farmDetails) {
        farmer.farmDetails = {
          ...farmer.farmDetails,
          ...req.body.farmerProfile.farmDetails
        };
      }
      
      if (req.body.farmerProfile.bankDetails) {
        farmer.bankDetails = {
          ...farmer.bankDetails,
          ...req.body.farmerProfile.bankDetails
        };
      }
      
      await farmer.save();
    } else if (user.role === 'company' && req.body.companyProfile) {
      const company = await Company.findOne({ userId: user._id });
      
      if (req.body.companyProfile.companyDetails) {
        company.companyDetails = {
          ...company.companyDetails,
          ...req.body.companyProfile.companyDetails
        };
      }
      
      if (req.body.companyProfile.carbonFootprint) {
        company.carbonFootprint = {
          ...company.carbonFootprint,
          ...req.body.companyProfile.carbonFootprint
        };
      }
      
      await company.save();
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { register, login, getProfile, updateProfile };

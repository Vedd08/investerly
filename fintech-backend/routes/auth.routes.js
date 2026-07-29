const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Generate JWT Token
const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("FATAL ERROR: JWT_SECRET is not defined.");
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('contactNumber').trim().notEmpty().withMessage('Contact number is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array()[0].msg, errors: errors.array() });
  }
  
  try {
    const { name, email, contactNumber, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      contactNumber,
      password,
    });

    if (user) {
      res.status(201).json({
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').exists().withMessage('Password is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array()[0].msg, errors: errors.array() });
  }

  try {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      res.json({
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, async (req, res) => {
  res.json({
    success: true,
    _id: req.user.id,
    name: req.user.name,
    email: req.user.email,
  });
});

// @desc    Redvision API Login Proxy
// @route   POST /api/auth/redvision-login
// @access  Public
router.post('/redvision-login', async (req, res) => {
  try {
    const { username, password, loginFor } = req.body;
    
    // Redvision strictly requires the authorized domain for the API Key
    const siteDomain = "investerly.in";
    
    // Ensure Node fetch is available (Node 18+)
    const response = await fetch("https://redvisionassets.com/api/external-apis/login/ifa-login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username,
        password,
        loginFor,
        domain: siteDomain,
        callbackUrl: `https://${siteDomain}`, 
        siteUrl: "https://wealthelite.in/",
        apiKey: process.env.REDVISION_API_KEY
      })
    });
    
    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      // In case the API returns non-JSON like HTML or empty body
      return res.status(response.status).send(await response.text());
    }
    
    if (response.ok) {
      res.status(200).json(data);
    } else {
      res.status(response.status).json(data);
    }
  } catch (error) {
    console.error("Redvision login error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Redvision API Forgot Password - Send OTP
// @route   POST /api/auth/redvision-forgot-password-send
// @access  Public
router.post('/redvision-forgot-password-send', async (req, res) => {
  try {
    const { username, type } = req.body;
    const siteDomain = "investerly.in";
    
    const response = await fetch("https://redvisionassets.com/api/external-apis/login/forget-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username,
        type, 
        domain: siteDomain,
        apiKey: process.env.REDVISION_API_KEY
      })
    });
    
    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      return res.status(response.status).send(await response.text());
    }
    
    if (response.ok) {
      res.status(200).json(data);
    } else {
      res.status(response.status).json(data);
    }
  } catch (error) {
    console.error("Redvision send OTP error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Redvision API Forgot Password - Submit OTP
// @route   POST /api/auth/redvision-forgot-password-submit
// @access  Public
router.post('/redvision-forgot-password-submit', async (req, res) => {
  try {
    const { OtpMobileNo, mobileOtp } = req.body;
    const siteDomain = "investerly.in";
    
    const response = await fetch("https://redvisionassets.com/api/external-apis/login/submit-forget-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        OtpMobileNo,
        mobileOtp,
        domain: siteDomain,
        apiKey: process.env.REDVISION_API_KEY
      })
    });
    
    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      return res.status(response.status).send(await response.text());
    }
    
    if (response.ok) {
      res.status(200).json(data);
    } else {
      res.status(response.status).json(data);
    }
  } catch (error) {
    console.error("Redvision submit OTP error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const User = require('../models/User');

// @route   GET /api/users
// @desc    Get all users
// @access  Public (for admin panel usage without auth for now)
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
});

// @route   PUT /api/users/:id
// @desc    Update a user
// @access  Public (for admin panel usage without auth for now)
router.put('/:id', async (req, res) => {
  try {
    let user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Only update allowed fields
    const { name, email, contactNumber } = req.body;
    user.name = name || user.name;
    user.email = email || user.email;
    user.contactNumber = contactNumber || user.contactNumber;

    await user.save();

    res.json({ success: true, data: { _id: user._id, name: user.name, email: user.email, createdAt: user.createdAt } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
});

// @route   DELETE /api/users/:id
// @desc    Delete a user
// @access  Public (for admin panel usage without auth for now)
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await user.deleteOne();

    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
});

module.exports = router;

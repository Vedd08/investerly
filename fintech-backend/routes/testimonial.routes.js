const express = require("express");
const router = express.Router();
const Testimonial = require("../models/Testimonial");

// @route   GET /api/testimonials
// @desc    Get all testimonials
// @access  Public
router.get("/", async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.json({ success: true, count: testimonials.length, data: testimonials });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
});

// @route   POST /api/testimonials
// @desc    Create a new testimonial
// @access  Private (Admin)
router.post("/", async (req, res) => {
  try {
    const { name, role, type, content, status } = req.body;
    
    if (!name || !role || !type || !content) {
      return res.status(400).json({ success: false, message: "Please provide all required fields." });
    }

    const testimonial = await Testimonial.create({ name, role, type, content, status });
    res.status(201).json({ success: true, data: testimonial });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
});

// @route   PUT /api/testimonials/:id
// @desc    Update a testimonial
// @access  Private (Admin)
router.put("/:id", async (req, res) => {
  try {
    let testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({ success: false, message: "Testimonial not found" });
    }

    testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, data: testimonial });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
});

// @route   DELETE /api/testimonials/:id
// @desc    Delete a testimonial
// @access  Private (Admin)
router.delete("/:id", async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({ success: false, message: "Testimonial not found" });
    }

    await testimonial.deleteOne();

    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
});

module.exports = router;

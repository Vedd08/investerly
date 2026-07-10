const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    role: {
      type: String,
      required: [true, "Role or company is required"],
      trim: true,
    },
    type: {
      type: String,
      enum: ["video", "photo", "text"],
      required: [true, "Testimonial type is required"],
    },
    content: {
      type: String,
      required: [true, "Content (text or URL) is required"],
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Testimonial", testimonialSchema);

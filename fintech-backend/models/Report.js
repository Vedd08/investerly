const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  personName: {
    type: String,
    required: [true, 'Please provide the searched person name'],
    trim: true,
  },
  reportData: {
    type: Object,
    required: [true, 'Please provide the generated report data'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Report', reportSchema);

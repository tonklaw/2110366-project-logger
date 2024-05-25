const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now,
  },
  aqi: {
    type: Number,
    required: true,
  },
  dust: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('Data', dataSchema);
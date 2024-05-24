const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now,
  },
  data: {
    type: Object,
    required: true,
  },
});

module.exports = mongoose.model('Data', dataSchema);
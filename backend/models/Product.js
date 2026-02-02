const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a product name'],
    unique: true,
    trim: true
  },
  interestRate: {
    type: Number,
    required: [true, 'Please add an interest rate (APR)']
  },
  maxTenure: {
    type: Number,
    required: [true, 'Please add maximum tenure in years']
  },
  limit: {
    type: Number,
    required: [true, 'Please add maximum loan limit']
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  },
  description: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', productSchema);

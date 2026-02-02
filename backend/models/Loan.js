const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  loanType: {
    type: String,
    required: [true, 'Please specify loan type'],
    enum: ['Personal', 'Business', 'Home', 'Education']
  },
  amount: {
    type: Number,
    required: [true, 'Please add loan amount']
  },
  tenure: {
    type: Number,
    required: [true, 'Please add tenure in years']
  },
  interestRate: {
    type: Number,
    required: true
  },
  purpose: {
    type: String,
    required: [true, 'Please explain the purpose of the loan']
  },
  status: {
    type: String,
    enum: ['Pending', 'Reviewing', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  documents: [
    {
      name: String,
      url: String,
      uploadedAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  emi: Number,
  totalRepayment: Number,
  repaymentHistory: [
    {
      amount: Number,
      date: Date,
      status: String,
      mode: String
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Loan', loanSchema);

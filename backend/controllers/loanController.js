const Loan = require('../models/Loan');
const Notification = require('../models/Notification');
const User = require('../models/User');

// @desc    Apply for a loan
// @route   POST /api/loans/apply
// @access  Private
exports.applyLoan = async (req, res) => {
  try {
    req.body.user = req.user.id;

    // Calculate EMI (simplified)
    const { amount, tenure, interestRate } = req.body;
    const monthlyRate = interestRate / (12 * 100);
    const months = tenure * 12;
    const emi = (amount * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    
    req.body.emi = Math.round(emi);
    req.body.totalRepayment = Math.round(emi * months);

    // Handle documents if uploaded
    if (req.files && req.files.length > 0) {
      req.body.documents = req.files.map(file => ({
        name: file.originalname,
        url: `${req.protocol}://${req.get('host')}/${file.filename}`
      }));
    }

    const loan = await Loan.create(req.body);

    // Trigger Notifications for Admins
    const admins = await User.find({ role: 'admin' });
    const adminNotifications = admins.map(admin => ({
      user: admin._id,
      title: 'New Loan Application',
      message: `${req.user.name} has applied for a ${loan.loanType} loan of ${loan.amount}.`,
      type: 'info',
      link: '/admin/review'
    }));
    await Notification.insertMany(adminNotifications);

    // Trigger Notification for the User
    await Notification.create({
      user: req.user.id,
      title: 'Application Submitted',
      message: `Your ${loan.loanType} loan application for ${loan.amount} has been submitted successfully.`,
      type: 'success',
      link: '/dashboard/status'
    });

    res.status(201).json({
      success: true,
      data: loan
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Get user loans
// @route   GET /api/loans/my-loans
// @access  Private
exports.getMyLoans = async (req, res) => {
  try {
    const loans = await Loan.find({ user: req.user.id });

    res.status(200).json({
      success: true,
      count: loans.length,
      data: loans
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Get loan by ID
// @route   GET /api/loans/:id
// @access  Private
exports.getLoan = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id);

    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }

    // Check ownership
    if (loan.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.status(200).json({
      success: true,
      data: loan
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Make a repayment
// @route   POST /api/loans/:id/repay
// @access  Private
exports.makeRepayment = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id);

    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }

    // Check ownership
    if (loan.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const { amount, mode } = req.body;

    if (!amount) {
      return res.status(400).json({ message: 'Please provide repayment amount' });
    }

    loan.repaymentHistory.push({
      amount,
      mode: mode || 'Manual',
      date: Date.now(),
      status: 'Success'
    });

    await loan.save();

    // Trigger Notifications for Admins
    const admins = await User.find({ role: 'admin' });
    const adminNotifications = admins.map(admin => ({
      user: admin._id,
      title: 'Repayment Received',
      message: `${req.user.name} made a repayment of ${amount} for their ${loan.loanType} loan.`,
      type: 'success',
      link: '/admin/repayments'
    }));
    await Notification.insertMany(adminNotifications);

    res.status(200).json({
      success: true,
      data: loan
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

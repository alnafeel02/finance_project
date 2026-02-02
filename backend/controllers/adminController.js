const User = require('../models/User');
const Loan = require('../models/Loan');
const Notification = require('../models/Notification');

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getAdminStats = async (req, res) => {
  try {
    const totalDisbursed = await Loan.aggregate([
      { $match: { status: 'Approved' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const activeBorrowers = await User.countDocuments({ role: 'user' });
    const pendingApps = await Loan.countDocuments({ status: 'Pending' });
    
    // Mock default rate for now
    const defaultRate = '2.1%';

    res.status(200).json({
      success: true,
      data: {
        totalDisbursed: totalDisbursed[0]?.total || 0,
        activeBorrowers,
        pendingApps,
        defaultRate
      }
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Get all applications (for review)
// @route   GET /api/admin/applications
// @access  Private/Admin
exports.getAllApplications = async (req, res) => {
  try {
    const loans = await Loan.find().populate('user', 'name email');

    res.status(200).json({
      success: true,
      count: loans.length,
      data: loans
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Update loan status
// @route   PUT /api/admin/loans/:id/status
// @access  Private/Admin
exports.updateLoanStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const loan = await Loan.findByIdAndUpdate(
      req.params.id, 
      { status }, 
      { new: true, runValidators: true }
    );

    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }

    // Trigger Notification
    await Notification.create({
      user: loan.user,
      title: 'Loan Status Updated',
      message: `Your ${loan.loanType} loan application has been updated to: ${status}.`,
      type: status === 'Approved' ? 'success' : status === 'Rejected' ? 'error' : 'info',
      link: '/dashboard/status'
    });

    res.status(200).json({
      success: true,
      data: loan
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Get reports data
// @route   GET /api/admin/reports
// @access  Private/Admin
exports.getReportsData = async (req, res) => {
  try {
    const loans = await Loan.find();

    // Portfolio Mix
    const portfolioMix = loans.reduce((acc, loan) => {
      acc[loan.loanType] = (acc[loan.loanType] || 0) + loan.amount;
      return acc;
    }, {});

    // Volume Stats (Applications per status)
    const volumeStats = loans.reduce((acc, loan) => {
      acc[loan.status] = (acc[loan.status] || 0) + 1;
      return acc;
    }, {});

    // Revenue projection (Sum of all interest/EMI)
    const totalRepayment = loans.reduce((acc, loan) => acc + (loan.totalRepayment || 0), 0);
    const totalPrincipal = loans.reduce((acc, loan) => acc + loan.amount, 0);
    const projectedInterest = totalRepayment - totalPrincipal;

    res.status(200).json({
      success: true,
      data: {
        portfolioMix,
        volumeStats,
        projectedInterest,
        totalLoans: loans.length
      }
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
// @desc    Update user status (block/unblock)
// @route   PUT /api/admin/users/:id/status
// @access  Private/Admin
exports.updateUserStatus = async (req, res) => {
  try {
    const { kycStatus } = req.body; // Using kycStatus or adding a 'status' field? User model has kycStatus.
    // Let's check User.js again. It has kycStatus: pending, verified, rejected.
    // User might want an actual 'blocked' status.
    // For now I will use a generic update.
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Trigger Notification
    if (kycStatus) {
      await Notification.create({
        user: user._id,
        title: 'KYC Status Updated',
        message: `Your identity verification status is now: ${kycStatus}.`,
        type: kycStatus === 'verified' ? 'success' : kycStatus === 'rejected' ? 'error' : 'info',
        link: '/dashboard'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Get all repayments (global ledger)
// @route   GET /api/admin/repayments
// @access  Private/Admin
exports.getAllRepayments = async (req, res) => {
  try {
    const loans = await Loan.find()
      .populate('user', 'name email')
      .select('repaymentHistory user loanType');

    const allRepayments = loans.reduce((acc, loan) => {
      const repayments = loan.repaymentHistory.map(rep => ({
        ...rep.toObject(),
        user: loan.user,
        loanType: loan.loanType,
        loanId: loan._id
      }));
      return acc.concat(repayments);
    }, []);

    // Sort by date descending
    allRepayments.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.status(200).json({
      success: true,
      count: allRepayments.length,
      data: allRepayments
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

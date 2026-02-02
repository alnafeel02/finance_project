const User = require('../models/User');
const jwt = require('jsonwebtoken');
const Notification = require('../models/Notification');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    const user = await User.create({
      name,
      email,
      password,
      phone
    });

    // Trigger Notifications for Admins
    const admins = await User.find({ role: 'admin' });
    const adminNotifications = admins.map(admin => ({
      user: admin._id,
      title: 'New User Registered',
      message: `${name} (${email}) has joined FinanceHub.`,
      type: 'info',
      link: '/admin/users'
    }));
    await Notification.insertMany(adminNotifications);

    // Trigger Welcome Notification for the User
    await Notification.create({
      user: user._id,
      title: 'Welcome to FinanceHub!',
      message: `Hi ${name}, welcome to your new financial dashboard. Start by completing your KYC.`,
      type: 'success',
      link: '/dashboard'
    });

    sendTokenResponse(user, 201, res);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide an email and password' });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Help function to get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
};

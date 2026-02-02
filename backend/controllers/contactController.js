const Contact = require('../models/Contact');
const Notification = require('../models/Notification');
const User = require('../models/User');

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
exports.submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    const contact = await Contact.create({
      name,
      email,
      subject,
      message
    });

    // Trigger Notifications for all Admins
    const admins = await User.find({ role: 'admin' });
    const adminNotifications = admins.map(admin => ({
      user: admin._id,
      title: 'New Contact Inquiry',
      message: `New message from ${name} regarding: ${subject}`,
      type: 'info',
      link: '/admin/inquiries'
    }));
    await Notification.insertMany(adminNotifications);

    res.status(201).json({
      success: true,
      data: contact
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Get all contact inquiries
// @route   GET /api/contact
// @access  Private/Admin
exports.getInquiries = async (req, res) => {
  try {
    const inquiries = await Contact.find().sort('-createdAt');
    res.status(200).json({
      success: true,
      count: inquiries.length,
      data: inquiries
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

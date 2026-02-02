const Notification = require('../models/Notification');
const User = require('../models/User');

// @desc    Get all notifications for logged in user
// @route   GET /api/notifications
// @access  Private
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id })
      .sort('-createdAt')
      .limit(20);

    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
exports.markAsRead = async (req, res) => {
  try {
    let notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    // Make sure notification belongs to user
    if (notification.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    notification.isRead = true;
    await notification.save();

    res.status(200).json({
      success: true,
      data: notification
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    if (notification.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await notification.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Create notification (supports broadcast)
// @route   POST /api/notifications
// @access  Private
exports.createNotification = async (req, res) => {
  try {
    const { user, title, message, type, link } = req.body;

    if (user === 'admin_broadcast') {
      const admins = await User.find({ role: 'admin' });
      const adminNotifications = admins.map(admin => ({
        user: admin._id,
        title,
        message,
        type: type || 'info',
        link
      }));
      await Notification.insertMany(adminNotifications);
    } else {
      await Notification.create({
        user,
        title,
        message,
        type: type || 'info',
        link
      });
    }

    res.status(201).json({
      success: true,
      message: 'Notification(s) created'
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

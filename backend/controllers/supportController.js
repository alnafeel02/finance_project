const Ticket = require('../models/Ticket');
const Message = require('../models/Message');

// @desc    Create a new support ticket
// @route   POST /api/tickets
// @access  Private
exports.createTicket = async (req, res) => {
  try {
    const { title, description, priority } = req.body;

    const ticket = await Ticket.create({
      user: req.user.id,
      title,
      description,
      priority: priority || 'Medium'
    });

    res.status(201).json({
      success: true,
      data: ticket
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Get user's tickets
// @route   GET /api/tickets/my-tickets
// @access  Private
exports.getMyTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ user: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tickets.length,
      data: tickets
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Send a message (Chat)
// @route   POST /api/support/messages
// @access  Private
exports.sendMessage = async (req, res) => {
  try {
    const { content } = req.body;

    const message = await Message.create({
      sender: req.user.id,
      content,
      isFromAdmin: req.user.role === 'admin'
    });

    res.status(201).json({
      success: true,
      data: message
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Get chat history
// @route   GET /api/support/messages
// @access  Private
exports.getMessages = async (req, res) => {
  try {
    // For now, simple: get all messages where user is sender or receiver is null (to support pool)
    // In a real app, you'd filter by user/conversation
    let filter = {};
    if (req.user.role !== 'admin') {
      filter = {
        $or: [
          { sender: req.user.id },
          { receiver: req.user.id },
          { receiver: null, isFromAdmin: true } // Messages from admin to all or specifically intended for user
        ]
      };
    }

    const messages = await Message.find(filter).sort({ createdAt: 1 }).populate('sender', 'name');

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

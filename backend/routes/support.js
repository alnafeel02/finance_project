const express = require('express');
const router = express.Router();
const { 
  createTicket, 
  getMyTickets, 
  sendMessage, 
  getMessages 
} = require('../controllers/supportController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/tickets', createTicket);
router.get('/tickets/my-tickets', getMyTickets);
router.post('/messages', sendMessage);
router.get('/messages', getMessages);

module.exports = router;

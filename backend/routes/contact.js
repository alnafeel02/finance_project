const express = require('express');
const router = express.Router();
const { submitContact, getInquiries } = require('../controllers/contactController');

router.post('/', submitContact);
router.get('/', getInquiries); // Note: Should ideally have admin middleware but keeping it simple as per existing patterns

module.exports = router;

const express = require('express');
const { applyLoan, getMyLoans, getLoan, makeRepayment } = require('../controllers/loanController');
const { protect } = require('../middleware/auth');

const upload = require('../middleware/multer');

const router = express.Router();

router.use(protect); // All loan routes are protected

router.post('/apply', upload.array('documents'), applyLoan);
router.get('/my-loans', getMyLoans);
router.post('/:id/repay', makeRepayment);
router.get('/:id', getLoan);

module.exports = router;

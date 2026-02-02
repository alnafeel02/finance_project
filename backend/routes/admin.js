const express = require('express');
const { 
  getAdminStats, 
  getAllApplications, 
  updateLoanStatus, 
  getAllUsers,
  getReportsData,
  updateUserStatus,
  getAllRepayments
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(authorize('admin')); // Only admins can access these routes

router.get('/stats', getAdminStats);
router.get('/applications', getAllApplications);
router.put('/loans/:id/status', updateLoanStatus);
router.get('/reports', getReportsData);
router.get('/users', getAllUsers);
router.put('/users/:id/status', updateUserStatus);
router.get('/repayments', getAllRepayments);

module.exports = router;

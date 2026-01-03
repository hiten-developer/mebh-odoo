const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leaveController');
const { authenticate, authorize } = require('../middleware/auth');
const { validateLeave } = require('../middleware/validate');

// Employee routes
router.post('/', authenticate, validateLeave, leaveController.applyLeave);
router.get('/my', authenticate, leaveController.getMyLeaves);

// Admin/HR routes
router.get('/', authenticate, authorize('admin', 'hr'), leaveController.getAllLeaves);
router.patch('/:id/status', authenticate, authorize('admin', 'hr'), leaveController.updateLeaveStatus);

module.exports = router;
const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leaveController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { ROLES } = require('../config/constants');

// All routes require authentication
router.use(authMiddleware);

// Employee routes
router.post('/apply', leaveController.applyLeave);
router.get('/my-leaves', leaveController.getMyLeaves);
router.delete('/cancel/:id', leaveController.cancelLeave);

// Admin/HR routes
router.get(
  '/',
  roleMiddleware(ROLES.ADMIN, ROLES.HR),
  leaveController.getAllLeaves
);

router.put(
  '/:id/status',
  roleMiddleware(ROLES.ADMIN, ROLES.HR),
  leaveController.updateLeaveStatus
);

module.exports = router;
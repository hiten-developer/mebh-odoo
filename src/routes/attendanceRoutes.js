const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { ROLES } = require('../config/constants');

// All routes require authentication
router.use(authMiddleware);

// Employee routes
router.post('/check-in', attendanceController.checkIn);
router.post('/check-out', attendanceController.checkOut);
router.get('/my-attendance', attendanceController.getMyAttendance);

// Admin/HR routes
router.get(
  '/',
  roleMiddleware(ROLES.ADMIN, ROLES.HR),
  attendanceController.getAllAttendance
);

router.put(
  '/:id',
  roleMiddleware(ROLES.ADMIN, ROLES.HR),
  attendanceController.updateAttendance
);

module.exports = router;
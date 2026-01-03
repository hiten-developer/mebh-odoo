const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { authenticate, authorize } = require('../middleware/auth');

// Employee routes - Mark attendance and view own attendance
router.post('/', authenticate, attendanceController.markAttendance);
router.get('/my', authenticate, attendanceController.getMyAttendance);

// Admin/HR routes - View all attendance and update
router.get('/', authenticate, authorize('admin', 'hr'), attendanceController.getAllAttendance);
router.put('/:id', authenticate, authorize('admin', 'hr'), attendanceController.updateAttendance);

module.exports = router;
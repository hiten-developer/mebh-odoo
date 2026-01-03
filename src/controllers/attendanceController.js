const Attendance = require('../models/Attendance');
const User = require('../models/User');
const { ATTENDANCE_STATUS } = require('../config/constants');

// Check-in
exports.checkIn = async (req, res) => {
  try {
    const userId = req.user._id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if already checked in today
    const existingAttendance = await Attendance.findOne({
      employee: userId,
      date: { $gte: today }
    });

    if (existingAttendance && existingAttendance.checkIn) {
      return res.status(400).json({ 
        success: false, 
        message: 'Already checked in today' 
      });
    }

    const attendance = await Attendance.findOneAndUpdate(
      { employee: userId, date: { $gte: today } },
      {
        employee: userId,
        checkIn: new Date(),
        status: ATTENDANCE_STATUS.PRESENT,
        date: new Date()
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json({
      success: true,
      message: 'Checked in successfully',
      data: attendance
    });
  } catch (error) {
    console.error('Check-in error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Check-in failed' 
    });
  }
};

// Check-out
exports.checkOut = async (req, res) => {
  try {
    const userId = req.user._id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({
      employee: userId,
      date: { $gte: today }
    });

    if (!attendance) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please check in first' 
      });
    }

    if (attendance.checkOut) {
      return res.status(400).json({ 
        success: false, 
        message: 'Already checked out today' 
      });
    }

    attendance.checkOut = new Date();
    attendance.hoursWorked = attendance.calculatedHours;
    await attendance.save();

    res.json({
      success: true,
      message: 'Checked out successfully',
      data: attendance
    });
  } catch (error) {
    console.error('Check-out error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Check-out failed' 
    });
  }
};

// Get employee's own attendance
exports.getMyAttendance = async (req, res) => {
  try {
    const userId = req.user._id;
    const { startDate, endDate, page = 1, limit = 30 } = req.query;

    let query = { employee: userId };

    // Date range filter
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      query.date = { $gte: start, $lte: end };
    }

    const attendance = await Attendance.find(query)
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Attendance.countDocuments(query);

    // Calculate summary
    const presentCount = await Attendance.countDocuments({ 
      ...query, 
      status: ATTENDANCE_STATUS.PRESENT 
    });
    const absentCount = await Attendance.countDocuments({ 
      ...query, 
      status: ATTENDANCE_STATUS.ABSENT 
    });
    const leaveCount = await Attendance.countDocuments({ 
      ...query, 
      status: ATTENDANCE_STATUS.LEAVE 
    });

    res.json({
      success: true,
      data: attendance,
      summary: {
        present: presentCount,
        absent: absentCount,
        leave: leaveCount,
        total
      },
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get attendance error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to get attendance' 
    });
  }
};

// Admin: Get all attendance
exports.getAllAttendance = async (req, res) => {
  try {
    const { startDate, endDate, employeeId, page = 1, limit = 30 } = req.query;

    let query = {};

    // Date range filter
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      query.date = { $gte: start, $lte: end };
    }

    // Employee filter
    if (employeeId) {
      const employee = await User.findOne({ employeeId });
      if (employee) {
        query.employee = employee._id;
      }
    }

    const attendance = await Attendance.find(query)
      .populate('employee', 'employeeId personalDetails.firstName personalDetails.lastName')
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Attendance.countDocuments(query);

    res.json({
      success: true,
      data: attendance,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get all attendance error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to get attendance' 
    });
  }
};

// Admin: Update attendance manually
exports.updateAttendance = async (req, res) => {
  try {
    const { date, status, checkIn, checkOut, notes } = req.body;
    const employeeId = req.params.id;

    const attendance = await Attendance.findOneAndUpdate(
      { employee: employeeId, date: new Date(date) },
      {
        status,
        checkIn: checkIn ? new Date(checkIn) : null,
        checkOut: checkOut ? new Date(checkOut) : null,
        notes,
        employee: employeeId,
        date: new Date(date)
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json({
      success: true,
      message: 'Attendance updated successfully',
      data: attendance
    });
  } catch (error) {
    console.error('Update attendance error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to update attendance' 
    });
  }
};
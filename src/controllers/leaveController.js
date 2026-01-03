const Leave = require('../models/Leave');
const User = require('../models/User');
const { LEAVE_TYPES, LEAVE_STATUS } = require('../config/constants');
const { calculateWorkingDays } = require('../utils/helpers');

// Apply for leave
exports.applyLeave = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason, isHalfDay, halfDayType } = req.body;
    const employeeId = req.user._id;

    // Validation
    if (!leaveType || !startDate || !endDate || !reason) {
      return res.status(400).json({ 
        success: false, 
        message: 'Leave type, start date, end date and reason are required' 
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start > end) {
      return res.status(400).json({ 
        success: false, 
        message: 'Start date cannot be after end date' 
      });
    }

    // Check if dates are in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (start < today) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot apply for leave in the past' 
      });
    }

    // Calculate number of days
    let days = calculateWorkingDays(start, end);
    
    if (isHalfDay) {
      days = 0.5;
    }

    // Check for overlapping leave requests
    const overlappingLeave = await Leave.findOne({
      employee: employeeId,
      status: { $in: [LEAVE_STATUS.PENDING, LEAVE_STATUS.APPROVED] },
      $or: [
        { startDate: { $lte: end }, endDate: { $gte: start } }
      ]
    });

    if (overlappingLeave) {
      return res.status(400).json({ 
        success: false, 
        message: 'You already have a leave request for these dates' 
      });
    }

    // Create leave request
    const leave = new Leave({
      employee: employeeId,
      leaveType,
      startDate: start,
      endDate: end,
      days,
      reason,
      status: LEAVE_STATUS.PENDING,
      isHalfDay: isHalfDay || false,
      halfDayType: isHalfDay ? halfDayType : null
    });

    await leave.save();

    // Populate employee details
    await leave.populate('employee', 'employeeId personalDetails.firstName personalDetails.lastName');

    res.status(201).json({
      success: true,
      message: 'Leave application submitted successfully',
      data: leave
    });
  } catch (error) {
    console.error('Apply leave error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to apply for leave' 
    });
  }
};

// Get employee's own leave requests
exports.getMyLeaves = async (req, res) => {
  try {
    const employeeId = req.user._id;
    const { status, leaveType, startDate, endDate, page = 1, limit = 10 } = req.query;

    let query = { employee: employeeId };

    // Filters
    if (status) query.status = status;
    if (leaveType) query.leaveType = leaveType;
    
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      query.startDate = { $gte: start };
      query.endDate = { $lte: end };
    }

    const leaves = await Leave.find(query)
      .populate('approvedBy', 'employeeId personalDetails.firstName personalDetails.lastName')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Leave.countDocuments(query);

    // Calculate summary
    const pendingCount = await Leave.countDocuments({ ...query, status: LEAVE_STATUS.PENDING });
    const approvedCount = await Leave.countDocuments({ ...query, status: LEAVE_STATUS.APPROVED });
    const rejectedCount = await Leave.countDocuments({ ...query, status: LEAVE_STATUS.REJECTED });

    res.json({
      success: true,
      data: leaves,
      summary: {
        pending: pendingCount,
        approved: approvedCount,
        rejected: rejectedCount,
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
    console.error('Get my leaves error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to get leave requests' 
    });
  }
};

// Admin: Get all leave requests
exports.getAllLeaves = async (req, res) => {
  try {
    const { status, employeeId, leaveType, startDate, endDate, page = 1, limit = 10 } = req.query;

    let query = {};

    // Filters
    if (status) query.status = status;
    if (leaveType) query.leaveType = leaveType;
    
    if (employeeId) {
      const employee = await User.findOne({ employeeId });
      if (employee) {
        query.employee = employee._id;
      }
    }
    
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      query.startDate = { $gte: start };
      query.endDate = { $lte: end };
    }

    const leaves = await Leave.find(query)
      .populate('employee', 'employeeId personalDetails.firstName personalDetails.lastName jobDetails.department')
      .populate('approvedBy', 'employeeId personalDetails.firstName personalDetails.lastName')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Leave.countDocuments(query);

    res.json({
      success: true,
      data: leaves,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get all leaves error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to get leave requests' 
    });
  }
};

// Admin: Approve/Reject leave
exports.updateLeaveStatus = async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;
    const leaveId = req.params.id;
    const adminId = req.user._id;

    if (![LEAVE_STATUS.APPROVED, LEAVE_STATUS.REJECTED].includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid status. Use "approved" or "rejected"' 
      });
    }

    const leave = await Leave.findById(leaveId);
    
    if (!leave) {
      return res.status(404).json({ 
        success: false, 
        message: 'Leave request not found' 
      });
    }

    if (leave.status !== LEAVE_STATUS.PENDING) {
      return res.status(400).json({ 
        success: false, 
        message: 'Leave request is already processed' 
      });
    }

    leave.status = status;
    leave.approvedBy = adminId;
    leave.approvedAt = new Date();
    
    if (status === LEAVE_STATUS.REJECTED && rejectionReason) {
      leave.rejectionReason = rejectionReason;
    }

    await leave.save();

    // Populate data
    await leave.populate('employee', 'employeeId email personalDetails.firstName personalDetails.lastName');
    await leave.populate('approvedBy', 'employeeId personalDetails.firstName personalDetails.lastName');

    res.json({
      success: true,
      message: `Leave request ${status} successfully`,
      data: leave
    });
  } catch (error) {
    console.error('Update leave status error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to update leave status' 
    });
  }
};

// Cancel leave request (employee only, if pending)
exports.cancelLeave = async (req, res) => {
  try {
    const leaveId = req.params.id;
    const employeeId = req.user._id;

    const leave = await Leave.findOne({ _id: leaveId, employee: employeeId });
    
    if (!leave) {
      return res.status(404).json({ 
        success: false, 
        message: 'Leave request not found' 
      });
    }

    if (leave.status !== LEAVE_STATUS.PENDING) {
      return res.status(400).json({ 
        success: false, 
        message: 'Only pending leave requests can be cancelled' 
      });
    }

    // Check if leave is in the future
    const today = new Date();
    if (leave.startDate <= today) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot cancel leave that has already started' 
      });
    }

    await Leave.findByIdAndDelete(leaveId);

    res.json({
      success: true,
      message: 'Leave request cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel leave error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to cancel leave request' 
    });
  }
};
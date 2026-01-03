const User = require('../models/User');
const Attendance = require('../models/Attendance');
const Leave = require('../models/Leave');
const Payroll = require('../models/Payroll');
const { ROLES } = require('../config/constants');

// Get all employees (for Admin/HR)
exports.getAllEmployees = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', department = '' } = req.query;
    
    const query = { role: ROLES.EMPLOYEE };
    
    if (search) {
      query.$or = [
        { employeeId: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { 'personalDetails.firstName': { $regex: search, $options: 'i' } },
        { 'personalDetails.lastName': { $regex: search, $options: 'i' } }
      ];
    }
    
    if (department) {
      query['jobDetails.department'] = department;
    }

    const employees = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: employees,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get all employees error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to get employees' 
    });
  }
};

// Get single employee by ID (for Admin/HR)
exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await User.findById(req.params.id)
      .select('-password')
      .populate('jobDetails.department', 'name');

    if (!employee) {
      return res.status(404).json({ 
        success: false, 
        message: 'Employee not found' 
      });
    }

    res.json({
      success: true,
      data: employee
    });
  } catch (error) {
    console.error('Get employee error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to get employee' 
    });
  }
};

// Update employee (for Admin/HR)
exports.updateEmployee = async (req, res) => {
  try {
    const updates = req.body;
    const employeeId = req.params.id;

    // Remove password from updates if present
    delete updates.password;
    delete updates.email;
    delete updates.employeeId;

    const employee = await User.findByIdAndUpdate(
      employeeId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    if (!employee) {
      return res.status(404).json({ 
        success: false, 
        message: 'Employee not found' 
      });
    }

    res.json({
      success: true,
      message: 'Employee updated successfully',
      data: employee
    });
  } catch (error) {
    console.error('Update employee error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to update employee' 
    });
  }
};

// Delete/Deactivate employee (for Admin/HR)
exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await User.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ 
        success: false, 
        message: 'Employee not found' 
      });
    }

    // Soft delete - deactivate account
    employee.isActive = false;
    await employee.save();

    res.json({
      success: true,
      message: 'Employee deactivated successfully'
    });
  } catch (error) {
    console.error('Delete employee error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to deactivate employee' 
    });
  }
};

// Get employee dashboard stats
exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const isAdmin = [ROLES.ADMIN, ROLES.HR].includes(req.user.role);

    let stats = {};

    if (isAdmin) {
      // Admin stats
      const totalEmployees = await User.countDocuments({ role: ROLES.EMPLOYEE, isActive: true });
      const pendingLeaves = await Leave.countDocuments({ status: 'pending' });
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const presentToday = await Attendance.countDocuments({ 
        date: { $gte: today }, 
        status: 'present' 
      });

      stats = {
        totalEmployees,
        pendingLeaves,
        presentToday,
        absentToday: totalEmployees - presentToday
      };
    } else {
      // Employee stats
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const attendanceToday = await Attendance.findOne({ 
        employee: userId, 
        date: { $gte: today } 
      });

      const pendingLeaves = await Leave.countDocuments({ 
        employee: userId, 
        status: 'pending' 
      });

      const approvedLeaves = await Leave.countDocuments({ 
        employee: userId, 
        status: 'approved' 
      });

      stats = {
        attendanceStatus: attendanceToday?.status || 'absent',
        checkInTime: attendanceToday?.checkIn,
        pendingLeaves,
        approvedLeaves
      };
    }

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to get dashboard stats' 
    });
  }
};
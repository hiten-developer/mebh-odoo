const db = require('../config/db');

// Mark attendance
exports.markAttendance = (req, res) => {
  try {
    const { date, status, checkIn, checkOut, remarks } = req.body;
    const userId = req.user.id;
    
    // Get user
    const user = db.findUserById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Check if attendance already exists for this date
    const existingAttendance = db.getAttendanceByUserId(userId)
      .find(record => record.date === date);
    
    if (existingAttendance) {
      return res.status(400).json({
        success: false,
        message: 'Attendance already marked for this date'
      });
    }
    
    // Calculate total hours
    let totalHours = 0;
    if (checkIn && checkOut) {
      const [checkInHour, checkInMinute] = checkIn.split(':').map(Number);
      const [checkOutHour, checkOutMinute] = checkOut.split(':').map(Number);
      totalHours = (checkOutHour + checkOutMinute/60) - (checkInHour + checkInMinute/60);
      totalHours = Math.max(0, totalHours); // Ensure non-negative
    }
    
    // Create attendance record
    const attendance = db.addAttendance({
      userId,
      employeeId: user.employeeId,
      employeeName: `${user.firstName} ${user.lastName}`,
      date,
      checkIn: checkIn || null,
      checkOut: checkOut || null,
      status,
      remarks: remarks || '',
      totalHours: totalHours.toFixed(2),
      createdAt: new Date()
    });
    
    res.status(201).json({
      success: true,
      message: 'Attendance marked successfully',
      attendance
    });
  } catch (error) {
    console.error('Attendance error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while marking attendance'
    });
  }
};

// Get user's attendance
exports.getMyAttendance = (req, res) => {
  try {
    const userId = req.user.id;
    const { month, year, startDate, endDate } = req.query;
    
    let attendance = db.getAttendanceByUserId(userId);
    
    // Filter by month and year if provided
    if (month && year) {
      attendance = attendance.filter(record => {
        const recordDate = new Date(record.date);
        return recordDate.getMonth() + 1 === parseInt(month) && 
               recordDate.getFullYear() === parseInt(year);
      });
    }
    
    // Filter by date range if provided
    if (startDate && endDate) {
      attendance = attendance.filter(record => {
        return record.date >= startDate && record.date <= endDate;
      });
    }
    
    // Sort by date (newest first)
    attendance.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Calculate statistics
    const stats = {
      totalDays: attendance.length,
      present: attendance.filter(a => a.status === 'present').length,
      absent: attendance.filter(a => a.status === 'absent').length,
      halfDay: attendance.filter(a => a.status === 'half-day').length,
      leave: attendance.filter(a => a.status === 'leave').length,
      totalHours: attendance.reduce((sum, a) => sum + (parseFloat(a.totalHours) || 0), 0).toFixed(2)
    };
    
    res.json({
      success: true,
      count: attendance.length,
      stats,
      attendance
    });
  } catch (error) {
    console.error('Get attendance error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching attendance'
    });
  }
};

// Get all attendance (admin/HR)
exports.getAllAttendance = (req, res) => {
  try {
    const { date, employeeId, department, status } = req.query;
    let attendance = db.attendance || [];
    
    // Filter by date if provided
    if (date) {
      attendance = attendance.filter(record => record.date === date);
    }
    
    // Filter by employeeId if provided
    if (employeeId) {
      attendance = attendance.filter(record => record.employeeId === employeeId);
    }
    
    // Filter by status if provided
    if (status) {
      attendance = attendance.filter(record => record.status === status);
    }
    
    // Sort by date (newest first)
    attendance.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Get unique dates for calendar view
    const uniqueDates = [...new Set(attendance.map(a => a.date))];
    
    // Calculate summary statistics
    const summary = {
      totalRecords: attendance.length,
      byStatus: {
        present: attendance.filter(a => a.status === 'present').length,
        absent: attendance.filter(a => a.status === 'absent').length,
        halfDay: attendance.filter(a => a.status === 'half-day').length,
        leave: attendance.filter(a => a.status === 'leave').length
      }
    };
    
    res.json({
      success: true,
      count: attendance.length,
      summary,
      uniqueDates,
      attendance
    });
  } catch (error) {
    console.error('Get all attendance error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching all attendance'
    });
  }
};

// Update attendance (admin/HR)
exports.updateAttendance = (req, res) => {
  try {
    const attendanceId = parseInt(req.params.id);
    const updates = req.body;
    
    // Find attendance record
    const attendanceIndex = db.attendance.findIndex(a => a.id === attendanceId);
    
    if (attendanceIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Attendance record not found'
      });
    }
    
    // Update fields
    const attendance = db.attendance[attendanceIndex];
    Object.keys(updates).forEach(key => {
      if (key !== 'id' && key !== 'createdAt') {
        attendance[key] = updates[key];
      }
    });
    
    // Recalculate total hours if checkIn/checkOut changed
    if (updates.checkIn || updates.checkOut) {
      const checkIn = updates.checkIn || attendance.checkIn;
      const checkOut = updates.checkOut || attendance.checkOut;
      
      if (checkIn && checkOut) {
        const [checkInHour, checkInMinute] = checkIn.split(':').map(Number);
        const [checkOutHour, checkOutMinute] = checkOut.split(':').map(Number);
        attendance.totalHours = ((checkOutHour + checkOutMinute/60) - (checkInHour + checkInMinute/60)).toFixed(2);
      } else {
        attendance.totalHours = '0.00';
      }
    }
    
    attendance.updatedAt = new Date();
    
    res.json({
      success: true,
      message: 'Attendance updated successfully',
      attendance
    });
  } catch (error) {
    console.error('Update attendance error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating attendance'
    });
  }
};
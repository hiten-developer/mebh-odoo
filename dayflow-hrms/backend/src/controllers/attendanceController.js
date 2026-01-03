// Mock attendance data
let attendance = [];

// Mark attendance
exports.markAttendance = (req, res) => {
  try {
    const { date, status, checkIn, checkOut, remarks } = req.body;
    const userId = req.user.id;
    
    // Create attendance record
    const newAttendance = {
      id: attendance.length + 1,
      userId,
      employeeId: `EMP${userId}`,
      date,
      checkIn,
      checkOut,
      status,
      remarks,
      createdAt: new Date()
    };
    
    attendance.push(newAttendance);
    
    res.status(201).json({
      success: true,
      message: 'Attendance marked successfully',
      attendance: newAttendance
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
    const userAttendance = attendance.filter(a => a.userId === userId);
    
    res.json({
      success: true,
      count: userAttendance.length,
      attendance: userAttendance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching attendance'
    });
  }
};

// Get all attendance (admin/HR)
exports.getAllAttendance = (req, res) => {
  try {
    res.json({
      success: true,
      count: attendance.length,
      attendance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching all attendance'
    });
  }
};
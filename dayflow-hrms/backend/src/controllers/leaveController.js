// Mock leaves data
let leaves = [];

// Apply for leave
exports.applyLeave = (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;
    const userId = req.user.id;
    
    const newLeave = {
      id: leaves.length + 1,
      userId,
      employeeId: `EMP${userId}`,
      leaveType,
      startDate,
      endDate,
      reason,
      status: 'pending',
      appliedDate: new Date()
    };
    
    leaves.push(newLeave);
    
    res.status(201).json({
      success: true,
      message: 'Leave application submitted successfully',
      leave: newLeave
    });
  } catch (error) {
    console.error('Leave application error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get my leaves
exports.getMyLeaves = (req, res) => {
  try {
    const userId = req.user.id;
    const userLeaves = leaves.filter(l => l.userId === userId);
    
    res.json({
      success: true,
      count: userLeaves.length,
      leaves: userLeaves
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get all leaves (admin/HR)
exports.getAllLeaves = (req, res) => {
  try {
    res.json({
      success: true,
      count: leaves.length,
      leaves
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Update leave status
exports.updateLeaveStatus = (req, res) => {
  try {
    const leaveId = parseInt(req.params.id);
    const { status } = req.body;
    
    const leaveIndex = leaves.findIndex(l => l.id === leaveId);
    
    if (leaveIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found'
      });
    }
    
    leaves[leaveIndex].status = status;
    
    res.json({
      success: true,
      message: `Leave request ${status} successfully`,
      leave: leaves[leaveIndex]
    });
  } catch (error) {
    console.error('Update leave error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
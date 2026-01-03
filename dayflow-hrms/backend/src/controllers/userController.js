// Mock database
const users = [
  {
    id: 1,
    employeeId: "EMP001",
    email: "admin@dayflow.com",
    firstName: "Admin",
    lastName: "User",
    role: "admin",
    department: "Management",
    position: "CEO",
    salary: 100000
  },
  {
    id: 2,
    employeeId: "EMP002",
    email: "hr@dayflow.com",
    firstName: "HR",
    lastName: "Manager",
    role: "hr",
    department: "Human Resources",
    position: "HR Manager",
    salary: 75000
  }
];

// Get all users (for admin/HR)
exports.getAllUsers = (req, res) => {
  try {
    res.json({
      success: true,
      count: users.length,
      users: users.map(user => {
        const { password, ...safeUser } = user;
        return safeUser;
      })
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching users'
    });
  }
};

// Get user by ID
exports.getUserById = (req, res) => {
  try {
    const user = users.find(u => u.id === parseInt(req.params.id));
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const { password, ...userResponse } = user;
    res.json({
      success: true,
      user: userResponse
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Update user (admin/HR only)
exports.updateUser = (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update fields
    const updates = req.body;
    Object.keys(updates).forEach(key => {
      if (key !== 'password' && key !== 'id') {
        users[userIndex][key] = updates[key];
      }
    });

    const { password, ...userResponse } = users[userIndex];
    
    res.json({
      success: true,
      message: 'User updated successfully',
      user: userResponse
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get user statistics
exports.getUserStats = (req, res) => {
  try {
    const stats = {
      total: users.length,
      byRole: {
        admin: users.filter(u => u.role === 'admin').length,
        hr: users.filter(u => u.role === 'hr').length,
        employee: users.filter(u => u.role === 'employee').length
      }
    };

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
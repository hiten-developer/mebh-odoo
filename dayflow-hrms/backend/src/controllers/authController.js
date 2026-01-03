// Simple auth controller with console logs
const authController = {
  register: (req, res) => {
    console.log('✅ Register function called');
    res.json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: 1,
        email: req.body.email,
        name: req.body.name
      }
    });
  },

  login: (req, res) => {
    console.log('✅ Login function called');
    res.json({
      success: true,
      message: 'Login successful',
      token: 'jwt_token_123',
      user: {
        id: 1,
        email: req.body.email,
        role: 'admin'
      }
    });
  },

  getProfile: (req, res) => {
    console.log('✅ Get profile function called');
    res.json({
      success: true,
      user: {
        id: 1,
        name: 'Test User',
        email: 'test@example.com'
      }
    });
  }
};

// Export properly
module.exports = authController;
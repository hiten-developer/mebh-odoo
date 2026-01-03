const User = require('../models/User');
const { generateToken } = require('../utils/helpers');
const { validateEmail, validatePassword, validateEmployeeId, validateName } = require('../utils/validators');
const { ROLES } = require('../config/constants');

// Register new user
exports.register = async (req, res) => {
  try {
    const { employeeId, email, password, role, firstName, lastName, phone } = req.body;

    // Validation
    if (!validateEmployeeId(employeeId)) {
      return res.status(400).json({ success: false, message: 'Valid employee ID is required' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ success: false, message: 'Valid email is required' });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long' });
    }

    if (!validateName(firstName)) {
      return res.status(400).json({ success: false, message: 'Valid first name is required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { employeeId }] });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: existingUser.email === email ? 'Email already registered' : 'Employee ID already exists' 
      });
    }

    // Create new user
    const user = new User({
      employeeId,
      email,
      password,
      role: role || ROLES.EMPLOYEE,
      personalDetails: {
        firstName,
        lastName,
        phone
      }
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        token,
        user: {
          id: user._id,
          employeeId: user.employeeId,
          email: user.email,
          role: user.role,
          name: user.fullName,
          profilePicture: user.personalDetails.profilePicture
        }
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Registration failed' 
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Account is deactivated' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user._id);

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          employeeId: user.employeeId,
          email: user.email,
          role: user.role,
          name: user.fullName,
          profilePicture: user.personalDetails.profilePicture
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Login failed' 
    });
  }
};

// Get current user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('jobDetails.department', 'name');

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to get profile' 
    });
  }
};

// Update profile
exports.updateProfile = async (req, res) => {
  try {
    const { address, phone, profilePicture } = req.body;
    const updates = {};
    
    if (address !== undefined) updates['personalDetails.address'] = address;
    if (phone !== undefined) updates['personalDetails.phone'] = phone;
    if (profilePicture !== undefined) updates['personalDetails.profilePicture'] = profilePicture;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to update profile' 
    });
  }
};

// Logout (client-side token removal)
exports.logout = async (req, res) => {
  try {
    // In a stateless JWT system, logout is handled client-side by removing the token
    // But we can record logout time if needed
    await User.findByIdAndUpdate(req.user._id, { 
      lastLogin: new Date() 
    });

    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Logout failed' 
    });
  }
};
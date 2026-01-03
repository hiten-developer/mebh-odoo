const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { ROLES } = require('../config/constants');

const UserSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: [true, 'Employee ID is required'],
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long']
  },
  role: {
    type: String,
    enum: [ROLES.EMPLOYEE, ROLES.ADMIN, ROLES.HR],
    default: ROLES.EMPLOYEE
  },
  personalDetails: {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true
    },
    lastName: {
      type: String,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    address: {
      type: String,
      trim: true
    },
    profilePicture: {
      type: String,
      default: ''
    },
    dateOfBirth: {
      type: Date
    }
  },
  jobDetails: {
    department: {
      type: String,
      trim: true
    },
    designation: {
      type: String,
      trim: true
    },
    dateOfJoining: {
      type: Date,
      default: Date.now
    },
    employmentType: {
      type: String,
      enum: ['full-time', 'part-time', 'contract', 'intern'],
      default: 'full-time'
    }
  },
  salary: {
    basic: {
      type: Number,
      default: 0
    },
    allowances: {
      type: Number,
      default: 0
    },
    deductions: {
      type: Number,
      default: 0
    },
    netSalary: {
      type: Number,
      default: 0
    }
  },
  documents: [{
    name: String,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Virtual for full name
UserSchema.virtual('fullName').get(function() {
  return `${this.personalDetails.firstName} ${this.personalDetails.lastName || ''}`.trim();
});

module.exports = mongoose.model('User', UserSchema);
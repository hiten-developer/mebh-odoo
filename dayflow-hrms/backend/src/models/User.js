const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    // Authentication Fields
    employeeId: {
        type: String,
        required: [true, 'Employee ID is required'],
        unique: true,
        trim: true,
        uppercase: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters']
    },
    
    // Role Management
    role: {
        type: String,
        enum: ['employee', 'admin', 'hr'],
        default: 'employee'
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    
    // Personal Details
    personalDetails: {
        firstName: {
            type: String,
            required: [true, 'First name is required'],
            trim: true
        },
        lastName: {
            type: String,
            required: [true, 'Last name is required'],
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
            default: 'default-avatar.png'
        },
        dateOfBirth: {
            type: Date
        }
    },
    
    // Job Details
    jobDetails: {
        department: {
            type: String,
            trim: true
        },
        position: {
            type: String,
            trim: true
        },
        joiningDate: {
            type: Date,
            default: Date.now
        },
        salary: {
            type: Number,
            min: 0
        },
        employmentType: {
            type: String,
            enum: ['full-time', 'part-time', 'contract', 'intern'],
            default: 'full-time'
        }
    },
    
    // Leave Balance (Annual)
    leaveBalance: {
        paidLeave: {
            type: Number,
            default: 12,
            min: 0
        },
        sickLeave: {
            type: Number,
            default: 6,
            min: 0
        },
        unpaidLeave: {
            type: Number,
            default: 0,
            min: 0
        }
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
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
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON response
userSchema.methods.toJSON = function() {
    const user = this.toObject();
    delete user.password;
    delete user.__v;
    return user;
};

module.exports = mongoose.model('User', userSchema);
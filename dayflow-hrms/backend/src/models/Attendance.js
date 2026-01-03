const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    employeeId: {
        type: String,
        required: true
    },
    employeeName: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    checkIn: {
        type: String,
        default: null
    },
    checkOut: {
        type: String,
        default: null
    },
    status: {
        type: String,
        enum: ['present', 'absent', 'half-day', 'leave'],
        default: 'absent'
    },
    totalHours: {
        type: Number,
        default: 0
    },
    remarks: {
        type: String,
        default: ''
    },
    ipAddress: {
        type: String
    },
    location: {
        type: String
    }
}, {
    timestamps: true
});

// Create compound index for user and date
attendanceSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
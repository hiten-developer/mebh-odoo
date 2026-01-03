const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
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
    leaveType: {
        type: String,
        enum: ['paid', 'sick', 'unpaid'],
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    totalDays: {
        type: Number,
        required: true,
        min: 1
    },
    reason: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    comments: {
        type: String,
        default: ''
    },
    appliedDate: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Leave', leaveSchema);
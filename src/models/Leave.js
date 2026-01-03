const mongoose = require('mongoose');
const { LEAVE_TYPES, LEAVE_STATUS } = require('../config/constants');

const LeaveSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  leaveType: {
    type: String,
    enum: Object.values(LEAVE_TYPES),
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
  days: {
    type: Number,
    required: true,
    min: [0.5, 'Minimum leave is 0.5 day']
  },
  reason: {
    type: String,
    trim: true,
    required: [true, 'Reason is required']
  },
  status: {
    type: String,
    enum: Object.values(LEAVE_STATUS),
    default: LEAVE_STATUS.PENDING
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: {
    type: Date
  },
  rejectionReason: {
    type: String,
    trim: true
  },
  isHalfDay: {
    type: Boolean,
    default: false
  },
  halfDayType: {
    type: String,
    enum: ['first-half', 'second-half']
  }
}, {
  timestamps: true
});

// Index for faster queries
LeaveSchema.index({ employee: 1, startDate: -1 });
LeaveSchema.index({ status: 1 });

module.exports = mongoose.model('Leave', LeaveSchema);
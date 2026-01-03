const mongoose = require('mongoose');
const { ATTENDANCE_STATUS } = require('../config/constants');

const AttendanceSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  checkIn: {
    type: Date
  },
  checkOut: {
    type: Date
  },
  status: {
    type: String,
    enum: Object.values(ATTENDANCE_STATUS),
    default: ATTENDANCE_STATUS.ABSENT
  },
  hoursWorked: {
    type: Number,
    default: 0
  },
  notes: {
    type: String,
    trim: true
  },
  isHalfDay: {
    type: Boolean,
    default: false
  },
  halfDayType: {
    type: String,
    enum: ['first-half', 'second-half'],
    default: 'first-half'
  }
}, {
  timestamps: true
});

// Compound index to ensure one attendance record per employee per day
AttendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

// Virtual for calculating hours worked
AttendanceSchema.virtual('calculatedHours').get(function() {
  if (this.checkIn && this.checkOut) {
    const diffMs = this.checkOut - this.checkIn;
    const diffHrs = diffMs / (1000 * 60 * 60);
    return Math.round(diffHrs * 100) / 100; // Round to 2 decimal places
  }
  return 0;
});

module.exports = mongoose.model('Attendance', AttendanceSchema);
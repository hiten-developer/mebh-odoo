const mongoose = require('mongoose');

const PayrollSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  month: {
    type: Number,
    required: true,
    min: 1,
    max: 12
  },
  year: {
    type: Number,
    required: true
  },
  basicSalary: {
    type: Number,
    required: true,
    min: 0
  },
  allowances: [{
    name: String,
    amount: {
      type: Number,
      min: 0
    }
  }],
  deductions: [{
    name: String,
    amount: {
      type: Number,
      min: 0
    }
  }],
  totalAllowances: {
    type: Number,
    default: 0
  },
  totalDeductions: {
    type: Number,
    default: 0
  },
  netSalary: {
    type: Number,
    required: true,
    min: 0
  },
  paymentDate: {
    type: Date
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['bank-transfer', 'cash', 'cheque'],
    default: 'bank-transfer'
  },
  bankDetails: {
    accountNumber: String,
    bankName: String,
    ifscCode: String
  },
  remarks: {
    type: String,
    trim: true
  },
  generatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Compound index to ensure one payroll per employee per month/year
PayrollSchema.index({ employee: 1, month: 1, year: 1 }, { unique: true });

// Calculate totals before saving
PayrollSchema.pre('save', function(next) {
  this.totalAllowances = this.allowances.reduce((sum, allowance) => sum + allowance.amount, 0);
  this.totalDeductions = this.deductions.reduce((sum, deduction) => sum + deduction.amount, 0);
  next();
});

module.exports = mongoose.model('Payroll', PayrollSchema);
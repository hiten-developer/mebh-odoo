const jwt = require('jsonwebtoken');
const { JWT_EXPIRY } = require('../config/constants');

const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: JWT_EXPIRY }
  );
};

const calculateWorkingDays = (startDate, endDate, excludeWeekends = true) => {
  let count = 0;
  const current = new Date(startDate);
  const end = new Date(endDate);
  
  while (current <= end) {
    const dayOfWeek = current.getDay();
    if (!excludeWeekends || (dayOfWeek !== 0 && dayOfWeek !== 6)) {
      count++;
    }
    current.setDate(current.getDate() + 1);
  }
  
  return count;
};

const formatDate = (date) => {
  return new Date(date).toISOString().split('T')[0];
};

const getCurrentMonthYear = () => {
  const now = new Date();
  return {
    month: now.getMonth() + 1,
    year: now.getFullYear()
  };
};

const generateEmployeeId = () => {
  const prefix = 'EMP';
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `${prefix}${randomNum}`;
};

const calculateNetSalary = (basic, allowances, deductions) => {
  const totalAllowances = allowances.reduce((sum, a) => sum + a.amount, 0);
  const totalDeductions = deductions.reduce((sum, d) => sum + d.amount, 0);
  return basic + totalAllowances - totalDeductions;
};

module.exports = {
  generateToken,
  calculateWorkingDays,
  formatDate,
  getCurrentMonthYear,
  generateEmployeeId,
  calculateNetSalary
};
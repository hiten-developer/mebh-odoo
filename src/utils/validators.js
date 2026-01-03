const validator = require('validator');

const validateEmail = (email) => {
  return validator.isEmail(email);
};

const validatePassword = (password) => {
  return password.length >= 8;
};

const validateEmployeeId = (employeeId) => {
  return employeeId && employeeId.trim().length > 0;
};

const validateName = (name) => {
  return name && name.trim().length >= 2;
};

const validatePhone = (phone) => {
  return validator.isMobilePhone(phone, 'any', { strictMode: false });
};

const validateDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return false;
  const start = new Date(startDate);
  const end = new Date(endDate);
  return start <= end;
};

module.exports = {
  validateEmail,
  validatePassword,
  validateEmployeeId,
  validateName,
  validatePhone,
  validateDateRange
};
module.exports = {
  ROLES: {
    EMPLOYEE: 'employee',
    ADMIN: 'admin',
    HR: 'hr'
  },
  
  ATTENDANCE_STATUS: {
    PRESENT: 'present',
    ABSENT: 'absent',
    HALF_DAY: 'half-day',
    LEAVE: 'leave'
  },
  
  LEAVE_TYPES: {
    PAID: 'paid',
    SICK: 'sick',
    UNPAID: 'unpaid'
  },
  
  LEAVE_STATUS: {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected'
  },
  
  PASSWORD_MIN_LENGTH: 8,
  JWT_EXPIRY: '7d'
};
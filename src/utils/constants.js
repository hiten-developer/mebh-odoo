export const ROLES = {
  ADMIN: 'admin',
  EMPLOYEE: 'employee',
  HR: 'hr'
};

export const LEAVE_TYPES = [
  { id: 1, name: 'Paid Leave', color: '#4CAF50' },
  { id: 2, name: 'Sick Leave', color: '#2196F3' },
  { id: 3, name: 'Unpaid Leave', color: '#FF9800' },
  { id: 4, name: 'Maternity Leave', color: '#9C27B0' },
  { id: 5, name: 'Paternity Leave', color: '#00BCD4' }
];

export const ATTENDANCE_STATUS = [
  { id: 1, status: 'Present', color: '#4CAF50', icon: '✓' },
  { id: 2, status: 'Absent', color: '#F44336', icon: '✗' },
  { id: 3, status: 'Half-day', color: '#FF9800', icon: '½' },
  { id: 4, status: 'Leave', color: '#2196F3', icon: 'L' }
];

// Static data for now
export const STATIC_USERS = [
  {
    id: 1,
    loginId: '01202300010001',
    email: 'admin@dayflow.com',
    password: 'admin123',
    role: ROLES.ADMIN,
    name: 'Admin User',
    company: 'Dayflow Solutions',
    phone: '9876543210',
    department: 'Administration',
    position: 'System Administrator'
  },
  {
    id: 2,
    loginId: '01202300020001',
    email: 'hr@dayflow.com',
    password: 'hr123456',
    role: ROLES.HR,
    name: 'HR Manager',
    company: 'Dayflow Solutions',
    phone: '9876543211',
    department: 'Human Resources',
    position: 'HR Manager'
  },
  {
    id: 3,
    loginId: '01202300030001',
    email: 'employee@dayflow.com',
    password: 'employee123',
    role: ROLES.EMPLOYEE,
    name: 'John Doe',
    company: 'Dayflow Solutions',
    phone: '9876543212',
    department: 'Engineering',
    position: 'Software Developer'
  }
];
// ===================== SETUP =====================
console.log('🔧 Starting Dayflow HRMS Backend...');

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const JWT_SECRET = 'dayflow_secret_2024_hackathon';

// ===================== DATABASE =====================
let users = [];
let attendance = [];
let leaves = [];

// ===================== HELPER FUNCTIONS =====================
function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// ===================== INITIAL DATA =====================
async function createInitialData() {
  try {
    // Admin user
    const adminHash = await bcrypt.hash('admin123', 10);
    users.push({
      id: 1,
      employeeId: 'EMP001',
      email: 'admin@dayflow.com',
      password: adminHash,
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      department: 'Management',
      position: 'CEO',
      salary: 100000,
      phone: '+91 9876543210',
      address: 'Mumbai',
      leaveBalance: { paid: 12, sick: 6, unpaid: 0 },
      joiningDate: '2024-01-01'
    });

    // HR user
    const hrHash = await bcrypt.hash('hr123', 10);
    users.push({
      id: 2,
      employeeId: 'EMP002',
      email: 'hr@dayflow.com',
      password: hrHash,
      firstName: 'HR',
      lastName: 'Manager',
      role: 'hr',
      department: 'Human Resources',
      position: 'HR Manager',
      salary: 75000,
      phone: '+91 9876543211',
      address: 'Delhi',
      leaveBalance: { paid: 12, sick: 6, unpaid: 0 },
      joiningDate: '2024-01-01'
    });

    // Employee user
    const empHash = await bcrypt.hash('emp123', 10);
    users.push({
      id: 3,
      employeeId: 'EMP003',
      email: 'employee@dayflow.com',
      password: empHash,
      firstName: 'John',
      lastName: 'Doe',
      role: 'employee',
      department: 'Engineering',
      position: 'Software Engineer',
      salary: 60000,
      phone: '+91 9876543212',
      address: 'Bangalore',
      leaveBalance: { paid: 12, sick: 6, unpaid: 0 },
      joiningDate: '2024-01-01'
    });

    console.log('✅ Initial users created');
    console.log('   👑 Admin: admin@dayflow.com / admin123');
    console.log('   👩‍💼 HR: hr@dayflow.com / hr123');
    console.log('   👨‍💻 Employee: employee@dayflow.com / emp123');
  } catch (error) {
    console.error('Error creating initial data:', error);
  }
}

// ===================== AUTH ROUTES =====================
app.post('/api/auth/register', async (req, res) => {
  try {
    const { employeeId, email, password, firstName, lastName, role, department } = req.body;
    
    if (!employeeId || !email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const existing = users.find(u => u.email === email || u.employeeId === employeeId);
    if (existing) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: users.length + 1,
      employeeId,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: role || 'employee',
      department: department || 'Engineering',
      position: 'Employee',
      salary: 30000,
      phone: '',
      address: '',
      leaveBalance: { paid: 12, sick: 6, unpaid: 0 },
      joiningDate: new Date().toISOString().split('T')[0]
    };
    
    users.push(newUser);
    
    const token = generateToken(newUser);
    const { password: _, ...userWithoutPassword } = newUser;
    
    res.status(201).json({
      success: true,
      message: 'User registered',
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = generateToken(user);
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/auth/profile', authenticate, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  const { password, ...userWithoutPassword } = user;
  res.json({ success: true, user: userWithoutPassword });
});

// ===================== USER ROUTES =====================
app.get('/api/users', authenticate, (req, res) => {
  if (!['admin', 'hr'].includes(req.user.role)) {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  const safeUsers = users.map(user => {
    const { password, ...safeUser } = user;
    return safeUser;
  });
  
  res.json({ success: true, users: safeUsers });
});

// ===================== ATTENDANCE ROUTES =====================
app.post('/api/attendance', authenticate, (req, res) => {
  const { date, status } = req.body;
  
  if (!date || !status) {
    return res.status(400).json({ error: 'Date and status required' });
  }
  
  const user = users.find(u => u.id === req.user.id);
  const newAttendance = {
    id: attendance.length + 1,
    userId: req.user.id,
    employeeId: user.employeeId,
    employeeName: `${user.firstName} ${user.lastName}`,
    date,
    status,
    createdAt: new Date()
  };
  
  attendance.push(newAttendance);
  res.status(201).json({ success: true, attendance: newAttendance });
});

app.get('/api/attendance/my', authenticate, (req, res) => {
  const userAttendance = attendance.filter(a => a.userId === req.user.id);
  res.json({ success: true, attendance: userAttendance });
});

// ===================== LEAVE ROUTES =====================
app.post('/api/leaves', authenticate, (req, res) => {
  const { leaveType, startDate, endDate, reason } = req.body;
  
  if (!leaveType || !startDate || !endDate) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  const user = users.find(u => u.id === req.user.id);
  const newLeave = {
    id: leaves.length + 1,
    userId: req.user.id,
    employeeId: user.employeeId,
    employeeName: `${user.firstName} ${user.lastName}`,
    leaveType,
    startDate,
    endDate,
    reason: reason || '',
    status: 'pending',
    appliedDate: new Date().toISOString().split('T')[0]
  };
  
  leaves.push(newLeave);
  res.status(201).json({ success: true, leave: newLeave });
});

app.get('/api/leaves/my', authenticate, (req, res) => {
  const userLeaves = leaves.filter(l => l.userId === req.user.id);
  res.json({ success: true, leaves: userLeaves });
});

// ===================== BASIC ROUTES =====================
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🚀 Dayflow HRMS API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      attendance: '/api/attendance',
      leaves: '/api/leaves'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: '✅ Healthy',
    service: 'Dayflow HRMS',
    uptime: process.uptime()
  });
});

// ===================== START SERVER =====================
async function startServer() {
  await createInitialData();
  
  app.listen(PORT, () => {
    console.log('='.repeat(60));
    console.log('🚀 DAYFLOW HRMS BACKEND - READY!');
    console.log('='.repeat(60));
    console.log(`📍 URL: http://localhost:${PORT}`);
    console.log(`📁 Users: ${users.length} (Admin, HR, Employee)`);
    console.log('📅', new Date().toLocaleString());
    console.log('\n📋 ENDPOINTS:');
    console.log('   POST /api/auth/register    - Register');
    console.log('   POST /api/auth/login       - Login');
    console.log('   GET  /api/auth/profile     - Profile');
    console.log('   GET  /api/users            - All users (Admin/HR)');
    console.log('   POST /api/attendance       - Mark attendance');
    console.log('   GET  /api/attendance/my    - My attendance');
    console.log('   POST /api/leaves           - Apply leave');
    console.log('   GET  /api/leaves/my        - My leaves');
    console.log('   GET  /                     - API info');
    console.log('   GET  /health               - Health check');
    console.log('='.repeat(60));
    console.log('✅ SERVER IS RUNNING - NO ERRORS!');
    console.log('='.repeat(60));
  });
}

startServer();
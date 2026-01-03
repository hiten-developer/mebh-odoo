const mongoose = require('mongoose');
const User = require('../models/User');
const { ROLES } = require('../config/constants');

require('dotenv').config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB for seeding');

    // Clear existing data (optional)
    await User.deleteMany({});
    console.log('🗑️  Cleared existing users');

    // Create admin user
    const admin = new User({
      employeeId: 'ADMIN001',
      email: 'admin@dayflow.com',
      password: 'Admin@123',
      role: ROLES.ADMIN,
      personalDetails: {
        firstName: 'System',
        lastName: 'Admin',
        phone: '+919876543210'
      },
      jobDetails: {
        department: 'Administration',
        designation: 'System Administrator'
      }
    });

    await admin.save();
    console.log('👑 Admin user created');

    // Create HR user
    const hr = new User({
      employeeId: 'HR001',
      email: 'hr@dayflow.com',
      password: 'Hr@123456',
      role: ROLES.HR,
      personalDetails: {
        firstName: 'HR',
        lastName: 'Manager',
        phone: '+919876543211'
      },
      jobDetails: {
        department: 'Human Resources',
        designation: 'HR Manager'
      }
    });

    await hr.save();
    console.log('👔 HR user created');

    // Create sample employee
    const employee = new User({
      employeeId: 'EMP001',
      email: 'employee@dayflow.com',
      password: 'Employee@123',
      role: ROLES.EMPLOYEE,
      personalDetails: {
        firstName: 'John',
        lastName: 'Doe',
        phone: '+919876543212',
        address: '123 Main Street, Mumbai'
      },
      jobDetails: {
        department: 'Engineering',
        designation: 'Software Developer',
        dateOfJoining: new Date('2023-01-15')
      },
      salary: {
        basic: 50000,
        allowances: 10000,
        deductions: 5000,
        netSalary: 55000
      }
    });

    await employee.save();
    console.log('👤 Sample employee created');

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('   Admin:    admin@dayflow.com / Admin@123');
    console.log('   HR:       hr@dayflow.com / Hr@123456');
    console.log('   Employee: employee@dayflow.com / Employee@123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
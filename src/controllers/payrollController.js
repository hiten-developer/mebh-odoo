const Payroll = require('../models/Payroll');
const User = require('../models/User');
const { calculateNetSalary } = require('../utils/helpers');

// Employee: Get own payroll
exports.getMyPayroll = async (req, res) => {
  try {
    const employeeId = req.user._id;
    const { month, year, page = 1, limit = 12 } = req.query;

    let query = { employee: employeeId };

    // Filter by month and year
    if (month && year) {
      query.month = parseInt(month);
      query.year = parseInt(year);
    }

    const payroll = await Payroll.find(query)
      .populate('generatedBy', 'employeeId personalDetails.firstName personalDetails.lastName')
      .sort({ year: -1, month: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Payroll.countDocuments(query);

    res.json({
      success: true,
      data: payroll,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get my payroll error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to get payroll' 
    });
  }
};

// Admin: Get all payroll records
exports.getAllPayroll = async (req, res) => {
  try {
    const { month, year, employeeId, department, page = 1, limit = 20 } = req.query;

    let query = {};

    // Filter by month and year
    if (month && year) {
      query.month = parseInt(month);
      query.year = parseInt(year);
    }

    // Filter by employee
    if (employeeId) {
      const employee = await User.findOne({ employeeId });
      if (employee) {
        query.employee = employee._id;
      }
    }

    // Filter by department
    if (department) {
      const employeesInDept = await User.find({ 
        'jobDetails.department': department,
        role: 'employee'
      }).select('_id');
      
      query.employee = { $in: employeesInDept.map(e => e._id) };
    }

    const payroll = await Payroll.find(query)
      .populate('employee', 'employeeId personalDetails.firstName personalDetails.lastName jobDetails.department jobDetails.designation')
      .populate('generatedBy', 'employeeId personalDetails.firstName personalDetails.lastName')
      .sort({ year: -1, month: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Payroll.countDocuments(query);

    // Calculate totals
    let totalBasic = 0;
    let totalAllowances = 0;
    let totalDeductions = 0;
    let totalNetSalary = 0;

    payroll.forEach(p => {
      totalBasic += p.basicSalary;
      totalAllowances += p.totalAllowances;
      totalDeductions += p.totalDeductions;
      totalNetSalary += p.netSalary;
    });

    res.json({
      success: true,
      data: payroll,
      totals: {
        totalBasic,
        totalAllowances,
        totalDeductions,
        totalNetSalary
      },
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get all payroll error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to get payroll records' 
    });
  }
};

// Admin: Generate payroll for employee
exports.generatePayroll = async (req, res) => {
  try {
    const { employeeId, month, year, basicSalary, allowances, deductions, paymentDate, remarks } = req.body;
    const generatedBy = req.user._id;

    // Validation
    if (!employeeId || !month || !year || !basicSalary) {
      return res.status(400).json({ 
        success: false, 
        message: 'Employee ID, month, year, and basic salary are required' 
      });
    }

    // Check if employee exists
    const employee = await User.findOne({ employeeId, role: 'employee' });
    if (!employee) {
      return res.status(404).json({ 
        success: false, 
        message: 'Employee not found' 
      });
    }

    // Check if payroll already exists for this month/year
    const existingPayroll = await Payroll.findOne({
      employee: employee._id,
      month: parseInt(month),
      year: parseInt(year)
    });

    if (existingPayroll) {
      return res.status(400).json({ 
        success: false, 
        message: 'Payroll already generated for this employee for the selected month' 
      });
    }

    // Calculate net salary
    const netSalary = calculateNetSalary(basicSalary, allowances || [], deductions || []);

    // Create payroll
    const payroll = new Payroll({
      employee: employee._id,
      month: parseInt(month),
      year: parseInt(year),
      basicSalary,
      allowances: allowances || [],
      deductions: deductions || [],
      netSalary,
      paymentDate: paymentDate ? new Date(paymentDate) : null,
      remarks,
      generatedBy,
      paymentStatus: 'pending'
    });

    await payroll.save();

    // Update employee's salary structure if needed
    if (!employee.salary || employee.salary.basic !== basicSalary) {
      employee.salary = {
        basic: basicSalary,
        allowances: allowances ? allowances.reduce((sum, a) => sum + a.amount, 0) : 0,
        deductions: deductions ? deductions.reduce((sum, d) => sum + d.amount, 0) : 0,
        netSalary
      };
      await employee.save();
    }

    // Populate data
    await payroll.populate('employee', 'employeeId personalDetails.firstName personalDetails.lastName');
    await payroll.populate('generatedBy', 'employeeId personalDetails.firstName personalDetails.lastName');

    res.status(201).json({
      success: true,
      message: 'Payroll generated successfully',
      data: payroll
    });
  } catch (error) {
    console.error('Generate payroll error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to generate payroll' 
    });
  }
};

// Admin: Update payroll
exports.updatePayroll = async (req, res) => {
  try {
    const payrollId = req.params.id;
    const updates = req.body;

    // Remove immutable fields
    delete updates.employee;
    delete updates.month;
    delete updates.year;

    const payroll = await Payroll.findByIdAndUpdate(
      payrollId,
      { $set: updates },
      { new: true, runValidators: true }
    )
      .populate('employee', 'employeeId personalDetails.firstName personalDetails.lastName')
      .populate('generatedBy', 'employeeId personalDetails.firstName personalDetails.lastName');

    if (!payroll) {
      return res.status(404).json({ 
        success: false, 
        message: 'Payroll record not found' 
      });
    }

    res.json({
      success: true,
      message: 'Payroll updated successfully',
      data: payroll
    });
  } catch (error) {
    console.error('Update payroll error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to update payroll' 
    });
  }
};

// Admin: Delete payroll
exports.deletePayroll = async (req, res) => {
  try {
    const payrollId = req.params.id;

    const payroll = await Payroll.findByIdAndDelete(payrollId);

    if (!payroll) {
      return res.status(404).json({ 
        success: false, 
        message: 'Payroll record not found' 
      });
    }

    res.json({
      success: true,
      message: 'Payroll deleted successfully'
    });
  } catch (error) {
    console.error('Delete payroll error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to delete payroll' 
    });
  }
};
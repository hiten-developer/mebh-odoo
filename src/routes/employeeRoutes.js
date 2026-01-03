const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { ROLES } = require('../config/constants');

// All routes require authentication
router.use(authMiddleware);

// Dashboard stats (for both admin and employee)
router.get('/dashboard/stats', employeeController.getDashboardStats);

// Employee routes (for employee only)
router.get('/my-profile', employeeController.getEmployeeById); // Using same controller but for self

// Admin/HR only routes
router.get(
  '/',
  roleMiddleware(ROLES.ADMIN, ROLES.HR),
  employeeController.getAllEmployees
);

router.get(
  '/:id',
  roleMiddleware(ROLES.ADMIN, ROLES.HR),
  employeeController.getEmployeeById
);

router.put(
  '/:id',
  roleMiddleware(ROLES.ADMIN, ROLES.HR),
  employeeController.updateEmployee
);

router.delete(
  '/:id',
  roleMiddleware(ROLES.ADMIN, ROLES.HR),
  employeeController.deleteEmployee
);

module.exports = router;
const express = require('express');
const router = express.Router();
const payrollController = require('../controllers/payrollController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { ROLES } = require('../config/constants');

// All routes require authentication
router.use(authMiddleware);

// Employee routes
router.get('/my-payroll', payrollController.getMyPayroll);

// Admin/HR routes
router.get(
  '/',
  roleMiddleware(ROLES.ADMIN, ROLES.HR),
  payrollController.getAllPayroll
);

router.post(
  '/generate',
  roleMiddleware(ROLES.ADMIN, ROLES.HR),
  payrollController.generatePayroll
);

router.put(
  '/:id',
  roleMiddleware(ROLES.ADMIN, ROLES.HR),
  payrollController.updatePayroll
);

router.delete(
  '/:id',
  roleMiddleware(ROLES.ADMIN, ROLES.HR),
  payrollController.deletePayroll
);

module.exports = router;
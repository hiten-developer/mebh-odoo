const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate, authorize } = require('../middleware/auth');

// Admin/HR routes
router.get('/', authenticate, authorize('admin', 'hr'), userController.getAllUsers);
router.get('/stats', authenticate, authorize('admin', 'hr'), userController.getUserStats);
router.get('/:id', authenticate, userController.getUserById);
router.put('/:id', authenticate, authorize('admin', 'hr'), userController.updateUser);
router.delete('/:id', authenticate, authorize('admin'), userController.deleteUser);

module.exports = router;
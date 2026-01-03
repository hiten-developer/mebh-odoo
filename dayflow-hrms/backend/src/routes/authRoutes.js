const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Debug log
console.log('✅ authController loaded:', typeof authController);
console.log('✅ authController.register:', typeof authController.register);

// Routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/profile', authController.getProfile);

module.exports = router;
const express = require('express');
const router = express.Router();
const { register, login, refreshToken, logout, getProfile } = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshToken);
router.post('/logout', logout);

// Protected route
router.get('/me', authenticate, getProfile);

module.exports = router;

const express = require('express');
const { signup, login, updateProfile, updatePassword } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);

// Protected routes
router.put('/profile', protect, updateProfile);
router.put('/password', protect, updatePassword);

module.exports = router;

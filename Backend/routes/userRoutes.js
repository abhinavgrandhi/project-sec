const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  googleLogin,
  updateUserSteps, // Add this import
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
// @route   PUT /api/users/update-steps
router.put('/update-steps', protect, updateUserSteps); // New route for updating steps

// @route   POST /api/users/register
router.post('/register', registerUser);

// @route   POST /api/users/login
router.post('/login', loginUser);

// @route   POST /api/users/google-login
router.post('/google-login', googleLogin);

// @route   GET /api/users/profile
router.get('/profile', protect, getUserProfile);

// @route   PUT /api/users/profile
router.put('/profile', protect, updateUserProfile);

// @route   PUT /api/users/steps   // New route for updating user steps
router.put('/steps', protect, updateUserSteps);

module.exports = router;

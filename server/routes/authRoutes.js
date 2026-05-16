const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const {
  registerSchema,
  loginSchema,
  settingsSchema,
  reflectionSchema,
} = require('../utils/validators');
const {
  register,
  login,
  refreshToken,
  logout,
  getMe,
  updateProfile,
  updateSettings,
  saveReflection,
} = require('../controllers/authController');

router.post('/register', validate(registerSchema), asyncHandler(register));
router.post('/login', validate(loginSchema), asyncHandler(login));
router.post('/refresh', asyncHandler(refreshToken));
router.post('/logout', asyncHandler(logout));
router.get('/me', protect, asyncHandler(getMe));
router.put('/profile', protect, asyncHandler(updateProfile));
router.put('/settings', protect, validate(settingsSchema), asyncHandler(updateSettings));
router.post('/reflection', protect, validate(reflectionSchema), asyncHandler(saveReflection));

module.exports = router;

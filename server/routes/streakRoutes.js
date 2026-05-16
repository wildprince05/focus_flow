const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const { protect } = require('../middleware/auth');
const { getStreak } = require('../controllers/streakController');

router.use(protect);
router.get('/', asyncHandler(getStreak));

module.exports = router;

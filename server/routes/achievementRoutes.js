const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const { protect } = require('../middleware/auth');
const { getAchievements } = require('../controllers/achievementController');

router.use(protect);
router.get('/', asyncHandler(getAchievements));

module.exports = router;

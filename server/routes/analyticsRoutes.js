const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const { protect } = require('../middleware/auth');
const { getDashboard } = require('../controllers/analyticsController');

router.use(protect);
router.get('/dashboard', asyncHandler(getDashboard));

module.exports = router;

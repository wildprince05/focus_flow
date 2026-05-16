const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const { sessionSchema } = require('../utils/validators');
const { completeSession, getSessions, getQuote } = require('../controllers/sessionController');

router.use(protect);
router.post('/complete', validate(sessionSchema), asyncHandler(completeSession));
router.get('/', asyncHandler(getSessions));
router.get('/quote', asyncHandler(getQuote));

module.exports = router;

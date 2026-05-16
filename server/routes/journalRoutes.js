const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const { journalSchema } = require('../utils/validators');
const { getEntries, createEntry } = require('../controllers/journalController');

router.use(protect);
router.get('/', asyncHandler(getEntries));
router.post('/', validate(journalSchema), asyncHandler(createEntry));

module.exports = router;

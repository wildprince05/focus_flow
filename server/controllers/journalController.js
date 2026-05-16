const JournalEntry = require('../models/JournalEntry');
const { toDateKey } = require('../services/streakService');

const getEntries = async (req, res) => {
  const entries = await JournalEntry.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .limit(30);
  res.json({ success: true, entries });
};

const createEntry = async (req, res) => {
  const entry = await JournalEntry.create({
    ...req.body,
    user: req.user._id,
    date: toDateKey(),
  });
  res.status(201).json({ success: true, entry });
};

module.exports = { getEntries, createEntry };

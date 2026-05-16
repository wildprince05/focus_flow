const Streak = require('../models/Streak');

const getStreak = async (req, res) => {
  let streak = await Streak.findOne({ user: req.user._id });
  if (!streak) {
    streak = await Streak.create({ user: req.user._id });
  }
  res.json({ success: true, streak });
};

module.exports = { getStreak };

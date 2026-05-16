const Achievement = require('../models/Achievement');

const getAchievements = async (req, res) => {
  const achievements = await Achievement.find({ user: req.user._id }).sort({ unlockedAt: -1 });
  res.json({ success: true, achievements });
};

module.exports = { getAchievements };

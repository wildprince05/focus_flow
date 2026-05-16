const Achievement = require('../models/Achievement');
const Streak = require('../models/Streak');
const User = require('../models/User');

const BADGES = {
  first_session: {
    title: 'First Session',
    description: 'Completed your first Pomodoro',
    check: (user, streak) => user.totalSessions >= 1,
  },
  seven_day_streak: {
    title: '7 Day Streak',
    description: 'Maintained focus for 7 consecutive days',
    check: (_, streak) => streak.currentStreak >= 7 || streak.longestStreak >= 7,
  },
  hundred_sessions: {
    title: '100 Sessions',
    description: 'Completed 100 Pomodoro sessions',
    check: (user) => user.totalSessions >= 100,
  },
  deep_focus_master: {
    title: 'Deep Focus Master',
    description: 'Logged 50+ hours of focused work',
    check: (user) => user.totalFocusMinutes >= 3000,
  },
};

const checkAndUnlockAchievements = async (userId) => {
  const user = await User.findById(userId);
  const streak = await Streak.findOne({ user: userId });
  const unlocked = [];

  for (const [badgeId, badge] of Object.entries(BADGES)) {
    const exists = await Achievement.findOne({ user: userId, badgeId });
    if (!exists && badge.check(user, streak || {})) {
      const achievement = await Achievement.create({
        user: userId,
        badgeId,
        title: badge.title,
        description: badge.description,
      });
      unlocked.push(achievement);
    }
  }

  return unlocked;
};

module.exports = { checkAndUnlockAchievements, BADGES };

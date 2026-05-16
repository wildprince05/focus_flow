const Streak = require('../models/Streak');

const toDateKey = (date = new Date()) => date.toISOString().split('T')[0];

const getYesterdayKey = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return toDateKey(d);
};

const updateStreakOnSession = async (userId, focusMinutes = 25) => {
  let streak = await Streak.findOne({ user: userId });
  if (!streak) {
    streak = await Streak.create({ user: userId });
  }

  const today = toDateKey();
  const yesterday = getYesterdayKey();
  const lastActive = streak.lastActiveDate ? toDateKey(streak.lastActiveDate) : null;

  streak.totalSessions += 1;

  let logEntry = streak.activityLog.find((l) => l.date === today);
  if (!logEntry) {
    logEntry = { date: today, sessions: 0, focusMinutes: 0 };
    streak.activityLog.push(logEntry);
  }
  logEntry.sessions += 1;
  logEntry.focusMinutes += focusMinutes;

  const isFirstSessionToday = logEntry.sessions === 1;

  if (isFirstSessionToday) {
    if (!lastActive) {
      streak.currentStreak = 1;
    } else if (lastActive === today) {
      // already counted today
    } else if (lastActive === yesterday) {
      streak.currentStreak += 1;
    } else {
      const daysMissed = Math.floor(
        (new Date(today) - new Date(lastActive)) / (1000 * 60 * 60 * 24)
      ) - 1;

      if (daysMissed === 1 && streak.streakFreezes > 0) {
        streak.streakFreezes -= 1;
        streak.freezesUsed += 1;
        streak.currentStreak += 1;
      } else if (daysMissed > 0) {
        streak.currentStreak = 1;
      }
    }

    streak.lastActiveDate = new Date();
    streak.activeDaysCount += 1;

    if (streak.activeDaysCount % 7 === 0) {
      streak.streakFreezes += 1;
    }
  }

  if (streak.currentStreak > streak.longestStreak) {
    streak.longestStreak = streak.currentStreak;
  }

  if (streak.activityLog.length > 365) {
    streak.activityLog = streak.activityLog.slice(-365);
  }

  await streak.save();
  return streak;
};

module.exports = { updateStreakOnSession, toDateKey };

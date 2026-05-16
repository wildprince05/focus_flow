const PomodoroSession = require('../models/PomodoroSession');
const Streak = require('../models/Streak');
const User = require('../models/User');

const toDateKey = (d) => d.toISOString().split('T')[0];

const getDashboard = async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId);
  const streak = await Streak.findOne({ user: userId });

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todaySessions = await PomodoroSession.find({
    user: userId,
    type: 'focus',
    completedAt: { $gte: todayStart },
  });

  const todayFocusMinutes = todaySessions.reduce((sum, s) => sum + s.duration, 0);

  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 6);
  weekStart.setHours(0, 0, 0, 0);

  const weekSessions = await PomodoroSession.find({
    user: userId,
    type: 'focus',
    completedAt: { $gte: weekStart },
  });

  const weeklyData = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = toDateKey(d);
    const daySessions = weekSessions.filter((s) => toDateKey(s.completedAt) === key);
    weeklyData.push({
      date: key,
      label: d.toLocaleDateString('en-US', { weekday: 'short' }),
      sessions: daySessions.length,
      focusMinutes: daySessions.reduce((sum, s) => sum + s.duration, 0),
    });
  }

  const heatmap = (streak?.activityLog || [])
    .slice(-90)
    .map((entry) => ({
      date: entry.date,
      sessions: entry.sessions,
      focusMinutes: entry.focusMinutes,
    }));

  res.json({
    success: true,
    dashboard: {
      user: {
        name: user.name,
        xp: user.xp,
        level: user.level,
        totalSessions: user.totalSessions,
        totalFocusMinutes: user.totalFocusMinutes,
      },
      streak: {
        current: streak?.currentStreak || 0,
        longest: streak?.longestStreak || 0,
        totalSessions: streak?.totalSessions || 0,
        streakFreezes: streak?.streakFreezes || 0,
      },
      today: {
        sessions: todaySessions.length,
        focusMinutes: todayFocusMinutes,
        focusHours: (todayFocusMinutes / 60).toFixed(1),
      },
      weeklyData,
      heatmap,
    },
  });
};

module.exports = { getDashboard };

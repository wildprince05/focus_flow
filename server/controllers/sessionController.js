const PomodoroSession = require('../models/PomodoroSession');
const Task = require('../models/Task');
const User = require('../models/User');
const { updateStreakOnSession } = require('../services/streakService');
const { checkAndUnlockAchievements } = require('../services/achievementService');
const { getRandomQuote } = require('../utils/quotes');

const completeSession = async (req, res) => {
  const { type, duration, taskId, notes } = req.body;
  const userId = req.user._id;

  const session = await PomodoroSession.create({
    user: userId,
    task: taskId || undefined,
    type,
    duration,
    notes: notes || '',
  });

  let xpEarned = 0;
  if (type === 'focus') {
    xpEarned = Math.round(duration * 2);
    const user = await User.findById(userId);
    user.totalSessions += 1;
    user.totalFocusMinutes += duration;
    user.xp += xpEarned;
    user.level = user.getLevelFromXp();
    await user.save();

    if (taskId) {
      await Task.findByIdAndUpdate(taskId, { $inc: { pomodorosCompleted: 1 } });
    }

    await updateStreakOnSession(userId, duration);
  }

  const newAchievements = await checkAndUnlockAchievements(userId);
  const quote = getRandomQuote();

  res.status(201).json({
    success: true,
    session,
    xpEarned,
    quote,
    newAchievements,
  });
};

const getSessions = async (req, res) => {
  const { limit = 50, days } = req.query;
  const filter = { user: req.user._id };
  if (days) {
    const since = new Date();
    since.setDate(since.getDate() - parseInt(days, 10));
    filter.completedAt = { $gte: since };
  }

  const sessions = await PomodoroSession.find(filter)
    .populate('task', 'title')
    .sort({ completedAt: -1 })
    .limit(parseInt(limit, 10));

  res.json({ success: true, sessions });
};

const getQuote = async (req, res) => {
  res.json({ success: true, quote: getRandomQuote() });
};

module.exports = { completeSession, getSessions, getQuote };

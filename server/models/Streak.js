const mongoose = require('mongoose');

const streakSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastActiveDate: { type: Date },
    totalSessions: { type: Number, default: 0 },
    activeDaysCount: { type: Number, default: 0 },
    streakFreezes: { type: Number, default: 0 },
    freezesUsed: { type: Number, default: 0 },
    activityLog: [
      {
        date: { type: String },
        sessions: { type: Number, default: 0 },
        focusMinutes: { type: Number, default: 0 },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Streak', streakSchema);

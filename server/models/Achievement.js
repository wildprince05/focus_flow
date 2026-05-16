const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    badgeId: {
      type: String,
      enum: ['first_session', 'seven_day_streak', 'hundred_sessions', 'deep_focus_master'],
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    unlockedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

achievementSchema.index({ user: 1, badgeId: 1 }, { unique: true });

module.exports = mongoose.model('Achievement', achievementSchema);

const mongoose = require('mongoose');

const pomodoroSessionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
    type: { type: String, enum: ['focus', 'shortBreak', 'longBreak'], default: 'focus' },
    duration: { type: Number, required: true },
    completedAt: { type: Date, default: Date.now },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

pomodoroSessionSchema.index({ user: 1, completedAt: -1 });

module.exports = mongoose.model('PomodoroSession', pomodoroSessionSchema);

const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    completed: { type: Boolean, default: false },
    priority: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
    pomodorosCompleted: { type: Number, default: 0 },
    order: { type: Number, default: 0 },
    dueDate: { type: Date },
  },
  { timestamps: true }
);

taskSchema.index({ user: 1, order: 1 });

module.exports = mongoose.model('Task', taskSchema);

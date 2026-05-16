const mongoose = require('mongoose');

const journalEntrySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true, trim: true },
    mood: { type: String, enum: ['great', 'good', 'okay', 'tired', 'stressed'], default: 'good' },
    sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'PomodoroSession' },
    date: { type: String, required: true },
  },
  { timestamps: true }
);

journalEntrySchema.index({ user: 1, date: 1 });

module.exports = mongoose.model('JournalEntry', journalEntrySchema);

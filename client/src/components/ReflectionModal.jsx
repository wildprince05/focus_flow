import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { authAPI } from '../services/api';

const ReflectionModal = ({ isOpen, onClose }) => {
  const [reflection, setReflection] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reflection.trim()) return;
    setSaving(true);
    try {
      await authAPI.saveReflection(reflection);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-light w-full max-w-md rounded-2xl p-6"
          >
            <h2 className="text-xl font-semibold">Daily Reflection</h2>
            <p className="mt-1 text-sm text-zinc-500">
              How did your focus sessions go today?
            </p>
            <form onSubmit={handleSubmit} className="mt-4">
              <textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                rows={4}
                className="input-field resize-none"
                placeholder="What went well? What will you improve tomorrow?"
              />
              <div className="mt-4 flex gap-3">
                <button type="button" onClick={onClose} className="btn-secondary flex-1">
                  Skip
                </button>
                <button type="submit" disabled={saving} className="btn-primary flex-1">
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ReflectionModal;

import { motion, AnimatePresence } from 'framer-motion';

const AchievementToast = ({ achievements, onClose }) => (
  <AnimatePresence>
    {achievements?.length > 0 && (
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed bottom-6 right-6 z-50 max-w-sm"
      >
        {achievements.map((a) => (
          <div
            key={a.badgeId || a._id}
            className="mb-2 rounded-2xl border border-amber-400/30 bg-gradient-to-br from-amber-50 to-orange-50 p-4 shadow-xl dark:from-amber-950/80 dark:to-orange-950/80"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">
              Achievement Unlocked
            </p>
            <p className="mt-1 font-semibold">{a.title}</p>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">{a.description}</p>
          </div>
        ))}
        <button onClick={onClose} className="mt-2 text-xs text-zinc-500 hover:text-zinc-700">
          Dismiss
        </button>
      </motion.div>
    )}
  </AnimatePresence>
);

export default AchievementToast;

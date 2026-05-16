import { motion } from 'framer-motion';
import { formatTime } from '../utils/formatTime';

const SESSION_COLORS = {
  focus: { stroke: '#6366f1', glow: 'rgba(99,102,241,0.4)' },
  shortBreak: { stroke: '#22c55e', glow: 'rgba(34,197,94,0.4)' },
  longBreak: { stroke: '#06b6d4', glow: 'rgba(6,182,212,0.4)' },
};

const SESSION_LABELS = {
  focus: 'Focus',
  shortBreak: 'Short Break',
  longBreak: 'Long Break',
};

const CircularTimer = ({
  timeLeft,
  progress,
  sessionType,
  size = 280,
  onClick,
  isRunning,
  isPaused,
}) => {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;
  const colors = SESSION_COLORS[sessionType] || SESSION_COLORS.focus;

  const statusLabel = isRunning ? 'Tap to pause' : isPaused ? 'Tap to resume' : 'Tap to start';

  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative flex flex-col items-center rounded-full border-0 bg-transparent p-0 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
      aria-label={statusLabel}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          className="text-zinc-200 dark:text-zinc-800"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colors.stroke}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          style={{ filter: `drop-shadow(0 0 8px ${colors.glow})` }}
        />
      </svg>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xs font-medium uppercase tracking-widest text-zinc-500">
          {SESSION_LABELS[sessionType]}
        </span>
        <span className="mt-1 font-mono text-5xl font-light tracking-tight tabular-nums">
          {formatTime(timeLeft)}
        </span>
        {onClick && (
          <span className="mt-2 text-xs text-zinc-400 opacity-0 transition-opacity group-hover:opacity-100">
            {statusLabel}
          </span>
        )}
      </div>
    </button>
  );
};

export default CircularTimer;

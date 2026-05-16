import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTimerContext } from '../context/TimerContext';
import { useAuth } from '../context/AuthContext';
import { usePomodoroTimer } from '../hooks/usePomodoroTimer';
import { useAmbientSound } from '../hooks/useAmbientSound';
import { taskAPI } from '../services/api';
import CircularTimer from '../components/CircularTimer';
import TaskList from '../components/TaskList';
import QuoteCard from '../components/QuoteCard';
import AchievementToast from '../components/AchievementToast';

const SESSION_LABELS = { focus: 'Focus', shortBreak: 'Short Break', longBreak: 'Long Break' };

const Focus = () => {
  const { user, loadUser } = useAuth();
  const {
    focusMode,
    setFocusMode,
    activeTaskId,
    setActiveTaskId,
    currentQuote,
    newAchievements,
    setNewAchievements,
    applyUserSettings,
    sessionType,
    setSessionType,
  } = useTimerContext();

  const [tasks, setTasks] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const onSessionComplete = useCallback(async () => {
    setRefreshKey((k) => k + 1);
    await loadUser();
  }, [loadUser]);

  const timer = usePomodoroTimer(onSessionComplete);
  useAmbientSound(user?.settings?.ambientSound);

  useEffect(() => {
    if (user?.settings) applyUserSettings(user.settings);
  }, [user?.settings, applyUserSettings]);

  useEffect(() => {
    taskAPI.getAll().then(({ data }) => setTasks(data.tasks)).catch(console.error);
  }, [refreshKey]);

  const handleSessionTypeChange = (type) => {
    setSessionType(type);
    timer.resetTimer(type);
  };

  const timerControls = (
    <>
      <CircularTimer
        timeLeft={timer.timeLeft}
        progress={timer.progress}
        sessionType={timer.sessionType}
        size={focusMode ? 320 : 280}
        onClick={timer.toggle}
        isRunning={timer.isRunning}
        isPaused={timer.isPaused}
      />
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <AnimatePresence mode="wait">
          {!timer.isRunning && !timer.isPaused && (
            <motion.button
              key="start"
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={timer.start}
              className="btn-primary px-8"
            >
              Start
            </motion.button>
          )}
          {timer.isRunning && (
            <motion.button
              key="pause"
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={timer.pause}
              className="btn-secondary px-8"
            >
              Pause
            </motion.button>
          )}
          {timer.isPaused && (
            <motion.button
              key="resume"
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={timer.resume}
              className="btn-primary px-8"
            >
              Resume
            </motion.button>
          )}
        </AnimatePresence>
        <button type="button" onClick={timer.reset} className="btn-secondary px-8">
          Reset
        </button>
      </div>
    </>
  );

  if (focusMode) {
    return (
      <div className="fixed inset-0 z-30 flex flex-col items-center justify-center bg-zinc-950 text-white">
        <button
          type="button"
          onClick={() => setFocusMode(false)}
          className="absolute right-6 top-6 z-10 text-sm text-zinc-400 hover:text-white"
        >
          Exit focus mode
        </button>
        {timerControls}
        <p className="mt-4 text-sm text-zinc-500">{SESSION_LABELS[timer.sessionType]}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      <AchievementToast
        achievements={newAchievements}
        onClose={() => setNewAchievements([])}
      />

      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Focus Session</h1>
        <button type="button" onClick={() => setFocusMode(true)} className="btn-secondary">
          Enter Focus Mode
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="flex flex-col items-center">
          <div className="mb-4 flex gap-2">
            {['focus', 'shortBreak', 'longBreak'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => handleSessionTypeChange(type)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  sessionType === type
                    ? 'bg-indigo-500/10 text-indigo-600'
                    : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                {SESSION_LABELS[type]}
              </button>
            ))}
          </div>

          {timerControls}

          <div className="mt-8 w-full">
            <QuoteCard quote={currentQuote} />
          </div>
        </div>

        <div className="glass-light rounded-2xl p-6">
          <h2 className="mb-4 font-semibold">Today&apos;s Tasks</h2>
          <p className="mb-4 text-xs text-zinc-500">Click a task to link it to your session</p>
          <TaskList
            tasks={tasks}
            setTasks={setTasks}
            activeTaskId={activeTaskId}
            onSelectTask={setActiveTaskId}
          />
        </div>
      </div>
    </div>
  );
};

export default Focus;

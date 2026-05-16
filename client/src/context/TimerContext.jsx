import { createContext, useContext, useState, useCallback, useMemo } from 'react';

const TimerContext = createContext(null);

const DEFAULT_SETTINGS = {
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  sessionsBeforeLongBreak: 4,
};

export const TimerProvider = ({ children }) => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [sessionType, setSessionType] = useState('focus');
  const [completedFocusSessions, setCompletedFocusSessions] = useState(0);
  const [activeTaskId, setActiveTaskId] = useState(null);
  const [focusMode, setFocusMode] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(null);
  const [newAchievements, setNewAchievements] = useState([]);

  const getDurationForType = useCallback(
    (type) => {
      if (type === 'focus') return settings.focusDuration;
      if (type === 'shortBreak') return settings.shortBreakDuration;
      return settings.longBreakDuration;
    },
    [settings.focusDuration, settings.shortBreakDuration, settings.longBreakDuration]
  );

  const nextSessionType = useCallback(() => {
    if (sessionType === 'focus') {
      const nextCount = completedFocusSessions + 1;
      setCompletedFocusSessions(nextCount);
      if (nextCount % settings.sessionsBeforeLongBreak === 0) {
        return 'longBreak';
      }
      return 'shortBreak';
    }
    return 'focus';
  }, [sessionType, completedFocusSessions, settings.sessionsBeforeLongBreak]);

  const applyUserSettings = useCallback((userSettings) => {
    if (!userSettings) return;
    setSettings((prev) => {
      const next = { ...prev, ...userSettings };
      const unchanged =
        prev.focusDuration === next.focusDuration &&
        prev.shortBreakDuration === next.shortBreakDuration &&
        prev.longBreakDuration === next.longBreakDuration &&
        prev.sessionsBeforeLongBreak === next.sessionsBeforeLongBreak;
      return unchanged ? prev : next;
    });
  }, []);

  const value = useMemo(
    () => ({
      settings,
      setSettings,
      applyUserSettings,
      sessionType,
      setSessionType,
      completedFocusSessions,
      setCompletedFocusSessions,
      activeTaskId,
      setActiveTaskId,
      focusMode,
      setFocusMode,
      currentQuote,
      setCurrentQuote,
      newAchievements,
      setNewAchievements,
      getDurationForType,
      nextSessionType,
    }),
    [
      settings,
      applyUserSettings,
      sessionType,
      completedFocusSessions,
      activeTaskId,
      focusMode,
      currentQuote,
      newAchievements,
      getDurationForType,
      nextSessionType,
    ]
  );

  return <TimerContext.Provider value={value}>{children}</TimerContext.Provider>;
};

export const useTimerContext = () => {
  const ctx = useContext(TimerContext);
  if (!ctx) throw new Error('useTimerContext must be used within TimerProvider');
  return ctx;
};

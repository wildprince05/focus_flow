import { useState, useEffect, useRef, useCallback } from 'react';
import { useTimerContext } from '../context/TimerContext';
import { sessionAPI } from '../services/api';

const playNotificationSound = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.5);
  } catch {
    /* audio unavailable */
  }
};

const showBrowserNotification = (title, body) => {
  if (Notification.permission === 'granted') {
    new Notification(title, { body, icon: '/favicon.svg' });
  }
};

export const usePomodoroTimer = (onSessionComplete) => {
  const {
    sessionType,
    setSessionType,
    getDurationForType,
    nextSessionType,
    activeTaskId,
    setCurrentQuote,
    setNewAchievements,
  } = useTimerContext();

  const onCompleteRef = useRef(onSessionComplete);
  onCompleteRef.current = onSessionComplete;

  const getDurationRef = useRef(getDurationForType);
  getDurationRef.current = getDurationForType;

  const [timeLeft, setTimeLeft] = useState(() => getDurationForType('focus') * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const totalSecondsRef = useRef(getDurationForType(sessionType) * 60);
  const sessionTypeRef = useRef(sessionType);
  const isRunningRef = useRef(false);
  const isPausedRef = useRef(false);

  const resetTimer = useCallback((type) => {
    const t = type ?? sessionTypeRef.current;
    const secs = getDurationRef.current(t) * 60;
    totalSecondsRef.current = secs;
    setTimeLeft(secs);
    setIsRunning(false);
    setIsPaused(false);
    isRunningRef.current = false;
    isPausedRef.current = false;
  }, []);

  // Only reset when session type actually changes (not when settings callback identity changes)
  useEffect(() => {
    if (sessionTypeRef.current !== sessionType) {
      sessionTypeRef.current = sessionType;
      resetTimer(sessionType);
    }
  }, [sessionType, resetTimer]);

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const completeSession = useCallback(async () => {
    const type = sessionTypeRef.current;
    const duration = getDurationRef.current(type);
    playNotificationSound();
    const labels = {
      focus: 'Focus complete!',
      shortBreak: 'Break over!',
      longBreak: 'Long break over!',
    };
    showBrowserNotification('FocusFlow', labels[type] || 'Session complete');

    if (type === 'focus') {
      try {
        const { data } = await sessionAPI.complete({
          type: 'focus',
          duration,
          taskId: activeTaskId,
        });
        setCurrentQuote(data.quote);
        if (data.newAchievements?.length) setNewAchievements(data.newAchievements);
        onCompleteRef.current?.(data);
      } catch (err) {
        console.error('Failed to save session', err);
      }
    }

    const next = nextSessionType();
    sessionTypeRef.current = next;
    setSessionType(next);
    resetTimer(next);
  }, [activeTaskId, nextSessionType, setSessionType, resetTimer, setCurrentQuote, setNewAchievements]);

  const completeSessionRef = useRef(completeSession);
  completeSessionRef.current = completeSession;

  // Tick interval – stable effect, no restart on every render
  useEffect(() => {
    if (!isRunning || isPaused) return undefined;

    const id = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          isRunningRef.current = false;
          setIsRunning(false);
          completeSessionRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [isRunning, isPaused]);

  const start = useCallback(() => {
    setIsRunning(true);
    setIsPaused(false);
    isRunningRef.current = true;
    isPausedRef.current = false;
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
    setIsPaused(true);
    isRunningRef.current = false;
    isPausedRef.current = true;
  }, []);

  const resume = useCallback(() => {
    setIsRunning(true);
    setIsPaused(false);
    isRunningRef.current = true;
    isPausedRef.current = false;
  }, []);

  const toggle = useCallback(() => {
    if (isRunningRef.current) {
      pause();
    } else if (isPausedRef.current) {
      resume();
    } else {
      start();
    }
  }, [start, pause, resume]);

  const reset = useCallback(() => resetTimer(sessionTypeRef.current), [resetTimer]);

  const progress =
    totalSecondsRef.current > 0
      ? ((totalSecondsRef.current - timeLeft) / totalSecondsRef.current) * 100
      : 0;

  return {
    timeLeft,
    isRunning,
    isPaused,
    sessionType,
    progress,
    start,
    pause,
    resume,
    reset,
    toggle,
    resetTimer,
  };
};

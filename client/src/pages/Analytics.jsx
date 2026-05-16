import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { analyticsAPI, achievementAPI, streakAPI } from '../services/api';
import Heatmap from '../components/Heatmap';
import StatCard from '../components/StatCard';

const BADGE_ICONS = {
  first_session: '🎯',
  seven_day_streak: '🔥',
  hundred_sessions: '💯',
  deep_focus_master: '🧠',
};

const ALL_BADGES = [
  { id: 'first_session', title: 'First Session', description: 'Complete your first Pomodoro' },
  { id: 'seven_day_streak', title: '7 Day Streak', description: '7 consecutive active days' },
  { id: 'hundred_sessions', title: '100 Sessions', description: 'Complete 100 sessions' },
  { id: 'deep_focus_master', title: 'Deep Focus Master', description: '50+ hours of focus' },
];

const Analytics = () => {
  const [dashboard, setDashboard] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [streak, setStreak] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      analyticsAPI.getDashboard(),
      achievementAPI.getAll(),
      streakAPI.get(),
    ])
      .then(([dash, ach, str]) => {
        setDashboard(dash.data.dashboard);
        setAchievements(ach.data.achievements);
        setStreak(str.data.streak);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  const unlockedIds = new Set(achievements.map((a) => a.badgeId));
  const d = dashboard || {};

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <h1 className="text-2xl font-bold">Analytics</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Sessions" value={d.user?.totalSessions ?? 0} />
        <StatCard
          label="Total Focus Hours"
          value={((d.user?.totalFocusMinutes ?? 0) / 60).toFixed(1)}
        />
        <StatCard label="Longest Streak" value={`${d.streak?.longest ?? 0} days`} />
        <StatCard
          label="Streak Freezes"
          value={streak?.streakFreezes ?? 0}
          sub="Earn 1 every 7 active days"
        />
      </div>

      <div className="glass-light rounded-2xl p-5">
        <h3 className="mb-4 font-medium">Weekly Sessions Trend</h3>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={d.weeklyData || []}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
            <XAxis dataKey="label" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="sessions"
              stroke="#6366f1"
              strokeWidth={2}
              dot={{ fill: '#6366f1' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <Heatmap data={d.heatmap} />

      <div className="glass-light rounded-2xl p-6">
        <h3 className="mb-4 font-medium">Achievements</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {ALL_BADGES.map((badge) => {
            const unlocked = unlockedIds.has(badge.id);
            return (
              <div
                key={badge.id}
                className={`flex items-center gap-4 rounded-xl p-4 transition-all ${
                  unlocked
                    ? 'bg-indigo-500/10 ring-1 ring-indigo-500/20'
                    : 'bg-zinc-100/50 opacity-50 dark:bg-zinc-800/30'
                }`}
              >
                <span className="text-3xl">{BADGE_ICONS[badge.id]}</span>
                <div>
                  <p className="font-medium">{badge.title}</p>
                  <p className="text-sm text-zinc-500">{badge.description}</p>
                </div>
                {unlocked && (
                  <span className="ml-auto text-xs font-medium text-indigo-600">Unlocked</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Analytics;

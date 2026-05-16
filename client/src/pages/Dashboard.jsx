import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { analyticsAPI, sessionAPI } from '../services/api';
import { getGreeting } from '../utils/formatTime';
import StatCard from '../components/StatCard';
import Heatmap from '../components/Heatmap';
import QuoteCard from '../components/QuoteCard';
import ReflectionModal from '../components/ReflectionModal';

const Dashboard = () => {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [quote, setQuote] = useState(null);
  const [showReflection, setShowReflection] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [dashRes, quoteRes] = await Promise.all([
          analyticsAPI.getDashboard(),
          sessionAPI.getQuote(),
        ]);
        setDashboard(dashRes.data.dashboard);
        setQuote(quoteRes.data.quote);
        const lastReflection = user?.lastReflectionDate;
        const today = new Date().toDateString();
        if (!lastReflection || new Date(lastReflection).toDateString() !== today) {
          const hour = new Date().getHours();
          if (hour >= 18) setShowReflection(true);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  const d = dashboard || {};

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {getGreeting()}, {user?.name?.split(' ')[0]}
          </h1>
          <p className="mt-1 text-zinc-500">Here&apos;s your productivity overview</p>
        </div>
        <Link to="/focus" className="btn-primary">
          Start Focus Session
        </Link>
      </div>

      <QuoteCard quote={quote} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Today's Sessions" value={d.today?.sessions ?? 0} delay={0} />
        <StatCard
          label="Focus Hours Today"
          value={d.today?.focusHours ?? '0'}
          delay={0.05}
        />
        <StatCard
          label="Current Streak"
          value={`${d.streak?.current ?? 0} days`}
          sub={`Longest: ${d.streak?.longest ?? 0} days`}
          delay={0.1}
        />
        <StatCard
          label="Level & XP"
          value={`Lv. ${d.user?.level ?? 1}`}
          sub={`${d.user?.xp ?? 0} XP`}
          delay={0.15}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-light rounded-2xl p-5">
          <h3 className="mb-4 font-medium">Weekly Focus</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={d.weeklyData || []}>
              <XAxis dataKey="label" tick={{ fontSize: 12 }} stroke="#a1a1aa" />
              <YAxis tick={{ fontSize: 12 }} stroke="#a1a1aa" />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: 'none',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                }}
              />
              <Bar dataKey="focusMinutes" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <Heatmap data={d.heatmap} />
      </div>

      <ReflectionModal isOpen={showReflection} onClose={() => setShowReflection(false)} />
    </div>
  );
};

export default Dashboard;

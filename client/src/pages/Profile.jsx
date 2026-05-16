import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI, journalAPI } from '../services/api';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [journalContent, setJournalContent] = useState('');
  const [mood, setMood] = useState('good');
  const [entries, setEntries] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    journalAPI.getAll().then(({ data }) => setEntries(data.entries)).catch(console.error);
  }, []);

  const handleProfileSave = async () => {
    setSaving(true);
    try {
      const { data } = await authAPI.updateProfile({ name });
      updateUser(data.user);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleJournalSubmit = async (e) => {
    e.preventDefault();
    if (!journalContent.trim()) return;
    try {
      const { data } = await journalAPI.create({ content: journalContent, mood });
      setEntries((prev) => [data.entry, ...prev]);
      setJournalContent('');
    } catch (err) {
      console.error(err);
    }
  };

  const xpForNextLevel = Math.pow(user?.level || 1, 2) * 50;
  const xpProgress = ((user?.xp || 0) % xpForNextLevel) / xpForNextLevel * 100;

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <h1 className="text-2xl font-bold">Profile</h1>

      <section className="glass-light rounded-2xl p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 text-2xl font-bold text-indigo-600">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="font-semibold">{user?.name}</p>
            <p className="text-sm text-zinc-500">{user?.email}</p>
            <p className="mt-1 text-sm text-indigo-600">
              Level {user?.level || 1} · {user?.xp || 0} XP
            </p>
          </div>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
          <div
            className="h-full rounded-full bg-indigo-600 transition-all"
            style={{ width: `${xpProgress}%` }}
          />
        </div>
      </section>

      <section className="glass-light space-y-4 rounded-2xl p-6">
        <h2 className="font-semibold">Edit Profile</h2>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input-field"
          placeholder="Your name"
        />
        <button onClick={handleProfileSave} disabled={saving} className="btn-primary">
          {saving ? 'Saving...' : 'Save profile'}
        </button>
      </section>

      <section className="glass-light space-y-4 rounded-2xl p-6">
        <h2 className="font-semibold">Session Journal</h2>
        <form onSubmit={handleJournalSubmit} className="space-y-3">
          <select
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            className="input-field"
          >
            <option value="great">Great</option>
            <option value="good">Good</option>
            <option value="okay">Okay</option>
            <option value="tired">Tired</option>
            <option value="stressed">Stressed</option>
          </select>
          <textarea
            value={journalContent}
            onChange={(e) => setJournalContent(e.target.value)}
            rows={3}
            className="input-field resize-none"
            placeholder="Notes from your focus session..."
          />
          <button type="submit" className="btn-primary">
            Add entry
          </button>
        </form>
        <div className="mt-4 space-y-3">
          {entries.slice(0, 5).map((entry) => (
            <div key={entry._id} className="rounded-xl bg-zinc-100/50 p-3 dark:bg-zinc-800/50">
              <p className="text-xs text-zinc-500">
                {entry.date} · {entry.mood}
              </p>
              <p className="mt-1 text-sm">{entry.content}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Profile;

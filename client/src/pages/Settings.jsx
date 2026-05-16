import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { authAPI } from '../services/api';

const Settings = () => {
  const { user, updateUser } = useAuth();
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useState(user?.settings || {});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user?.settings) setSettings(user.settings);
  }, [user]);

  const handleChange = (key, value) => {
    setSettings((s) => ({ ...s, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      const { data } = await authAPI.updateSettings(settings);
      updateUser({ settings: data.settings });
      setTheme(data.settings.theme);
      setMessage('Settings saved!');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <h1 className="text-2xl font-bold">Settings</h1>

      {message && (
        <p className="rounded-xl bg-indigo-500/10 px-4 py-2 text-sm text-indigo-600">{message}</p>
      )}

      <section className="glass-light space-y-4 rounded-2xl p-6">
        <h2 className="font-semibold">Timer Durations (minutes)</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm text-zinc-500">Focus</label>
            <input
              type="number"
              min={1}
              max={90}
              value={settings.focusDuration ?? 25}
              onChange={(e) => handleChange('focusDuration', +e.target.value)}
              className="input-field mt-1"
            />
          </div>
          <div>
            <label className="text-sm text-zinc-500">Short Break</label>
            <input
              type="number"
              min={1}
              max={30}
              value={settings.shortBreakDuration ?? 5}
              onChange={(e) => handleChange('shortBreakDuration', +e.target.value)}
              className="input-field mt-1"
            />
          </div>
          <div>
            <label className="text-sm text-zinc-500">Long Break</label>
            <input
              type="number"
              min={1}
              max={60}
              value={settings.longBreakDuration ?? 15}
              onChange={(e) => handleChange('longBreakDuration', +e.target.value)}
              className="input-field mt-1"
            />
          </div>
          <div>
            <label className="text-sm text-zinc-500">Sessions before long break</label>
            <input
              type="number"
              min={2}
              max={10}
              value={settings.sessionsBeforeLongBreak ?? 4}
              onChange={(e) => handleChange('sessionsBeforeLongBreak', +e.target.value)}
              className="input-field mt-1"
            />
          </div>
        </div>
      </section>

      <section className="glass-light space-y-4 rounded-2xl p-6">
        <h2 className="font-semibold">Appearance</h2>
        <select
          value={settings.theme ?? theme}
          onChange={(e) => handleChange('theme', e.target.value)}
          className="input-field"
        >
          <option value="system">System</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </section>

      <section className="glass-light space-y-4 rounded-2xl p-6">
        <h2 className="font-semibold">Sounds & Notifications</h2>
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={settings.soundEnabled ?? true}
            onChange={(e) => handleChange('soundEnabled', e.target.checked)}
            className="h-4 w-4 rounded text-indigo-600"
          />
          <span className="text-sm">Session end sound</span>
        </label>
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={settings.notificationsEnabled ?? true}
            onChange={(e) => handleChange('notificationsEnabled', e.target.checked)}
            className="h-4 w-4 rounded text-indigo-600"
          />
          <span className="text-sm">Browser notifications</span>
        </label>
        <div>
          <label className="text-sm text-zinc-500">Ambient sound</label>
          <select
            value={settings.ambientSound ?? 'none'}
            onChange={(e) => handleChange('ambientSound', e.target.value)}
            className="input-field mt-1"
          >
            <option value="none">None</option>
            <option value="rain">Rain</option>
            <option value="cafe">Cafe</option>
            <option value="white-noise">White noise</option>
          </select>
        </div>
      </section>

      <button onClick={handleSave} disabled={saving} className="btn-primary">
        {saving ? 'Saving...' : 'Save settings'}
      </button>
    </div>
  );
};

export default Settings;

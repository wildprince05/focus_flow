import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useTimerContext } from '../context/TimerContext';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: '◉' },
  { to: '/focus', label: 'Focus', icon: '◎' },
  { to: '/analytics', label: 'Analytics', icon: '◫' },
  { to: '/settings', label: 'Settings', icon: '◈' },
  { to: '/profile', label: 'Profile', icon: '○' },
];

const AppLayout = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { focusMode, setFocusMode } = useTimerContext();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleNavClick = () => {
    if (focusMode) setFocusMode(false);
  };

  return (
    <div className="flex min-h-screen">
      <aside className="relative z-50 hidden w-64 flex-col border-r border-zinc-200/60 bg-white/50 backdrop-blur-xl dark:border-zinc-800/60 dark:bg-zinc-950/50 lg:flex">
        <div className="flex h-16 items-center gap-2 border-b border-zinc-200/60 px-6 dark:border-zinc-800/60">
          <NavLink
            to="/dashboard"
            onClick={handleNavClick}
            className="text-xl font-bold tracking-tight text-indigo-600"
          >
            FocusFlow
          </NavLink>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={handleNavClick}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                    : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800/50'
                }`
              }
            >
              <span>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-zinc-200/60 p-4 dark:border-zinc-800/60">
          <p className="truncate text-sm font-medium">{user?.name}</p>
          <p className="truncate text-xs text-zinc-500">
            Level {user?.level || 1} · {user?.xp || 0} XP
          </p>
          <button type="button" onClick={handleLogout} className="mt-3 w-full btn-secondary text-xs">
            Logout
          </button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="relative z-50 flex h-14 items-center justify-between border-b border-zinc-200/60 px-4 dark:border-zinc-800/60 lg:px-8">
          <nav className="flex gap-2 overflow-x-auto lg:hidden">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium ${
                    isActive ? 'bg-indigo-500/10 text-indigo-600' : 'text-zinc-500'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="rounded-xl p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </div>
        </header>
        <main className="relative flex-1 overflow-auto p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;

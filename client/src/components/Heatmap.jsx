const getIntensity = (sessions) => {
  if (sessions === 0) return 'bg-zinc-100 dark:bg-zinc-800';
  if (sessions === 1) return 'bg-indigo-200 dark:bg-indigo-900';
  if (sessions <= 3) return 'bg-indigo-400 dark:bg-indigo-700';
  if (sessions <= 5) return 'bg-indigo-500 dark:bg-indigo-600';
  return 'bg-indigo-600 dark:bg-indigo-500';
};

const Heatmap = ({ data = [] }) => {
  const cells = data.length ? data : Array.from({ length: 90 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (89 - i));
    return { date: d.toISOString().split('T')[0], sessions: 0 };
  });

  return (
    <div className="glass-light rounded-2xl p-5">
      <h3 className="mb-4 text-sm font-medium text-zinc-500">Activity (90 days)</h3>
      <div className="flex flex-wrap gap-1">
        {cells.map((cell) => (
          <div
            key={cell.date}
            title={`${cell.date}: ${cell.sessions || 0} sessions`}
            className={`h-3 w-3 rounded-sm transition-colors ${getIntensity(cell.sessions || 0)}`}
          />
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2 text-xs text-zinc-400">
        <span>Less</span>
        {[0, 1, 3, 5, 6].map((n, i) => (
          <div key={i} className={`h-3 w-3 rounded-sm ${getIntensity(n)}`} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
};

export default Heatmap;

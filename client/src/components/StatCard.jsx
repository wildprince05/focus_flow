import { motion } from 'framer-motion';

const StatCard = ({ label, value, sub, icon: Icon, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="glass-light rounded-2xl p-5"
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-zinc-500">{label}</p>
        <p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p>
        {sub && <p className="mt-0.5 text-xs text-zinc-400">{sub}</p>}
      </div>
      {Icon && (
        <div className="rounded-xl bg-indigo-500/10 p-2.5 text-indigo-600 dark:text-indigo-400">
          <Icon className="h-5 w-5" />
        </div>
      )}
    </div>
  </motion.div>
);

export default StatCard;

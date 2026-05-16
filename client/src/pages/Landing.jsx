import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Landing = () => (
  <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-zinc-50 via-white to-indigo-50/30 dark:from-zinc-950 dark:via-zinc-950 dark:to-indigo-950/20">
    <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
      <span className="text-xl font-bold text-indigo-600">FocusFlow</span>
      <div className="flex gap-3">
        <Link to="/login" className="btn-secondary">Log in</Link>
        <Link to="/signup" className="btn-primary">Get started</Link>
      </div>
    </nav>

    <section className="mx-auto max-w-4xl px-6 py-24 text-center">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-5xl font-bold tracking-tight sm:text-6xl"
      >
        Focus deeply.
        <br />
        <span className="text-indigo-600">Stay consistent.</span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mx-auto mt-6 max-w-xl text-lg text-zinc-600 dark:text-zinc-400"
      >
        A minimalist Pomodoro app with streaks, tasks, analytics, and gamification —
        designed to help you build lasting focus habits.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-10 flex flex-wrap justify-center gap-4"
      >
        <Link to="/signup" className="btn-primary px-8 py-3 text-base">
          Start focusing free
        </Link>
        <Link to="/login" className="btn-secondary px-8 py-3 text-base">
          I have an account
        </Link>
      </motion.div>

      <div className="mt-24 grid gap-6 sm:grid-cols-3">
        {[
          { title: 'Pomodoro Timer', desc: '25/5/15 cycles with auto transitions & notifications' },
          { title: 'Streak System', desc: 'Daily streaks with freeze rewards every 7 active days' },
          { title: 'Gamification', desc: 'XP, levels, and achievement badges for milestones' },
        ].map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            className="glass-light rounded-2xl p-6 text-left"
          >
            <h3 className="font-semibold">{f.title}</h3>
            <p className="mt-2 text-sm text-zinc-500">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  </div>
);

export default Landing;

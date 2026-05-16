const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const taskRoutes = require('./routes/taskRoutes');
const streakRoutes = require('./routes/streakRoutes');
const achievementRoutes = require('./routes/achievementRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const journalRoutes = require('./routes/journalRoutes');

const createApp = () => {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      credentials: true,
    })
  );
  app.use(express.json({ limit: '10kb' }));
  app.use(cookieParser());

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    message: { success: false, message: 'Too many requests, please try again later.' },
  });
  app.use('/api', limiter);

  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: { success: false, message: 'Too many auth attempts.' },
  });

  app.get('/api/health', (_, res) => {
    const dbState = mongoose.connection.readyState;
    const dbStatus = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
    res.json({
      success: true,
      message: 'FocusFlow API is running',
      database: dbStatus[dbState] || 'unknown',
    });
  });

  app.use('/api/auth', authLimiter, authRoutes);
  app.use('/api/sessions', sessionRoutes);
  app.use('/api/tasks', taskRoutes);
  app.use('/api/streaks', streakRoutes);
  app.use('/api/achievements', achievementRoutes);
  app.use('/api/analytics', analyticsRoutes);
  app.use('/api/journal', journalRoutes);

  app.use(errorHandler);

  return app;
};

module.exports = createApp;

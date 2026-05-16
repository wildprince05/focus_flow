const { validateEnv } = require('./config/env');
const connectDB = require('./config/db');
const createApp = require('./app');

const startServer = async () => {
  try {
    validateEnv();
    await connectDB();

    const app = createApp();
    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`FocusFlow server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();

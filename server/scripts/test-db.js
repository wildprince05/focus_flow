require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const connectDB = require('../config/db');

connectDB()
  .then(() => {
    console.log('Database test successful.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Database test failed:', err.message);
    process.exit(1);
  });

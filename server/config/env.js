require('dotenv').config();

const required = ['JWT_SECRET', 'JWT_REFRESH_SECRET'];

const getMongoUri = () => {
  if (process.env.MONGODB_USER && process.env.MONGODB_PASSWORD) {
    const user = encodeURIComponent(process.env.MONGODB_USER);
    const pass = encodeURIComponent(process.env.MONGODB_PASSWORD);
    const cluster = process.env.MONGODB_CLUSTER || 'cluster0.exjtgep.mongodb.net';
    const db = process.env.MONGODB_DB || 'focusflow';
    return `mongodb+srv://${user}:${pass}@${cluster}/${db}?retryWrites=true&w=majority`;
  }

  let uri = process.env.MONGODB_URI || '';

  if (uri.includes('<') || uri.includes('>')) {
    throw new Error(
      'MONGODB_URI still contains <placeholders>. Set your real password in server/.env ' +
        '(no angle brackets), or use MONGODB_USER + MONGODB_PASSWORD instead.'
    );
  }

  return uri;
};

const validateEnv = () => {
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  const hasMongo =
    (process.env.MONGODB_USER && process.env.MONGODB_PASSWORD) || process.env.MONGODB_URI;
  if (!hasMongo) {
    throw new Error(
      'Set MONGODB_USER + MONGODB_PASSWORD, or MONGODB_URI in server/.env'
    );
  }

  if (
    process.env.MONGODB_PASSWORD?.includes('<') ||
    process.env.MONGODB_PASSWORD?.includes('>')
  ) {
    throw new Error('MONGODB_PASSWORD must not contain angle brackets. Use your real Atlas password.');
  }
};

module.exports = { validateEnv, getMongoUri };

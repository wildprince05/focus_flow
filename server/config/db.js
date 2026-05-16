const dns = require('dns');
const mongoose = require('mongoose');
const { getMongoUri } = require('./env');

dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

const ATLAS_OPTIONS = {
  serverSelectionTimeoutMS: 20000,
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
};

const FALLBACK_SHARDS = {
  'cluster0.exjtgep.mongodb.net': [
    'ac-mjvejer-shard-00-00.exjtgep.mongodb.net:27017',
    'ac-mjvejer-shard-00-01.exjtgep.mongodb.net:27017',
    'ac-mjvejer-shard-00-02.exjtgep.mongodb.net:27017',
  ],
  'cluster0.y6iwral.mongodb.net': [
    'ac-sh9hztg-shard-00-00.y6iwral.mongodb.net:27017',
    'ac-sh9hztg-shard-00-01.y6iwral.mongodb.net:27017',
    'ac-sh9hztg-shard-00-02.y6iwral.mongodb.net:27017',
  ],
};

const resolveShardHosts = async (cluster) => {
  if (FALLBACK_SHARDS[cluster]) return FALLBACK_SHARDS[cluster];

  try {
    const records = await dns.promises.resolveSrv(`_mongodb._tcp.${cluster}`);
    return records.map((r) => `${r.name}:${r.port}`);
  } catch {
    return null;
  }
};

const buildDirectAtlasUri = async () => {
  const user = process.env.MONGODB_USER;
  const pass = process.env.MONGODB_PASSWORD;
  const cluster = process.env.MONGODB_CLUSTER;
  if (!user || !pass || !cluster) return null;

  const hosts = await resolveShardHosts(cluster);
  if (!hosts?.length) return null;

  const db = process.env.MONGODB_DB || 'focusflow';
  return `mongodb://${encodeURIComponent(user)}:${encodeURIComponent(pass)}@${hosts.join(',')}/${db}?ssl=true&authSource=admin&retryWrites=true&w=majority`;
};

const connectDB = async () => {
  const uris = [];

  const directUri = await buildDirectAtlasUri();
  if (directUri) uris.push({ uri: directUri, label: 'Atlas (direct)' });

  try {
    const srvUri = getMongoUri();
    if (srvUri.startsWith('mongodb+srv')) {
      uris.push({ uri: srvUri, label: 'Atlas (SRV)' });
    } else if (!directUri) {
      uris.push({ uri: srvUri, label: 'MongoDB' });
    }
  } catch (err) {
    if (!directUri) console.warn('Could not build SRV URI, falling back to local...');
  }

  uris.push({ uri: 'mongodb://127.0.0.1:27017/focusflow', label: 'Local MongoDB' });

  let lastError;

  for (const { uri, label } of uris) {
    try {
      const conn = await mongoose.connect(uri, ATLAS_OPTIONS);
      console.log(`MongoDB connected [${label}]: ${conn.connection.host}`);
      return conn;
    } catch (error) {
      lastError = error;
      await mongoose.disconnect().catch(() => {});
      console.warn(`Connection failed (${label}): ${error.message}`);
    }
  }

  console.error('\n--- MongoDB connection failed ---');
  console.error(lastError?.message);
  console.error('\nChecklist:');
  console.error('  1. Set MONGODB_PASSWORD in server/.env to your real Atlas password');
  console.error('  2. Atlas → Network Access → allow your IP');
  console.error('  3. Ensure a local MongoDB instance is running on port 27017 as fallback');
  console.error('  4. Run: npm run test:db\n');
  process.exit(1);
};

module.exports = connectDB;

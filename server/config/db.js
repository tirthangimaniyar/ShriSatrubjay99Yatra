const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

let isConnectedToMongo = false;
let lastMongoError = null;
let ttlIndexVerified = false;
let reconnectTimer = null;
let isConnecting = false;

const dataDir = path.join(__dirname, '..', 'data');
const dbFilePath = path.join(dataDir, 'db.json');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initial fallback database structure
const initialData = {
  admins: [],
  registrations: [],
  gallery: [],
  announcements: [],
  settings: {
    yatraName: "શ્રી શત્રુંજય ગિરિરાજ ૯૯ યાત્રા સહ છ'રી પાલિત યાત્રા સંઘ",
    yatraNameEnglish: "Shri Shatrunjay Giriraj 99 Yatra Sah Chha'ri Palit Yatra Sangh",
    organizer: "શ્રી બેતાલીસ વિશા શ્રીમાળી જૈન સમાજ",
    dates: "કારતક સુદ પૂનમ થી મહા સુદ દસમ (તારીખ: 04 જાન્યુઆરી 2027 થી 13 જાન્યુઆરી 2027)",
    location: "શ્રી શત્રુંજય તીર્થ, પાલિતાણા, ભાવનગર, ગુજરાત",
    contactMobile: "+91 97123 85694",
    contactWhatsApp: "+91 97123 85694",
    contactEmail: "info@palitana99yatra.org",
    suratAddress: "શ્રી બેતાલીસ વિશા શ્રીમાળી જૈન ભવન, અડાજણ - પાલ, સુરત, ગુજરાત - 395009",
    palitanaAddress: "શ્રી બેતાલીસ ભવન, તળેટી રોડ, પાલિતાણા, ગુજરાત - 364270",
    registrationOpen: true,
    totalTargetYatrik: 999,
    announcementTicker: "જય જિનેન્દ્ર! શ્રી શત્રુંજય ગિરિરાજ ૯૯ યાત્રા માટે ઓનલાઈન રજીસ્ટ્રેશન શરૂ થઈ ગયેલ છે. વહેલા તે પહેલાના ધોરણે પોતાનું નામ નોંધાવો."
  }
};

// JSON-based database helper for fallback
class JsonStore {
  constructor() {
    if (!fs.existsSync(dbFilePath)) {
      fs.writeFileSync(dbFilePath, JSON.stringify(initialData, null, 2), 'utf8');
    }
  }

  read() {
    try {
      const content = fs.readFileSync(dbFilePath, 'utf8');
      return JSON.parse(content);
    } catch (err) {
      console.error('Error reading JSON store:', err.message);
      return initialData;
    }
  }

  write(data) {
    try {
      fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (err) {
      console.error('Error writing JSON store:', err.message);
    }
  }
}

const jsonStore = new JsonStore();

// Inspect and resolve MongoDB URI from various environment variable keys
const getMongoConfig = () => {
  const envKeys = ['MONGODB_URI', 'MONGO_URI', 'DATABASE_URL', 'MONGODB_URL', 'ATLAS_URI'];
  let rawUri = '';
  let foundKey = null;

  for (const key of envKeys) {
    const val = process.env[key];
    if (val && typeof val === 'string' && val.trim().length > 0) {
      rawUri = val.trim();
      foundKey = key;
      break;
    }
  }

  // Strip accidental enclosing single or double quotes
  if (rawUri.startsWith('"') && rawUri.endsWith('"')) {
    rawUri = rawUri.slice(1, -1).trim();
  } else if (rawUri.startsWith("'") && rawUri.endsWith("'")) {
    rawUri = rawUri.slice(1, -1).trim();
  }

  const isProduction = process.env.NODE_ENV === 'production' || Boolean(process.env.RENDER);
  
  // In development, default to localhost if no URI is supplied
  const uri = rawUri || (isProduction ? '' : 'mongodb://127.0.0.1:27017/palitana_99_yatra');

  let maskedUri = 'none';
  let host = 'not-configured';
  let dbName = 'palitana_99_yatra';

  if (uri) {
    maskedUri = uri.replace(/:([^:@]+)@/, ':****@');
    try {
      if (uri.includes('@')) {
        const afterAt = uri.split('@')[1];
        host = afterAt.split('/')[0].split('?')[0];
        const afterSlash = afterAt.split('/')[1];
        if (afterSlash) {
          dbName = afterSlash.split('?')[0] || 'palitana_99_yatra';
        }
      } else if (uri.includes('://')) {
        const afterScheme = uri.split('://')[1];
        host = afterScheme.split('/')[0].split('?')[0];
        const afterSlash = afterScheme.split('/')[1];
        if (afterSlash) {
          dbName = afterSlash.split('?')[0] || 'palitana_99_yatra';
        }
      }
    } catch (_) {
      // Fallback if parsing fails
    }
  }

  return {
    uri,
    maskedUri,
    foundKey,
    hasUri: Boolean(rawUri),
    host,
    dbName,
    isProduction
  };
};

const verifyAndCreateIndexes = async () => {
  try {
    const Registration = require('../models/Registration');
    // Ensure TTL index exists on expiresAt with expireAfterSeconds: 0
    await Registration.collection.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0, background: true });
    
    const indexes = await Registration.collection.indexes();
    const ttlIdx = indexes.find(idx => idx.key && idx.key.expiresAt !== undefined && idx.expireAfterSeconds === 0);
    if (ttlIdx) {
      ttlIndexVerified = true;
      console.log('MongoDB TTL Index on expiresAt (expireAfterSeconds: 0) verified successfully in Atlas database!');
    } else {
      console.warn('TTL Index created but not yet visible in indexes list.');
    }
    return ttlIndexVerified;
  } catch (err) {
    console.error('Error verifying/creating TTL index:', err.message);
    return false;
  }
};

const connectDB = async () => {
  if (isConnecting) return;
  isConnecting = true;

  const config = getMongoConfig();

  if (!config.uri) {
    const errMsg = 'No MongoDB URI configured in environment variables (checked MONGODB_URI, MONGO_URI, DATABASE_URL, MONGODB_URL, ATLAS_URI). Please add MONGODB_URI in your Render Dashboard (Web Service -> Environment).';
    lastMongoError = new Error(errMsg);
    isConnectedToMongo = false;
    isConnecting = false;
    console.error(`CRITICAL: [MongoDB] ${errMsg}`);
    scheduleReconnect();
    return;
  }

  try {
    console.log(`[MongoDB] Connecting to MongoDB (${config.foundKey || 'default'}) at: ${config.maskedUri}...`);
    
    // Connect with 15-second timeout and robust pool options
    await mongoose.connect(config.uri, {
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
      socketTimeoutMS: 45000,
    });

    isConnectedToMongo = true;
    lastMongoError = null;
    console.log(`[MongoDB] Connected Successfully to database "${config.dbName}" on host "${config.host}"!`);
    await verifyAndCreateIndexes();

    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
  } catch (err) {
    lastMongoError = err;
    isConnectedToMongo = false;
    console.error(`[MongoDB] Connection failed to ${config.maskedUri}: ${err.message}`);
    
    if (config.isProduction) {
      console.error('[MongoDB] CRITICAL: Running in production environment but could not connect to MongoDB Atlas!');
    } else {
      console.log('[MongoDB] Activating local JSON store fallback for local development.');
    }

    scheduleReconnect();
  } finally {
    isConnecting = false;
  }
};

const scheduleReconnect = () => {
  if (reconnectTimer) return;
  // Retry every 15 seconds in case Atlas or network was temporarily unavailable or env var was updated
  reconnectTimer = setTimeout(() => {
    reconnectTimer = null;
    if (!isConnectedToMongo) {
      console.log('[MongoDB] Attempting reconnection...');
      connectDB();
    }
  }, 15000);
};

// Monitor MongoDB connection events
mongoose.connection.on('disconnected', () => {
  console.warn('[MongoDB] Connection disconnected.');
  isConnectedToMongo = false;
  scheduleReconnect();
});

mongoose.connection.on('connected', () => {
  console.log('[MongoDB] Connection active.');
  isConnectedToMongo = true;
});

mongoose.connection.on('error', (err) => {
  console.error('[MongoDB] Runtime error:', err.message);
  lastMongoError = err;
});

module.exports = {
  connectDB,
  isConnectedToMongo: () => isConnectedToMongo,
  getLastMongoError: () => lastMongoError,
  isTtlIndexVerified: () => ttlIndexVerified,
  getMongoConfig,
  verifyAndCreateIndexes,
  jsonStore
};

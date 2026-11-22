const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

let lastMongoError = null;
let isConnecting = false;

const dataDir = path.join(__dirname, '..', 'data');
const dbFilePath = path.join(dataDir, 'db.json');

// Ensure data directory exists for local dev
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initial fallback database structure (strictly for offline local development)
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
    contactMobile: "+91 63523 66615",
    contactWhatsApp: "+91 63523 66615",
    contactEmail: "info@palitana99yatra.org",
    suratAddress: "શ્રી બેતાલીસ વિશા શ્રીમાળી જૈન ભવન, અડાજણ - પાલ, સુરત, ગુજરાત - 395009",
    palitanaAddress: "શ્રી બેતાલીસ ભવન, તળેટી રોડ, પાલિતાણા, ગુજરાત - 364270",
    registrationOpen: true,
    totalTargetYatrik: 999,
    announcementTicker: "જય જિનેન્દ્ર! શ્રી શત્રુંજય ગિરિરાજ ૯૯ યાત્રા માટે ઓનલાઈન રજીસ્ટ્રેશન શરૂ થઈ ગયેલ છે. વહેલા તે પહેલાના ધોરણે પોતાનું નામ નોંધાવો."
  }
};

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

const safeDecode = (str) => {
  if (!str) return '';
  try {
    return decodeURIComponent(str);
  } catch (_) {
    return str;
  }
};

const safeEncode = (str) => {
  if (!str) return '';
  return encodeURIComponent(safeDecode(str));
};

// Robust URI parser that automatically repairs unencoded password special characters (like @),
// removes accidental documentation angle brackets (<password>, <cluster>), and ensures query params.
const parseAndFixMongoUri = (rawUri) => {
  if (!rawUri || typeof rawUri !== 'string' || !rawUri.includes('://')) {
    return { uri: rawUri, host: 'invalid', dbName: 'palitana_99_yatra', user: '' };
  }

  let cleaned = rawUri.trim();
  if ((cleaned.startsWith('"') && cleaned.endsWith('"')) || (cleaned.startsWith("'") && cleaned.endsWith("'"))) {
    cleaned = cleaned.slice(1, -1).trim();
  }

  const schemeMatch = cleaned.match(/^(mongodb(?:\+srv)?:\/\/)(.*)$/i);
  if (!schemeMatch) {
    return { uri: cleaned, host: 'custom', dbName: 'palitana_99_yatra', user: '' };
  }

  const scheme = schemeMatch[1].toLowerCase();
  const rest = schemeMatch[2];

  const lastAtIndex = rest.lastIndexOf('@');
  if (lastAtIndex === -1) {
    let hostPart = rest;
    let queryPart = '';
    const qIdx = hostPart.indexOf('?');
    if (qIdx !== -1) {
      queryPart = hostPart.substring(qIdx);
      hostPart = hostPart.substring(0, qIdx);
    }
    const slashIdx = hostPart.indexOf('/');
    let host = slashIdx !== -1 ? hostPart.substring(0, slashIdx) : hostPart;
    let dbName = slashIdx !== -1 ? hostPart.substring(slashIdx + 1) : '';
    host = host.replace(/^<+|>+$/g, '').trim();
    dbName = (dbName || 'palitana_99_yatra').replace(/^<+|>+$/g, '').trim();
    const fixedUri = `${scheme}${host}/${dbName}${queryPart}`;
    return { uri: fixedUri, host, dbName, user: '' };
  }

  const credPart = rest.substring(0, lastAtIndex);
  const hostAndRest = rest.substring(lastAtIndex + 1);

  const firstColon = credPart.indexOf(':');
  let username = firstColon !== -1 ? credPart.substring(0, firstColon) : credPart;
  let password = firstColon !== -1 ? credPart.substring(firstColon + 1) : '';

  username = username.replace(/^<+|>+$/g, '').trim();
  password = password.replace(/^<+|>+$/g, '').trim();

  let hostPart = hostAndRest;
  let queryPart = '';
  const qIdx = hostPart.indexOf('?');
  if (qIdx !== -1) {
    queryPart = hostPart.substring(qIdx);
    hostPart = hostPart.substring(0, qIdx);
  }

  const slashIdx = hostPart.indexOf('/');
  let host = slashIdx !== -1 ? hostPart.substring(0, slashIdx) : hostPart;
  let dbName = slashIdx !== -1 ? hostPart.substring(slashIdx + 1) : '';

  host = host.replace(/^<+|>+$/g, '').trim();
  dbName = (dbName || 'palitana_99_yatra').replace(/^<+|>+$/g, '').trim();

  const encodedUser = safeEncode(username);
  const encodedPass = safeEncode(password);

  let fixedUri = `${scheme}${encodedUser}`;
  if (encodedPass) {
    fixedUri += `:${encodedPass}`;
  }
  fixedUri += `@${host}`;
  if (dbName) {
    fixedUri += `/${dbName}`;
  }
  if (queryPart) {
    fixedUri += queryPart;
  } else if (scheme.includes('+srv') && !dbName.includes('?')) {
    fixedUri += '?retryWrites=true&w=majority';
  }

  return { uri: fixedUri, host, dbName, user: username };
};

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

  const isProduction = process.env.NODE_ENV === 'production' || Boolean(process.env.RENDER);
  
  if (!rawUri && !isProduction) {
    rawUri = 'mongodb://127.0.0.1:27017/palitana_99_yatra';
  }

  const parsed = parseAndFixMongoUri(rawUri);
  const uri = parsed.uri || '';
  const maskedUri = uri ? uri.replace(/:([^:@]+)@/, ':****@') : 'none';

  return {
    uri,
    rawUri,
    maskedUri,
    foundKey,
    hasUri: Boolean(rawUri),
    host: parsed.host || 'not-configured',
    dbName: parsed.dbName || 'palitana_99_yatra',
    user: parsed.user || '',
    isProduction
  };
};

// Check if persistent database is strictly enforced
const isPersistentDbEnforced = () => {
  return process.env.NODE_ENV === 'production' || Boolean(process.env.RENDER) || Boolean(process.env.MONGODB_URI);
};

// Check if currently connected to MongoDB
const isConnectedToMongo = () => {
  return mongoose.connection.readyState === 1;
};

// Fallback to local JSON is ONLY allowed in offline development when no MONGODB_URI is configured
const canUseFallback = () => {
  return !isPersistentDbEnforced() && !isConnectedToMongo();
};

const maskUri = (uri) => {
  if (!uri) return '';
  return uri.replace(/:([^:@]+)@/, ':****@');
};

const connectDB = async () => {
  if (isConnecting) return;
  isConnecting = true;

  const config = getMongoConfig();

  if (!config.uri) {
    const errMsg = 'No MongoDB URI configured in environment variables. Add MONGODB_URI in Render Dashboard (Web Service -> Environment).';
    lastMongoError = new Error(errMsg);
    isConnecting = false;
    if (isPersistentDbEnforced()) {
      console.error('================================================================');
      console.error(`CRITICAL CONFIGURATION ERROR: ${errMsg}`);
      console.error('In production, persistent MongoDB Atlas is mandatory. Local JSON fallback is DISABLED.');
      console.error('================================================================');
    } else {
      console.warn('[DEV] No MONGODB_URI defined. Using local JSON store for offline development.');
    }
    return;
  }

  try {
    console.log(`Connecting to MongoDB Atlas at: ${maskUri(config.uri)}...`);
    
    // 10-second server selection timeout allows reliable initial handshake across cloud containers
    await mongoose.connect(config.uri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });

    lastMongoError = null;
    isConnecting = false;
    console.log('MongoDB Atlas Connected Successfully! readyState:', mongoose.connection.readyState);

    // Safeguard: Drop legacy TTL index if it exists in MongoDB Atlas to ensure registrations NEVER expire
    try {
      const regCollection = mongoose.connection.collection('registrations');
      const existingIndexes = await regCollection.indexes();
      const ttlIdx = existingIndexes.find(idx => idx.name === 'expiresAt_1' || (idx.key && idx.key.expiresAt));
      if (ttlIdx) {
        await regCollection.dropIndex(ttlIdx.name);
        console.log(`[Database Migration] Successfully dropped legacy TTL index "${ttlIdx.name}". Registrations are now permanently preserved in MongoDB Atlas.`);
      }
    } catch (dropErr) {
      // Collection may not exist yet on fresh cluster or index already dropped
    }
  } catch (err) {
    lastMongoError = err;
    isConnecting = false;

    console.error('================================================================');
    console.error('CRITICAL DATABASE ERROR: Failed to connect to MongoDB Atlas!');
    console.error(`Target URI: ${maskUri(config.uri)}`);
    console.error(`Error Name: ${err.name}`);
    console.error(`Error Message: ${err.message}`);
    if (err.code) console.error(`Error Code: ${err.code}`);
    console.error('----------------------------------------------------------------');
    console.error('TROUBLESHOOTING CHECKLIST FOR RENDER & MONGODB ATLAS:');
    console.error('1. Network Access: Ensure MongoDB Atlas IP Access List contains 0.0.0.0/0 (required for Render dynamic IPs).');
    console.error('2. Database User: Verify username and password in MONGODB_URI. If the password has special characters, ensure they are URL-encoded.');
    console.error('3. Render Env: Verify MONGODB_URI is correctly saved in Render Dashboard -> Environment.');
    console.error('================================================================');

    if (isPersistentDbEnforced()) {
      console.error('PROD ALERT: Local JSON fallback is DISABLED to prevent silent data loss upon container spindown.');
    } else {
      console.warn('[DEV] Falling back to local JSON store for local debugging.');
    }
  }
};

// Global Mongoose connection event listeners
mongoose.connection.on('connected', () => {
  lastMongoError = null;
  console.log('[Mongoose Event] Connected to MongoDB Atlas.');
});

mongoose.connection.on('error', (err) => {
  lastMongoError = err;
  console.error('[Mongoose Event] Runtime error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.warn('[Mongoose Event] Disconnected from MongoDB Atlas.');
});

module.exports = {
  connectDB,
  isConnectedToMongo,
  canUseFallback,
  isPersistentDbEnforced,
  getLastMongoError: () => lastMongoError,
  getMongoConfig,
  jsonStore
};

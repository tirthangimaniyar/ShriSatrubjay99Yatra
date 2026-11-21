const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

let isConnectedToMongo = false;
let lastMongoError = null;
let ttlIndexVerified = false;

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

const verifyAndCreateIndexes = async () => {
  try {
    const Registration = require('../models/Registration');
    // Ensure TTL index exists on expiresAt with expireAfterSeconds: 0
    await Registration.collection.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0, background: true });
    
    const indexes = await Registration.collection.indexes();
    const ttlIdx = indexes.find(idx => idx.key && idx.key.expiresAt !== undefined && idx.expireAfterSeconds === 0);
    if (ttlIdx) {
      ttlIndexVerified = true;
      console.log('MongoDB TTL Index on expiresAt (expireAfterSeconds: 0) verified successfully in database!');
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
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/palitana_99_yatra';
  const maskedUri = uri.replace(/:([^:@]+)@/, ':****@');

  try {
    console.log(`Connecting to MongoDB at: ${maskedUri}...`);
    // Connect with a 15-second server selection timeout to handle Atlas DNS and TLS handshakes
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000,
    });
    isConnectedToMongo = true;
    lastMongoError = null;
    console.log('MongoDB Connected Successfully to real database!');
    await verifyAndCreateIndexes();
  } catch (err) {
    lastMongoError = err;
    console.warn(`MongoDB connection failed: ${err.message}`);
    if (process.env.NODE_ENV === 'production' || process.env.RENDER) {
      console.error('CRITICAL: Running in production environment but could not connect to MongoDB Atlas!');
    } else {
      console.log('Activating local JSON store fallback for local development.');
    }
    isConnectedToMongo = false;
  }
};

// Monitor MongoDB connection events
mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected.');
  isConnectedToMongo = false;
});

mongoose.connection.on('connected', () => {
  console.log('MongoDB connection active.');
  isConnectedToMongo = true;
});

module.exports = {
  connectDB,
  isConnectedToMongo: () => isConnectedToMongo,
  getLastMongoError: () => lastMongoError,
  isTtlIndexVerified: () => ttlIndexVerified,
  verifyAndCreateIndexes,
  jsonStore
};

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

let isConnectedToMongo = false;

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

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/palitana_99_yatra';

  try {
    console.log(`Connecting to MongoDB at: ${uri}...`);
    // Connect with a 2-second server selection timeout to avoid blocking
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000,
    });
    isConnectedToMongo = true;
    console.log('MongoDB Connected Successfully to real database!');
  } catch (err) {
    console.warn('MongoDB connection failed or daemon not running.');
    console.log('Seamlessly activating persistent high-performance Local Database Engine.');
    isConnectedToMongo = false;
  }
};

module.exports = {
  connectDB,
  isConnectedToMongo: () => isConnectedToMongo,
  jsonStore
};

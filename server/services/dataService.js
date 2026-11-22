const bcrypt = require('bcryptjs');
const { isConnectedToMongo, canUseFallback, jsonStore } = require('../config/db');
const Admin = require('../models/Admin');
const Registration = require('../models/Registration');
const Gallery = require('../models/Gallery');
const Announcement = require('../models/Announcement');
const Setting = require('../models/Setting');

// Default initial seed data
const defaultGallery = [
  {
    title: "શ્રી શત્રુંજય ગિરિરાજ દર્શન - પાલિતાણા",
    gujaratiTitle: "શ્રી શત્રુંજય મહાતીર્થ ગિરિરાજ સમગ્ર દર્શન",
    category: "Palitana Giriraj",
    imageUrl: "/images/gallery/palitana-panoramic.jpg",
    description: "શાશ્વત ગિરિરાજ પર સ્થિત દેવવિમાન સમાન પાવન જિનાલયોની નયનરમ્ય હારમાળા.",
    isFeatured: true,
    order: 1
  },
  {
    name: "દાદા આદેશ્વર ભગવાન સોનાના શૃંગારમાં",
    title: "શ્રી આદિનાથ ભગવાન - મૂળનાયક શ્રી શત્રુંજય",
    gujaratiTitle: "મૂળનાયક શ્રી આદિનાથ દાદા ભવ્ય સુવર્ણ આંગી દર્શન",
    category: "Tirthankar Idols",
    imageUrl: "/images/hero-idol.png",
    description: "શ્રી શત્રુંજય ગિરિરાજના અધિષ્ઠાયક દેવ પ્રથમ તીર્થંકર શ્રી ઋષભદેવ (આદિનાથ) ભગવાન.",
    isFeatured: true,
    order: 2
  },
  {
    title: "પૂજ્ય પ્રભુજી ફૂલ અને દીપકના અલૌકિક શણગારમાં",
    gujaratiTitle: "તીર્થંકર પરમાત્મા દિવ્ય પુષ્પ અને દીપ શણગાર દર્શન",
    category: "Tirthankar Idols",
    imageUrl: "/images/dada-idol.jpeg",
    description: "હજારો શ્વેત અને રક્ત પુષ્પોની માળા વચ્ચે ઝગમગતા દીવડાઓ સાથે પરમાત્માની ભક્તિ.",
    isFeatured: true,
    order: 3
  },
  {
    title: "અદ્ભુત આરસની કોતરણી અને કલાકૃતિ",
    gujaratiTitle: "જિનાલય સ્થાપત્ય અને અજોડ શિલ્પકળા",
    category: "Derasar Architecture",
    imageUrl: "/images/gallery/marble-carvings-derasar.jpg",
    description: "શ્રી શત્રુંજય ગિરિરાજ પર આવેલા દેરાસરોની વિશ્વવિખ્યાત આરસ શિલ્પકળા.",
    isFeatured: false,
    order: 4
  },
  {
    title: "શત્રુંજય ગિરિરાજ સૂર્યોદય વેળા",
    gujaratiTitle: "શાશ્વતા ગિરિના પથ પર પ્રભાત વંદના",
    category: "Palitana Giriraj",
    imageUrl: "/images/gallery/shatrunjay-mountain-sunrise.jpg",
    description: "પ્રાતઃકાળે ગિરિરાજની યાત્રા કરતા ભાવિક ભક્તોનો ભક્તિભાવ.",
    isFeatured: false,
    order: 5
  },
  {
    title: "ગગનચુંબી જિનાલય શિખરો",
    gujaratiTitle: "પાવન જિનમંદિર શિખર અને ધ્વજાદંડ",
    category: "Derasar Architecture",
    imageUrl: "/images/gallery/temple-spires-shikhara.jpg",
    description: "આકાશને આંબતા ભવ્ય શિખરો અને ફરફરતી પવિત્ર ધજાઓ.",
    isFeatured: false,
    order: 6
  },
  {
    title: "ગિરિરાજ ચઢાણના પવિત્ર પગથિયાં",
    gujaratiTitle: "યાત્રા માર્ગ - ભક્તિ અને તપશ્ચર્યાના સોપાન",
    category: "Yatra Path",
    imageUrl: "/images/gallery/sacred-pilgrimage-steps.jpg",
    description: "દરેક પગલે કર્મની નિર્જરા કરાવતા પાલિતાણા ગિરિરાજના ૩૮૦૦ થી વધુ પગથિયાં.",
    isFeatured: false,
    order: 7
  },
  {
    title: "ભાવિકોની આરાધના અને જાપ",
    gujaratiTitle: "નવ્વાણુ યાત્રા દરમિયાન સામુહિક આરાધના",
    category: "Religious Ceremonies",
    imageUrl: "/images/gallery/devotees-ceremony-aaradhna.jpg",
    description: "૯૯ યાત્રા દરમિયાન ભક્તિભાવ સાથે ચૈત્યવંદન અને નવકાર મહામંત્ર જાપ.",
    isFeatured: false,
    order: 8
  }
];

const defaultAnnouncements = [
  {
    title: "૯૯ યાત્રા અને છ'રી પાલિત સંઘ ઓનલાઇન રજીસ્ટ્રેશન શરૂ",
    gujaratiTitle: "શ્રી શત્રુંજય ગિરિરાજ ૯૯ યાત્રા ઓનલાઇન રજીસ્ટ્રેશન",
    content: "Shri Betalisi Visa Shrimali Jain Samaj announces open online registrations for Shri Shatrunjay Giriraj 99 Yatra. Devotees are requested to register promptly.",
    gujaratiContent: "પરમ પૂજ્ય આચાર્ય ભગવંતોની પાવન નિશ્રામાં યોજાનાર ૯૯ યાત્રા માટે રજીસ્ટ્રેશન ખુલ્લું મુકવામાં આવેલ છે. સીટો મર્યાદિત હોવાથી સત્વરે નોંધણી કરાવવી.",
    type: "announcement",
    isActive: true,
    displayDate: "નવેમ્બર ૨૦૨૬"
  },
  {
    title: "નિશ્રા દાતા પૂજ્ય આચાર્ય ભગવંતોની પાવન ઉપસ્થિતિ",
    gujaratiTitle: "પ.પૂ.આ.ભ. શ્રી જગતચંદ્રસૂરીશ્વરજી તથા શ્રી જીનેશરત્નસૂરીશ્વરજી મ.સા.",
    content: "Under the divine guidance and Nishra of Acharya Bhagwants and all Sadhu-Sadhviji Bhagwants.",
    gujaratiContent: "પૂ. રામસૂરિ મ.સા. ના શિષ્યરત્ન પ.પૂ.આ.ભ. શ્રી જગતચંદ્રસૂરીશ્વરજી મ.સા. તથા દીક્ષા દાનેશ્વરી પૂ. ગુણરત્નસૂરિ મ.સા. ના શિષ્યરત્ન પ.પૂ.આ.ભ. શ્રી જીનેશરત્નસૂરીશ્વરજી મ.સા. તથા સમાજના સર્વે સાધુ સાધ્વી ભગવંતો પધારશે.",
    type: "important",
    isActive: true,
    displayDate: "આશીર્વાદ"
  },
  {
    title: "મુખ્ય લાભાર્થી પરિવારોની ઉદાર ભાવના",
    gujaratiTitle: "૯૯ યાત્રા સહ છ'રી પાલિત સંઘના મુખ્ય લાભાર્થી",
    content: "Matushri Kanchanben Shantilal Shah Family (Eklara-Surat) & Matushri Kantaben Girdharlal Vadilal Shah Family (Tenivada-Surat).",
    gujaratiContent: "માતુશ્રી કંચનબેન શાંતિલાલ શાહ પરિવાર (એકલારા-સુરત) તથા માતુશ્રી કાન્તાબેન ગીરધરલાલ વાડીલાલ શાહ પરિવાર (તેનીવાડા-સુરત) ના હૃદયપૂર્વક અનુમોદના.",
    type: "schedule",
    isActive: true,
    displayDate: "લાભાર્થી દર્શન"
  }
];

// Helper to seed data
async function seedDefaultData() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@palitana99yatra.org';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const adminName = process.env.ADMIN_NAME || 'Palitana Yatra Samiti Admin';

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  if (isConnectedToMongo()) {
    try {
      // Check Admin
      const existingAdmin = await Admin.findOne({ email: adminEmail });
      if (!existingAdmin) {
        await Admin.create({
          name: adminName,
          email: adminEmail,
          password: hashedPassword,
          role: 'superadmin',
        });
        console.log(`Default admin created: ${adminEmail}`);
      }

      // Check Gallery
      const galleryCount = await Gallery.countDocuments();
      if (galleryCount === 0) {
        await Gallery.insertMany(defaultGallery);
        console.log('Default gallery seeded to MongoDB.');
      }

      // Check Announcements
      const announcementCount = await Announcement.countDocuments();
      if (announcementCount === 0) {
        await Announcement.insertMany(defaultAnnouncements);
        console.log('Default announcements seeded to MongoDB.');
      }

      // Check Setting
      const settingCount = await Setting.countDocuments();
      if (settingCount === 0) {
        await Setting.create({});
        console.log('Default settings seeded to MongoDB.');
      }
    } catch (err) {
      console.error('Error seeding MongoDB:', err.message);
    }
  } else if (canUseFallback()) {
    // Local JSON store strictly for offline local development
    const db = jsonStore.read();
    let modified = false;

    // Check Admin
    const adminIdx = db.admins.findIndex(a => a.email === adminEmail);
    if (adminIdx === -1) {
      db.admins.push({
        _id: 'admin_' + Date.now(),
        name: adminName,
        email: adminEmail,
        password: hashedPassword,
        role: 'superadmin',
        createdAt: new Date().toISOString()
      });
      modified = true;
      console.log(`Default admin seeded in JSON store: ${adminEmail}`);
    }

    // Check Gallery
    if (!db.gallery || db.gallery.length === 0) {
      db.gallery = defaultGallery.map((g, idx) => ({
        _id: 'gal_' + (idx + 1),
        ...g,
        createdAt: new Date().toISOString()
      }));
      modified = true;
      console.log('Default gallery seeded in JSON store.');
    }

    // Check Announcements
    if (!db.announcements || db.announcements.length === 0) {
      db.announcements = defaultAnnouncements.map((a, idx) => ({
        _id: 'ann_' + (idx + 1),
        ...a,
        createdAt: new Date().toISOString()
      }));
      modified = true;
      console.log('Default announcements seeded in JSON store.');
    }

    if (modified) {
      jsonStore.write(db);
    }
  } else {
    console.warn('[SEED NOTICE] Persistent MongoDB Atlas enforced. Local JSON seeding disabled to protect production data.');
  }
}

// Generate human-friendly strictly Unique Registration ID: e.g., 99YATRA-2027-1001
function generateRegistrationId(allRegistrations = []) {
  const currentYear = 2027; // Yatra year
  let maxSeq = 1000;

  if (Array.isArray(allRegistrations)) {
    allRegistrations.forEach(r => {
      if (r && r.registrationId) {
        const parts = r.registrationId.split('-');
        const lastPart = parts[parts.length - 1];
        const num = parseInt(lastPart, 10);
        if (!isNaN(num) && num > maxSeq) {
          maxSeq = num;
        }
      }
    });
  }

  const nextSeq = maxSeq + 1;
  return `99YATRA-${currentYear}-${nextSeq}`;
}

module.exports = {
  seedDefaultData,
  generateRegistrationId,
  defaultGallery,
  defaultAnnouncements
};

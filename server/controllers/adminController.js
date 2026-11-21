const { isConnectedToMongo, jsonStore } = require('../config/db');
const Registration = require('../models/Registration');

// GET /api/admin/dashboard (Comprehensive Dynamic Statistics - Excludes Expired Records)
exports.getDashboardStats = async (req, res) => {
  try {
    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activeFilter = { expiresAt: { $gt: now } };

    if (isConnectedToMongo()) {
      const [
        totalRegistrations,
        pendingRegistrations,
        confirmedRegistrations,
        cancelledRegistrations,
        waitlistRegistrations,
        todayRegistrations,
        recentRegistrations,
        allRegs
      ] = await Promise.all([
        Registration.countDocuments(activeFilter),
        Registration.countDocuments({ ...activeFilter, status: 'Pending' }),
        Registration.countDocuments({ ...activeFilter, status: 'Confirmed' }),
        Registration.countDocuments({ ...activeFilter, status: { $in: ['Cancelled', 'Rejected'] } }),
        Registration.countDocuments({ ...activeFilter, status: 'Waitlist' }),
        Registration.countDocuments({ ...activeFilter, createdAt: { $gte: today } }),
        Registration.find(activeFilter).sort({ createdAt: -1 }).limit(8),
        Registration.find(activeFilter).select('totalParticipants city registrationCategory doliAssistanceRequired')
      ]);

      const totalParticipants = allRegs.reduce((acc, curr) => acc + (curr.totalParticipants || 1), 0);
      const doliRequests = allRegs.filter(r => r.doliAssistanceRequired).length;

      // Group by City
      const cityCounts = {};
      allRegs.forEach(r => {
        const c = r.city || 'Other';
        cityCounts[c] = (cityCounts[c] || 0) + 1;
      });
      const topCities = Object.entries(cityCounts)
        .map(([city, count]) => ({ city, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Group by Category
      const categoryCounts = {};
      allRegs.forEach(r => {
        const cat = r.registrationCategory || 'Other';
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
      });

      return res.json({
        success: true,
        stats: {
          totalRegistrations,
          totalParticipants,
          todayRegistrations,
          pendingRegistrations,
          confirmedRegistrations,
          cancelledRegistrations,
          waitlistRegistrations,
          doliRequests,
          topCities,
          categoryCounts,
          recentRegistrations
        }
      });
    } else {
      const db = jsonStore.read();
      const regs = (db.registrations || []).filter(r => r.expiresAt && new Date(r.expiresAt) > now);

      const totalRegistrations = regs.length;
      const totalParticipants = regs.reduce((sum, r) => sum + (r.totalParticipants || 1), 0);
      const pendingRegistrations = regs.filter(r => r.status === 'Pending').length;
      const confirmedRegistrations = regs.filter(r => r.status === 'Confirmed').length;
      const cancelledRegistrations = regs.filter(r => r.status === 'Cancelled' || r.status === 'Rejected').length;
      const waitlistRegistrations = regs.filter(r => r.status === 'Waitlist').length;
      const doliRequests = regs.filter(r => r.doliAssistanceRequired).length;

      const todayIso = today.toISOString().slice(0, 10);
      const todayRegistrations = regs.filter(r => (r.createdAt || '').slice(0, 10) === todayIso).length;

      const cityCounts = {};
      regs.forEach(r => {
        const c = r.city || 'Other';
        cityCounts[c] = (cityCounts[c] || 0) + 1;
      });
      const topCities = Object.entries(cityCounts)
        .map(([city, count]) => ({ city, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      const categoryCounts = {};
      regs.forEach(r => {
        const cat = r.registrationCategory || 'Other';
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
      });

      const recentRegistrations = regs.slice(0, 8);

      return res.json({
        success: true,
        stats: {
          totalRegistrations,
          totalParticipants,
          todayRegistrations,
          pendingRegistrations,
          confirmedRegistrations,
          cancelledRegistrations,
          waitlistRegistrations,
          doliRequests,
          topCities,
          categoryCounts,
          recentRegistrations
        }
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/admin/db-status (Detailed Production MongoDB Atlas & TTL Index Verification)
exports.getDbStatus = async (req, res) => {
  try {
    const { isConnectedToMongo, getLastMongoError, isTtlIndexVerified, getMongoConfig } = require('../config/db');
    let indexes = [];
    let activeRegistrations = 0;
    let totalInDb = 0;

    if (isConnectedToMongo()) {
      indexes = await Registration.collection.indexes();
      const now = new Date();
      activeRegistrations = await Registration.countDocuments({ expiresAt: { $gt: now } });
      totalInDb = await Registration.countDocuments();
    }

    const mongoConfig = getMongoConfig ? getMongoConfig() : { hasUri: Boolean(process.env.MONGODB_URI), uri: process.env.MONGODB_URI || '', host: 'unknown' };

    res.json({
      success: true,
      database: {
        connected: isConnectedToMongo(),
        hasMongoUri: mongoConfig.hasUri,
        envKeyFound: mongoConfig.foundKey,
        uriType: mongoConfig.uri.startsWith('mongodb+srv') ? 'mongodb+srv' : (mongoConfig.uri ? 'mongodb' : 'none'),
        uriHost: mongoConfig.host,
        databaseName: mongoConfig.dbName,
        ttlIndexVerified: isTtlIndexVerified(),
        lastError: getLastMongoError() ? getLastMongoError().message : null,
        activeRegistrations,
        totalInDb,
        indexes
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

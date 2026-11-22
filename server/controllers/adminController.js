const { isConnectedToMongo, canUseFallback, jsonStore } = require('../config/db');
const Registration = require('../models/Registration');

// GET /api/admin/dashboard (Comprehensive Dynamic Statistics - All Permanent Records)
exports.getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

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
        Registration.countDocuments(),
        Registration.countDocuments({ status: 'Pending' }),
        Registration.countDocuments({ status: 'Confirmed' }),
        Registration.countDocuments({ status: { $in: ['Cancelled', 'Rejected'] } }),
        Registration.countDocuments({ status: 'Waitlist' }),
        Registration.countDocuments({ createdAt: { $gte: today } }),
        Registration.find().sort({ createdAt: -1 }).limit(8),
        Registration.find().select('totalParticipants city registrationCategory doliAssistanceRequired')
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
    } else if (canUseFallback()) {
      const db = jsonStore.read();
      const regs = db.registrations || [];

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
    } else {
      return res.status(503).json({ success: false, message: 'Database service is temporarily unavailable.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/admin/db-status (Detailed Production MongoDB Atlas Verification)
exports.getDbStatus = async (req, res) => {
  try {
    const { isConnectedToMongo, getLastMongoError, getMongoConfig } = require('../config/db');
    let indexes = [];
    let totalInDb = 0;

    if (isConnectedToMongo()) {
      indexes = await Registration.collection.indexes();
      totalInDb = await Registration.countDocuments();
    }

    const mongoConfig = getMongoConfig ? getMongoConfig() : { hasUri: Boolean(process.env.MONGODB_URI), uri: process.env.MONGODB_URI || '', host: 'unknown' };

    const lastErr = getLastMongoError() ? getLastMongoError().message : null;
    let atlasDiagnosis = null;
    if (!mongoConfig.hasUri) {
      atlasDiagnosis = 'No MongoDB URI found in environment variables. Add MONGODB_URI in Render Dashboard (Web Service -> Environment).';
    } else if (lastErr && lastErr.includes('SSL alert number 80')) {
      atlasDiagnosis = 'MongoDB Atlas rejected the connection because the connecting IP is not whitelisted. In MongoDB Atlas (cloud.mongodb.com) -> Security -> Network Access, add IP "0.0.0.0/0" (Allow Access from Anywhere). Render containers have dynamic IPs, so 0.0.0.0/0 is required.';
    } else if (lastErr && lastErr.includes('EBADNAME')) {
      atlasDiagnosis = 'Cluster hostname in connection string could not be resolved by DNS.';
    } else if (lastErr && lastErr.includes('bad auth')) {
      atlasDiagnosis = 'Database username or password is incorrect. Verify user credentials in MongoDB Atlas Database Access.';
    }

    res.json({
      success: true,
      database: {
        connected: isConnectedToMongo(),
        hasMongoUri: mongoConfig.hasUri,
        envKeyFound: mongoConfig.foundKey,
        uriType: mongoConfig.uri.startsWith('mongodb+srv') ? 'mongodb+srv' : (mongoConfig.uri ? 'mongodb' : 'none'),
        uriHost: mongoConfig.host,
        databaseName: mongoConfig.dbName,
        lastError: lastErr,
        diagnosis: atlasDiagnosis,
        totalRegistrations: totalInDb,
        indexes
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

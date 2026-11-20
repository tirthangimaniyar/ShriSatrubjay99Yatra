const { isConnectedToMongo, jsonStore } = require('../config/db');
const Registration = require('../models/Registration');

// GET /api/admin/dashboard (Comprehensive Dynamic Statistics)
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
    } else {
      const db = jsonStore.read();
      const regs = db.registrations;

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

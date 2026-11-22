const { isConnectedToMongo, canUseFallback, jsonStore } = require('../config/db');
const Announcement = require('../models/Announcement');

// GET /api/announcements
exports.getAnnouncements = async (req, res) => {
  try {
    const { all } = req.query;

    if (isConnectedToMongo()) {
      const query = all === 'true' ? {} : { isActive: true };
      const items = await Announcement.find(query).sort({ createdAt: -1 });
      return res.json({ success: true, announcements: items });
    } else if (canUseFallback()) {
      const db = jsonStore.read();
      let list = db.announcements || [];
      if (all !== 'true') {
        list = list.filter(a => a.isActive);
      }
      return res.json({ success: true, announcements: list });
    } else {
      return res.status(503).json({ success: false, message: 'Database service is temporarily unavailable.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/announcements (Admin only)
exports.createAnnouncement = async (req, res) => {
  try {
    const { title, gujaratiTitle, content, gujaratiContent, type, displayDate } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Title and content are required.' });
    }

    if (isConnectedToMongo()) {
      const item = await Announcement.create({
        title,
        gujaratiTitle: gujaratiTitle || '',
        content,
        gujaratiContent: gujaratiContent || '',
        type: type || 'announcement',
        displayDate: displayDate || 'નવી સૂચના',
        isActive: true
      });
      return res.status(201).json({ success: true, message: 'Announcement created successfully', announcement: item });
    } else if (canUseFallback()) {
      const db = jsonStore.read();
      if (!db.announcements) db.announcements = [];

      const item = {
        _id: 'ann_' + Date.now(),
        title,
        gujaratiTitle: gujaratiTitle || '',
        content,
        gujaratiContent: gujaratiContent || '',
        type: type || 'announcement',
        displayDate: displayDate || 'નવી સૂચના',
        isActive: true,
        createdAt: new Date().toISOString()
      };

      db.announcements.unshift(item);
      jsonStore.write(db);

      return res.status(201).json({ success: true, message: 'Announcement created successfully', announcement: item });
    } else {
      return res.status(503).json({ success: false, message: 'Database service is temporarily unavailable.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/announcements/:id (Admin only)
exports.updateAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (isConnectedToMongo()) {
      const item = await Announcement.findByIdAndUpdate(id, updateData, { new: true });
      if (!item) return res.status(404).json({ success: false, message: 'Announcement not found' });
      return res.json({ success: true, message: 'Announcement updated', announcement: item });
    } else if (canUseFallback()) {
      const db = jsonStore.read();
      const idx = (db.announcements || []).findIndex(a => a._id === id);
      if (idx === -1) return res.status(404).json({ success: false, message: 'Announcement not found' });

      db.announcements[idx] = { ...db.announcements[idx], ...updateData };
      jsonStore.write(db);
      return res.json({ success: true, message: 'Announcement updated', announcement: db.announcements[idx] });
    } else {
      return res.status(503).json({ success: false, message: 'Database service is temporarily unavailable.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/announcements/:id (Admin only)
exports.deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;

    if (isConnectedToMongo()) {
      const deleted = await Announcement.findByIdAndDelete(id);
      if (!deleted) return res.status(404).json({ success: false, message: 'Announcement not found' });
      return res.json({ success: true, message: 'Announcement deleted successfully' });
    } else if (canUseFallback()) {
      const db = jsonStore.read();
      const idx = (db.announcements || []).findIndex(a => a._id === id);
      if (idx === -1) return res.status(404).json({ success: false, message: 'Announcement not found' });

      db.announcements.splice(idx, 1);
      jsonStore.write(db);
      return res.json({ success: true, message: 'Announcement deleted successfully' });
    } else {
      return res.status(503).json({ success: false, message: 'Database service is temporarily unavailable.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

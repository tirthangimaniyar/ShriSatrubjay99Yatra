const { isConnectedToMongo, jsonStore } = require('../config/db');
const Setting = require('../models/Setting');

// GET /api/settings
exports.getSettings = async (req, res) => {
  try {
    if (isConnectedToMongo()) {
      let setting = await Setting.findOne();
      if (!setting) {
        setting = await Setting.create({});
      }
      return res.json({ success: true, settings: setting });
    } else {
      const db = jsonStore.read();
      return res.json({ success: true, settings: db.settings });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/settings (Admin only)
exports.updateSettings = async (req, res) => {
  try {
    const updateData = req.body;
    updateData.updatedAt = new Date();

    if (isConnectedToMongo()) {
      let setting = await Setting.findOne();
      if (!setting) {
        setting = await Setting.create(updateData);
      } else {
        setting = await Setting.findByIdAndUpdate(setting._id, updateData, { new: true });
      }
      return res.json({ success: true, message: 'Website settings updated successfully', settings: setting });
    } else {
      const db = jsonStore.read();
      db.settings = { ...db.settings, ...updateData };
      jsonStore.write(db);
      return res.json({ success: true, message: 'Website settings updated successfully', settings: db.settings });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

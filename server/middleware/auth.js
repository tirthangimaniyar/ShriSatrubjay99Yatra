const jwt = require('jsonwebtoken');
const { isConnectedToMongo, canUseFallback, jsonStore } = require('../config/db');
const Admin = require('../models/Admin');

const authenticateAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication token is missing. Please log in as administrator.'
      });
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'shri_shatrunjay_palitana_99_yatra_super_secure_jwt_secret_key_2027';

    let decoded;
    try {
      decoded = jwt.verify(token, secret);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token. Please log in again.'
      });
    }

    // Find admin user
    if (isConnectedToMongo()) {
      const admin = await Admin.findById(decoded.id).select('-password');
      if (!admin) {
        return res.status(401).json({
          success: false,
          message: 'Admin account not found or has been revoked.'
        });
      }
      req.user = admin;
    } else if (canUseFallback()) {
      const db = jsonStore.read();
      const admin = db.admins.find(a => a._id === decoded.id || a.email === decoded.email);
      if (!admin) {
        return res.status(401).json({
          success: false,
          message: 'Admin account not found.'
        });
      }
      const { password, ...adminWithoutPassword } = admin;
      req.user = adminWithoutPassword;
    } else {
      return res.status(503).json({
        success: false,
        message: 'Database service is temporarily unavailable.'
      });
    }

    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Authentication verification failure.'
    });
  }
};

module.exports = {
  authenticateAdmin
};

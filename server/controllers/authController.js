const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { isConnectedToMongo, canUseFallback, jsonStore } = require('../config/db');
const Admin = require('../models/Admin');

const generateToken = (admin) => {
  const secret = process.env.JWT_SECRET || 'shri_shatrunjay_palitana_99_yatra_super_secure_jwt_secret_key_2027';
  return jwt.sign(
    {
      id: admin._id,
      email: admin.email,
      role: admin.role,
      name: admin.name
    },
    secret,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.'
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    if (isConnectedToMongo()) {
      const admin = await Admin.findOne({ email: cleanEmail });
      if (!admin) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email address or credentials.'
        });
      }

      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Incorrect password. Please verify and try again.'
        });
      }

      admin.lastLogin = new Date();
      await admin.save();

      const token = generateToken(admin);

      return res.json({
        success: true,
        message: 'Admin login successful. Jai Jinendra!',
        token,
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          phone: admin.phone,
          lastLogin: admin.lastLogin
        }
      });
    } else if (canUseFallback()) {
      const db = jsonStore.read();
      const admin = db.admins.find(a => a.email.toLowerCase() === cleanEmail);
      if (!admin) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email address or credentials.'
        });
      }

      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Incorrect password. Please verify and try again.'
        });
      }

      admin.lastLogin = new Date().toISOString();
      jsonStore.write(db);

      const token = generateToken(admin);

      return res.json({
        success: true,
        message: 'Admin login successful. Jai Jinendra!',
        token,
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          phone: admin.phone || '',
          lastLogin: admin.lastLogin
        }
      });
    } else {
      return res.status(503).json({
        success: false,
        message: 'Database service is temporarily unavailable. Persistent MongoDB Atlas connection is required.'
      });
    }
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during authentication: ' + error.message
    });
  }
};

// GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    return res.json({
      success: true,
      admin: req.user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/auth/change-password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required.'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters.'
      });
    }

    const newHashed = await bcrypt.hash(newPassword, 10);

    if (isConnectedToMongo()) {
      const admin = await Admin.findById(req.user._id || req.user.id);
      const isMatch = await bcrypt.compare(currentPassword, admin.password);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: 'Current password does not match.'
        });
      }
      admin.password = newHashed;
      await admin.save();
    } else if (canUseFallback()) {
      const db = jsonStore.read();
      const adminIdx = db.admins.findIndex(a => a._id === (req.user._id || req.user.id));
      if (adminIdx === -1) {
        return res.status(404).json({ success: false, message: 'Admin not found.' });
      }
      const isMatch = await bcrypt.compare(currentPassword, db.admins[adminIdx].password);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: 'Current password does not match.'
        });
      }
      db.admins[adminIdx].password = newHashed;
      jsonStore.write(db);
    } else {
      return res.status(503).json({ success: false, message: 'Database service is temporarily unavailable.' });
    }

    res.json({
      success: true,
      message: 'Password changed successfully!'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/auth/register (Create another admin by existing superadmin)
exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const hashedPassword = await bcrypt.hash(password, 10);

    if (isConnectedToMongo()) {
      const existing = await Admin.findOne({ email: cleanEmail });
      if (existing) {
        return res.status(400).json({ success: false, message: 'An admin with this email already exists.' });
      }

      const newAdmin = await Admin.create({
        name,
        email: cleanEmail,
        password: hashedPassword,
        role: role || 'admin',
        phone: phone || ''
      });

      return res.status(201).json({
        success: true,
        message: 'New admin created successfully.',
        admin: { id: newAdmin._id, name: newAdmin.name, email: newAdmin.email, role: newAdmin.role }
      });
    } else if (canUseFallback()) {
      const db = jsonStore.read();
      if (db.admins.some(a => a.email.toLowerCase() === cleanEmail)) {
        return res.status(400).json({ success: false, message: 'An admin with this email already exists.' });
      }

      const newAdmin = {
        _id: 'admin_' + Date.now(),
        name,
        email: cleanEmail,
        password: hashedPassword,
        role: role || 'admin',
        phone: phone || '',
        createdAt: new Date().toISOString()
      };

      db.admins.push(newAdmin);
      jsonStore.write(db);

      return res.status(201).json({
        success: true,
        message: 'New admin created successfully.',
        admin: { id: newAdmin._id, name: newAdmin.name, email: newAdmin.email, role: newAdmin.role }
      });
    } else {
      return res.status(503).json({ success: false, message: 'Database service is temporarily unavailable.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateAdmin } = require('../middleware/auth');

router.get('/dashboard', authenticateAdmin, adminController.getDashboardStats);

module.exports = router;

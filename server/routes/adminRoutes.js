const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateAdmin } = require('../middleware/auth');

router.get('/dashboard', authenticateAdmin, adminController.getDashboardStats);
router.get('/db-status', authenticateAdmin, adminController.getDbStatus);

module.exports = router;

const express = require('express');
const router = express.Router();
const settingController = require('../controllers/settingController');
const { authenticateAdmin } = require('../middleware/auth');

router.get('/', settingController.getSettings);
router.put('/', authenticateAdmin, settingController.updateSettings);

module.exports = router;

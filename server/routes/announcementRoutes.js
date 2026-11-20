const express = require('express');
const router = express.Router();
const announcementController = require('../controllers/announcementController');
const { authenticateAdmin } = require('../middleware/auth');

router.get('/', announcementController.getAnnouncements);
router.post('/', authenticateAdmin, announcementController.createAnnouncement);
router.put('/:id', authenticateAdmin, announcementController.updateAnnouncement);
router.delete('/:id', authenticateAdmin, announcementController.deleteAnnouncement);

module.exports = router;

const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/galleryController');
const { authenticateAdmin } = require('../middleware/auth');

router.get('/', galleryController.getGallery);
router.post('/', authenticateAdmin, galleryController.addGalleryItem);
router.delete('/:id', authenticateAdmin, galleryController.deleteGalleryItem);

module.exports = router;

const { isConnectedToMongo, canUseFallback, jsonStore } = require('../config/db');
const Gallery = require('../models/Gallery');
const { defaultGallery } = require('../services/dataService');

// GET /api/gallery
exports.getGallery = async (req, res) => {
  try {
    const { category } = req.query;

    if (isConnectedToMongo()) {
      const query = category && category !== 'All' ? { category } : {};
      let images = await Gallery.find(query).sort({ order: 1, createdAt: -1 });

      // If Atlas gallery is empty, auto-seed default sacred images so gallery is never blank
      if (images.length === 0) {
        const total = await Gallery.countDocuments();
        if (total === 0 && defaultGallery && defaultGallery.length > 0) {
          try {
            await Gallery.insertMany(defaultGallery);
            images = await Gallery.find(query).sort({ order: 1, createdAt: -1 });
          } catch (seedErr) {
            console.error('Auto-seed gallery error:', seedErr.message);
          }
        }
      }

      // Fallback to default gallery array if still empty
      if (images.length === 0 && defaultGallery) {
        images = (category && category !== 'All')
          ? defaultGallery.filter(img => img.category === category)
          : defaultGallery;
      }

      return res.json({ success: true, count: images.length, images });
    } else if (canUseFallback()) {
      const db = jsonStore.read();
      let list = db.gallery && db.gallery.length > 0 ? db.gallery : defaultGallery;
      if (category && category !== 'All') {
        list = list.filter(img => img.category === category);
      }
      return res.json({ success: true, count: list.length, images: list });
    } else {
      // In production even if Atlas is briefly waking up, return default gallery so users see images
      const list = (category && category !== 'All')
        ? defaultGallery.filter(img => img.category === category)
        : defaultGallery;
      return res.json({ success: true, count: list.length, images: list });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/gallery (Admin only)
exports.addGalleryItem = async (req, res) => {
  try {
    const { title, gujaratiTitle, category, imageUrl, description, isFeatured } = req.body;

    if (!title || !imageUrl) {
      return res.status(400).json({ success: false, message: 'Title and image URL are required.' });
    }

    if (isConnectedToMongo()) {
      const newItem = await Gallery.create({
        title,
        gujaratiTitle: gujaratiTitle || '',
        category: category || 'Palitana Giriraj',
        imageUrl,
        description: description || '',
        isFeatured: Boolean(isFeatured),
        order: 99
      });
      return res.status(201).json({ success: true, message: 'Gallery image added successfully', image: newItem });
    } else if (canUseFallback()) {
      const db = jsonStore.read();
      if (!db.gallery) db.gallery = [];

      const newItem = {
        _id: 'gal_' + Date.now(),
        title,
        gujaratiTitle: gujaratiTitle || '',
        category: category || 'Palitana Giriraj',
        imageUrl,
        description: description || '',
        isFeatured: Boolean(isFeatured),
        order: 99,
        createdAt: new Date().toISOString()
      };

      db.gallery.push(newItem);
      jsonStore.write(db);

      return res.status(201).json({ success: true, message: 'Gallery image added successfully', image: newItem });
    } else {
      return res.status(503).json({ success: false, message: 'Database service is temporarily unavailable.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/gallery/:id (Admin only)
exports.deleteGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;

    if (isConnectedToMongo()) {
      const deleted = await Gallery.findByIdAndDelete(id);
      if (!deleted) return res.status(404).json({ success: false, message: 'Image not found' });
      return res.json({ success: true, message: 'Image deleted from gallery' });
    } else if (canUseFallback()) {
      const db = jsonStore.read();
      if (!db.gallery) return res.status(404).json({ success: false, message: 'Gallery empty' });

      const idx = db.gallery.findIndex(g => g._id === id);
      if (idx === -1) return res.status(404).json({ success: false, message: 'Image not found' });

      db.gallery.splice(idx, 1);
      jsonStore.write(db);
      return res.json({ success: true, message: 'Image deleted from gallery' });
    } else {
      return res.status(503).json({ success: false, message: 'Database service is temporarily unavailable.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

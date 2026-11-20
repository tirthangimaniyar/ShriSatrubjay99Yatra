const mongoose = require('mongoose');

const GallerySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  gujaratiTitle: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    enum: ['Palitana Giriraj', 'Tirthankar Idols', 'Derasar Architecture', 'Religious Ceremonies', 'Yatra Path'],
    default: 'Palitana Giriraj',
  },
  imageUrl: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  order: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Gallery', GallerySchema);

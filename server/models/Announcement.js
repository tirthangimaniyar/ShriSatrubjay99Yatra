const mongoose = require('mongoose');

const AnnouncementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  gujaratiTitle: {
    type: String,
    default: '',
  },
  content: {
    type: String,
    required: true,
  },
  gujaratiContent: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    enum: ['announcement', 'important', 'schedule', 'guideline'],
    default: 'announcement',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  displayDate: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Announcement', AnnouncementSchema);

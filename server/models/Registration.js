const mongoose = require('mongoose');

const FamilyMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  relation: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], default: 'Male' },
  specialNeed: { type: String, default: '' },
});

const RegistrationSchema = new mongoose.Schema({
  registrationId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  // Personal Details
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
  },
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female', 'Other'],
  },
  dateOfBirth: {
    type: String,
    default: '',
  },
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: 1,
    max: 120,
  },
  mobileNumber: {
    type: String,
    required: [true, '10-digit mobile number is required'],
    trim: true,
  },
  whatsappNumber: {
    type: String,
    required: [true, 'WhatsApp number is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Valid email is required'],
    lowercase: true,
    trim: true,
  },
  // Address Details
  fullAddress: {
    type: String,
    required: [true, 'Full address is required'],
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true,
  },
  state: {
    type: String,
    required: [true, 'State is required'],
    default: 'Gujarat',
  },
  pincode: {
    type: String,
    required: [true, '6-digit pincode is required'],
    trim: true,
  },
  // Family Details
  familyName: {
    type: String,
    default: '',
  },
  totalFamilyMembers: {
    type: Number,
    default: 1,
  },
  familyMembers: [FamilyMemberSchema],
  // Yatra Details
  registrationCategory: {
    type: String,
    required: true,
    default: '99 Yatra Devotee (૯૯ યાત્રા યાત્રિક)',
  },
  totalParticipants: {
    type: Number,
    required: true,
    default: 1,
  },
  preferredYatraDate: {
    type: String,
    default: '',
  },
  specialRequirements: {
    type: String,
    default: '',
  },
  emergencyContactNumber: {
    type: String,
    required: [true, 'Emergency contact number is required'],
  },
  emergencyContactName: {
    type: String,
    default: '',
  },
  // Assistance
  hasMedicalNeed: {
    type: Boolean,
    default: false,
  },
  medicalDetails: {
    type: String,
    default: '',
  },
  hasTravelAssistanceNeed: {
    type: Boolean,
    default: false,
  },
  travelDetails: {
    type: String,
    default: '',
  },
  doliAssistanceRequired: {
    type: Boolean,
    default: false,
  },
  additionalNotes: {
    type: String,
    default: '',
  },
  isDeclarationConfirmed: {
    type: Boolean,
    required: true,
    default: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Rejected', 'Cancelled', 'Waitlist'],
    default: 'Pending',
    index: true,
  },
  adminRemarks: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

// MongoDB TTL Index: Automatically expire records when expiresAt has passed
RegistrationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Registration', RegistrationSchema);

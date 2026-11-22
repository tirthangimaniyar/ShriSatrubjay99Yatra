const mongoose = require('mongoose');
const XLSX = require('xlsx');
const { isConnectedToMongo, canUseFallback, jsonStore } = require('../config/db');
const Registration = require('../models/Registration');
const { generateRegistrationId } = require('../services/dataService');

// POST /api/registrations (Devotee Registration)
exports.createRegistration = async (req, res) => {
  try {
    // 0. Ensure persistent database is active before accepting registrations
    if (mongoose.connection.readyState !== 1 && !canUseFallback()) {
      console.error(`[CRITICAL] Registration rejected: MongoDB Atlas is disconnected (readyState: ${mongoose.connection.readyState}).`);
      return res.status(503).json({
        success: false,
        error: 'DatabaseUnavailable',
        dbConnected: false,
        dbState: mongoose.connection.readyState,
        message: 'Database service is temporarily unavailable. To prevent loss of your registration data upon server restart, registration is paused until connection to MongoDB Atlas is active. Please try again in 1–2 minutes.'
      });
    }

    const {
      fullName,
      gender,
      dateOfBirth,
      age,
      mobileNumber,
      whatsappNumber,
      email,
      fullAddress,
      city,
      state,
      pincode,
      familyName,
      familyMembers,
      registrationCategory,
      preferredYatraDate,
      specialRequirements,
      emergencyContactNumber,
      emergencyContactName,
      hasMedicalNeed,
      medicalDetails,
      hasTravelAssistanceNeed,
      travelDetails,
      doliAssistanceRequired,
      additionalNotes,
      isDeclarationConfirmed,
    } = req.body;

    // 1. Validation: Required fields
    if (!fullName || !fullName.trim()) {
      return res.status(400).json({ success: false, message: 'Devotee full name is required.' });
    }
    if (!gender) {
      return res.status(400).json({ success: false, message: 'Please select gender.' });
    }
    if (!age || isNaN(age) || age < 1 || age > 120) {
      return res.status(400).json({ success: false, message: 'Please enter a valid age (1-120).' });
    }
    if (!mobileNumber || !mobileNumber.trim()) {
      return res.status(400).json({ success: false, message: 'Mobile number is required.' });
    }

    // 2. Mobile validation: 10 digit Indian number
    const cleanMobile = mobileNumber.replace(/\D/g, '').slice(-10);
    if (cleanMobile.length !== 10 || !/^[6-9]\d{9}$/.test(cleanMobile)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid 10-digit Indian mobile number.'
      });
    }

    // WhatsApp clean
    const cleanWhatsApp = (whatsappNumber || mobileNumber).replace(/\D/g, '').slice(-10);

    // 3. Email validation
    const cleanEmail = (email || '').toLowerCase().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.'
      });
    }

    // 4. Address validation
    if (!fullAddress || !fullAddress.trim()) {
      return res.status(400).json({ success: false, message: 'Full address is required.' });
    }
    if (!city || !city.trim()) {
      return res.status(400).json({ success: false, message: 'City is required.' });
    }

    // 5. Pincode validation: 6 digits
    const cleanPincode = (pincode || '').replace(/\D/g, '');
    if (cleanPincode.length !== 6) {
      return res.status(400).json({ success: false, message: 'Please provide a valid 6-digit pincode.' });
    }

    // 6. Emergency contact (defaults to devotee's mobile if not provided)
    const rawEmergency = (emergencyContactNumber || '').replace(/\D/g, '').slice(-10);
    const cleanEmergencyMobile = rawEmergency.length === 10 ? rawEmergency : cleanMobile;

    // 7. Declaration check (defaults to true)
    const isConfirmed = isDeclarationConfirmed !== undefined ? Boolean(isDeclarationConfirmed) : true;
    if (!isConfirmed) {
      return res.status(400).json({
        success: false,
        message: 'You must confirm the declaration to complete registration.'
      });
    }

    // Compute participants: Main applicant (1) + valid family members
    const parsedFamilyMembers = Array.isArray(familyMembers) ? familyMembers.filter(m => m && m.name && m.name.trim()) : [];
    const totalParticipants = 1 + parsedFamilyMembers.length;

    const now = new Date();

    // Check duplicate registrations (permanent active records, excluding cancelled)
    if (isConnectedToMongo()) {
      const duplicate = await Registration.findOne({
        $or: [
          { mobileNumber: cleanMobile },
          { email: cleanEmail }
        ],
        status: { $ne: 'Cancelled' }
      });

      if (duplicate) {
        return res.status(409).json({
          success: false,
          isDuplicate: true,
          message: `A registration already exists with this mobile number or email. Registration ID: ${duplicate.registrationId}. You can view or download your confirmation card.`,
          existingRegistrationId: duplicate.registrationId
        });
      }

      const allRegs = await Registration.find().select('registrationId');
      const registrationId = generateRegistrationId(allRegs);

      const newRegistration = await Registration.create({
        registrationId,
        fullName: fullName.trim(),
        gender,
        dateOfBirth: dateOfBirth || '',
        age: Number(age),
        mobileNumber: cleanMobile,
        whatsappNumber: cleanWhatsApp,
        email: cleanEmail,
        fullAddress: fullAddress.trim(),
        city: city.trim(),
        state: (state || 'Gujarat').trim(),
        pincode: cleanPincode,
        familyName: (familyName || '').trim(),
        totalFamilyMembers: parsedFamilyMembers.length,
        familyMembers: parsedFamilyMembers,
        registrationCategory: registrationCategory || '99 Yatra Devotee (૯૯ યાત્રા યાત્રિક)',
        totalParticipants,
        preferredYatraDate: preferredYatraDate || '04 Jan 2027 - 13 Jan 2027',
        specialRequirements: (specialRequirements || '').trim(),
        emergencyContactNumber: cleanEmergencyMobile,
        emergencyContactName: (emergencyContactName || '').trim(),
        hasMedicalNeed: Boolean(hasMedicalNeed),
        medicalDetails: (medicalDetails || '').trim(),
        hasTravelAssistanceNeed: Boolean(hasTravelAssistanceNeed),
        travelDetails: (travelDetails || '').trim(),
        doliAssistanceRequired: Boolean(doliAssistanceRequired),
        additionalNotes: (additionalNotes || '').trim(),
        isDeclarationConfirmed: true,
        status: 'Pending',
        createdAt: now,
        updatedAt: now
      });

      return res.status(201).json({
        success: true,
        message: 'શ્રી શત્રુંજય ૯૯ યાત્રા રજીસ્ટ્રેશન સફળતાપૂર્વક પૂર્ણ થયું છે. Jai Jinendra!',
        registration: newRegistration
      });
    } else if (canUseFallback()) {
      // Local JSON store (ONLY in offline development when no MONGODB_URI is provided)
      const db = jsonStore.read();
      const existing = (db.registrations || []).find(r =>
        (r.mobileNumber === cleanMobile || r.email.toLowerCase() === cleanEmail) &&
        r.status !== 'Cancelled'
      );

      if (existing) {
        return res.status(409).json({
          success: false,
          isDuplicate: true,
          message: `A registration already exists with this mobile number or email. Registration ID: ${existing.registrationId}.`,
          existingRegistrationId: existing.registrationId
        });
      }

      const registrationId = generateRegistrationId(db.registrations || []);

      const newReg = {
        _id: 'reg_' + Date.now(),
        registrationId,
        fullName: fullName.trim(),
        gender,
        dateOfBirth: dateOfBirth || '',
        age: Number(age),
        mobileNumber: cleanMobile,
        whatsappNumber: cleanWhatsApp,
        email: cleanEmail,
        fullAddress: fullAddress.trim(),
        city: city.trim(),
        state: (state || 'Gujarat').trim(),
        pincode: cleanPincode,
        familyName: (familyName || '').trim(),
        totalFamilyMembers: parsedFamilyMembers.length,
        familyMembers: parsedFamilyMembers,
        registrationCategory: registrationCategory || '99 Yatra Devotee (૯૯ યાત્રા યાત્રિક)',
        totalParticipants,
        preferredYatraDate: preferredYatraDate || '04 Jan 2027 - 13 Jan 2027',
        specialRequirements: (specialRequirements || '').trim(),
        emergencyContactNumber: cleanEmergencyMobile,
        emergencyContactName: (emergencyContactName || '').trim(),
        hasMedicalNeed: Boolean(hasMedicalNeed),
        medicalDetails: (medicalDetails || '').trim(),
        hasTravelAssistanceNeed: Boolean(hasTravelAssistanceNeed),
        travelDetails: (travelDetails || '').trim(),
        doliAssistanceRequired: Boolean(doliAssistanceRequired),
        additionalNotes: (additionalNotes || '').trim(),
        isDeclarationConfirmed: true,
        status: 'Pending',
        createdAt: now.toISOString(),
        updatedAt: now.toISOString()
      };

      db.registrations = db.registrations || [];
      db.registrations.unshift(newReg);
      jsonStore.write(db);

      return res.status(201).json({
        success: true,
        message: 'શ્રી શત્રુંજય ૯૯ યાત્રા રજીસ્ટ્રેશન સફળતાપૂર્વક પૂર્ણ થયું છે. Jai Jinendra!',
        registration: newReg
      });
    } else {
      console.error(`[CRITICAL] Registration rejected: MongoDB Atlas is disconnected (readyState: ${mongoose.connection.readyState}).`);
      return res.status(503).json({
        success: false,
        error: 'DatabaseUnavailable',
        dbConnected: false,
        dbState: mongoose.connection.readyState,
        message: 'Database service is currently unavailable. To ensure your registration is permanently saved to MongoDB Atlas, please try again in 1–2 minutes.'
      });
    }
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process registration: ' + error.message
    });
  }
};

// GET /api/registrations/check/:query (Search by Registration ID or 10-digit mobile)
exports.lookupRegistration = async (req, res) => {
  try {
    const query = (req.params.query || '').trim();
    if (!query) {
      return res.status(400).json({ success: false, message: 'Please enter Registration ID or Mobile Number.' });
    }

    const cleanMobile = query.replace(/\D/g, '').slice(-10);

    if (isConnectedToMongo()) {
      const reg = await Registration.findOne({
        $or: [
          { registrationId: { $regex: new RegExp(`^${query}$`, 'i') } },
          ...(cleanMobile.length === 10 ? [{ mobileNumber: cleanMobile }] : [])
        ]
      });

      if (!reg) {
        return res.status(404).json({
          success: false,
          message: 'કોઈ રજીસ્ટ્રેશન મળ્યું નથી. કૃપા કરીને દાખલ કરેલ રજીસ્ટ્રેશન આઇડી અથવા મોબાઈલ નંબર ચકાસો.'
        });
      }

      return res.json({ success: true, registration: reg });
    } else if (canUseFallback()) {
      const db = jsonStore.read();
      const reg = (db.registrations || []).find(r =>
        r.registrationId.toUpperCase() === query.toUpperCase() ||
        (cleanMobile.length === 10 && r.mobileNumber === cleanMobile)
      );

      if (!reg) {
        return res.status(404).json({
          success: false,
          message: 'કોઈ રજીસ્ટ્રેશન મળ્યું નથી. કૃપા કરીને દાખલ કરેલ રજીસ્ટ્રેશન આઇડી અથવા મોબાઈલ નંબર ચકાસો.'
        });
      }

      return res.json({ success: true, registration: reg });
    } else {
      return res.status(503).json({ success: false, message: 'Database service is temporarily unavailable.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/registrations (Admin List with Search, Filter, Pagination, Sorting)
exports.getAllRegistrations = async (req, res) => {
  try {
    const {
      search = '',
      status = 'All',
      city = 'All',
      category = 'All',
      sortBy = 'newest',
      page = 1,
      limit = 100,
    } = req.query;

    if (isConnectedToMongo()) {
      const query = {};

      if (status && status !== 'All') {
        query.status = status;
      }
      if (city && city !== 'All') {
        query.city = { $regex: new RegExp(`^${city}$`, 'i') };
      }
      if (category && category !== 'All') {
        query.registrationCategory = category;
      }

      if (search && search.trim()) {
        const regex = new RegExp(search.trim(), 'i');
        query.$and = [
          {
            $or: [
              { registrationId: regex },
              { fullName: regex },
              { mobileNumber: regex },
              { email: regex },
              { city: regex },
              { familyName: regex }
            ]
          }
        ];
      }

      let sortOptions = { createdAt: -1 };
      if (sortBy === 'oldest') sortOptions = { createdAt: 1 };
      if (sortBy === 'name') sortOptions = { fullName: 1 };
      if (sortBy === 'participants') sortOptions = { totalParticipants: -1 };

      const total = await Registration.countDocuments(query);
      const registrations = await Registration.find(query)
        .sort(sortOptions)
        .skip((page - 1) * limit)
        .limit(Number(limit));

      // Distinct cities for filter dropdown
      const cities = await Registration.distinct('city');

      return res.json({
        success: true,
        registrations,
        total,
        page: Number(page),
        pages: Math.ceil(total / limit) || 1,
        cities
      });
    } else if (canUseFallback()) {
      const db = jsonStore.read();
      let list = db.registrations || [];

      if (status && status !== 'All') {
        list = list.filter(r => r.status === status);
      }
      if (city && city !== 'All') {
        list = list.filter(r => r.city.toLowerCase() === city.toLowerCase());
      }
      if (category && category !== 'All') {
        list = list.filter(r => r.registrationCategory === category);
      }

      if (search && search.trim()) {
        const s = search.trim().toLowerCase();
        list = list.filter(r =>
          r.registrationId.toLowerCase().includes(s) ||
          r.fullName.toLowerCase().includes(s) ||
          r.mobileNumber.includes(s) ||
          r.email.toLowerCase().includes(s) ||
          r.city.toLowerCase().includes(s) ||
          (r.familyName && r.familyName.toLowerCase().includes(s))
        );
      }

      // Sort
      if (sortBy === 'oldest') {
        list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      } else if (sortBy === 'name') {
        list.sort((a, b) => a.fullName.localeCompare(b.fullName));
      } else if (sortBy === 'participants') {
        list.sort((a, b) => b.totalParticipants - a.totalParticipants);
      } else {
        list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }

      const total = list.length;
      const startIndex = (page - 1) * limit;
      const pagedList = list.slice(startIndex, startIndex + Number(limit));

      const cities = Array.from(new Set((db.registrations || []).map(r => r.city))).sort();

      return res.json({
        success: true,
        registrations: pagedList,
        total,
        page: Number(page),
        pages: Math.ceil(total / limit) || 1,
        cities
      });
    } else {
      return res.status(503).json({ success: false, message: 'Database service is temporarily unavailable.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/registrations/:id (Single registration)
exports.getRegistrationById = async (req, res) => {
  try {
    const { id } = req.params;

    if (isConnectedToMongo()) {
      const reg = await Registration.findOne({
        $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { registrationId: id }]
      });

      if (!reg) return res.status(404).json({ success: false, message: 'Registration not found' });
      return res.json({ success: true, registration: reg });
    } else if (canUseFallback()) {
      const db = jsonStore.read();
      const reg = (db.registrations || []).find(r =>
        r._id === id || r.registrationId === id
      );
      if (!reg) return res.status(404).json({ success: false, message: 'Registration not found' });
      return res.json({ success: true, registration: reg });
    } else {
      return res.status(503).json({ success: false, message: 'Database service is temporarily unavailable.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/registrations/:id (Update devotee details)
exports.updateRegistration = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    updateData.updatedAt = new Date();

    if (isConnectedToMongo()) {
      const updated = await Registration.findOneAndUpdate(
        { $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { registrationId: id }] },
        updateData,
        { new: true, runValidators: true }
      );

      if (!updated) return res.status(404).json({ success: false, message: 'Registration not found' });
      return res.json({ success: true, message: 'Registration updated successfully', registration: updated });
    } else if (canUseFallback()) {
      const db = jsonStore.read();
      const idx = (db.registrations || []).findIndex(r =>
        r._id === id || r.registrationId === id
      );
      if (idx === -1) return res.status(404).json({ success: false, message: 'Registration not found' });

      db.registrations[idx] = { ...db.registrations[idx], ...updateData, updatedAt: new Date().toISOString() };
      jsonStore.write(db);

      return res.json({ success: true, message: 'Registration updated successfully', registration: db.registrations[idx] });
    } else {
      return res.status(503).json({ success: false, message: 'Database service is temporarily unavailable.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/registrations/:id/status (Change Status)
exports.updateRegistrationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminRemarks } = req.body;
    const now = new Date();

    const validStatuses = ['Pending', 'Confirmed', 'Rejected', 'Cancelled', 'Waitlist'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status provided.' });
    }

    if (isConnectedToMongo()) {
      const updated = await Registration.findOneAndUpdate(
        { $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { registrationId: id }] },
        { status, adminRemarks: adminRemarks || '', updatedAt: now },
        { new: true }
      );

      if (!updated) return res.status(404).json({ success: false, message: 'Registration not found' });
      return res.json({ success: true, message: `Status updated to ${status}`, registration: updated });
    } else if (canUseFallback()) {
      const db = jsonStore.read();
      const idx = (db.registrations || []).findIndex(r =>
        r._id === id || r.registrationId === id
      );
      if (idx === -1) return res.status(404).json({ success: false, message: 'Registration not found' });

      db.registrations[idx].status = status;
      if (adminRemarks !== undefined) db.registrations[idx].adminRemarks = adminRemarks;
      db.registrations[idx].updatedAt = now.toISOString();

      jsonStore.write(db);
      return res.json({ success: true, message: `Status updated to ${status}`, registration: db.registrations[idx] });
    } else {
      return res.status(503).json({ success: false, message: 'Database service is temporarily unavailable.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/registrations/:id (Delete Registration)
exports.deleteRegistration = async (req, res) => {
  try {
    const { id } = req.params;

    if (isConnectedToMongo()) {
      const deleted = await Registration.findOneAndDelete({
        $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { registrationId: id }]
      });

      if (!deleted) return res.status(404).json({ success: false, message: 'Registration not found' });
      return res.json({ success: true, message: 'Registration deleted successfully.' });
    } else if (canUseFallback()) {
      const db = jsonStore.read();
      const idx = db.registrations.findIndex(r => r._id === id || r.registrationId === id);
      if (idx === -1) return res.status(404).json({ success: false, message: 'Registration not found' });

      db.registrations.splice(idx, 1);
      jsonStore.write(db);
      return res.json({ success: true, message: 'Registration deleted successfully.' });
    } else {
      return res.status(503).json({ success: false, message: 'Database service is temporarily unavailable.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/registrations/export/excel (Export Excel)
exports.exportToExcel = async (req, res) => {
  try {
    let records = [];
    const now = new Date();

    if (isConnectedToMongo()) {
      records = await Registration.find().sort({ createdAt: -1 });
    } else if (canUseFallback()) {
      const db = jsonStore.read();
      records = db.registrations || [];
    } else {
      return res.status(503).json({ success: false, message: 'Database service is temporarily unavailable.' });
    }

    // Format rows for professional Excel export
    const excelData = records.map((r, index) => {
      const familyNames = Array.isArray(r.familyMembers)
        ? r.familyMembers.map(m => `${m.name} (${m.relation}, Age: ${m.age})`).join('; ')
        : '';

      return {
        'Sr. No.': index + 1,
        'Registration ID': r.registrationId,
        'Full Name (મુખ્ય યાત્રિક)': r.fullName,
        'Gender': r.gender,
        'Age': r.age,
        'Mobile Number': r.mobileNumber,
        'WhatsApp Number': r.whatsappNumber,
        'Email Address': r.email,
        'City': r.city,
        'State': r.state,
        'Pincode': r.pincode,
        'Full Address': r.fullAddress,
        'Category': r.registrationCategory,
        'Total Participants (કુલ સભ્યો)': r.totalParticipants,
        'Family Name': r.familyName || '-',
        'Additional Family Members': familyNames || 'None',
        'Doli / Chair Assistance Required': r.doliAssistanceRequired ? 'Yes (હા)' : 'No',
        'Medical Needs': r.hasMedicalNeed ? r.medicalDetails : 'No',
        'Travel Assistance': r.hasTravelAssistanceNeed ? r.travelDetails : 'No',
        'Emergency Contact': `${r.emergencyContactName || ''} (${r.emergencyContactNumber})`,
        'Registration Status': r.status,
        'Submission Date': new Date(r.createdAt).toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        'Admin Remarks': r.adminRemarks || ''
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Auto-fit column widths
    const columnWidths = [
      { wch: 8 },  // Sr No
      { wch: 22 }, // Reg ID
      { wch: 28 }, // Full Name
      { wch: 10 }, // Gender
      { wch: 8 },  // Age
      { wch: 14 }, // Mobile
      { wch: 14 }, // WhatsApp
      { wch: 26 }, // Email
      { wch: 16 }, // City
      { wch: 14 }, // State
      { wch: 10 }, // Pincode
      { wch: 35 }, // Address
      { wch: 30 }, // Category
      { wch: 18 }, // Total Participants
      { wch: 20 }, // Family Name
      { wch: 40 }, // Additional Family
      { wch: 16 }, // Doli
      { wch: 20 }, // Medical
      { wch: 20 }, // Travel
      { wch: 24 }, // Emergency
      { wch: 14 }, // Status
      { wch: 22 }, // Date
      { wch: 25 }, // Remarks
    ];
    worksheet['!cols'] = columnWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, '99 Yatra Registrations');

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Disposition', 'attachment; filename="Palitana-99-Yatra-Registrations.xlsx"');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    return res.send(buffer);
  } catch (error) {
    console.error('Excel Export Error:', error);
    res.status(500).json({ success: false, message: 'Failed to generate Excel export: ' + error.message });
  }
};

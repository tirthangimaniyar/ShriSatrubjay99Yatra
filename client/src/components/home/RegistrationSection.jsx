import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  User,
  Phone,
  Mail,
  MapPin,
  Users,
  Plus,
  Trash2,
  Calendar,
  AlertCircle,
  CheckCircle,
  FileDown,
  Printer,
  Heart,
  ShieldCheck,
  RefreshCw,
  Clock,
  ExternalLink
} from 'lucide-react';
import { generateDevoteePassPDF } from '../../utils/pdfGenerator';
import { getApiUrl } from '../../config';
import { DigitalYatrikPass } from '../common/DigitalYatrikPass';
import { OrnamentalDivider } from '../common/OrnamentalDivider';

export const RegistrationSection = () => {
  // Form State
  const [formData, setFormData] = useState({
    // Personal Details
    fullName: '',
    gender: 'Male',
    dateOfBirth: '',
    age: '',
    mobileNumber: '',
    whatsappNumber: '',
    email: '',

    // Address Details
    fullAddress: '',
    city: '',
    state: 'Gujarat',
    pincode: '',

    // Family Details
    familyName: '',
    familyMembers: [], // { name, relation, age, gender, specialNeed }

    // Yatra Details
    registrationCategory: '99 Yatra Devotee (૯૯ યાત્રા યાત્રિક)',
    preferredYatraDate: '04 Jan 2027 - 13 Jan 2027',
    specialRequirements: '',
    emergencyContactNumber: '',
    emergencyContactName: '',

    // Assistance
    hasMedicalNeed: false,
    medicalDetails: '',
    hasTravelAssistanceNeed: false,
    travelDetails: '',
    doliAssistanceRequired: false,
    additionalNotes: '',

    // Declaration (Checked by default for smooth user experience)
    isDeclarationConfirmed: true,
  });

  // UI state
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [duplicateError, setDuplicateError] = useState(null);
  const [validationList, setValidationList] = useState([]);

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear field-specific error when user modifies it
    if (errors[name]) {
      setErrors(prev => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  // Dynamic Family Members Management
  const addFamilyMember = () => {
    setFormData(prev => ({
      ...prev,
      familyMembers: [
        ...prev.familyMembers,
        { name: '', relation: 'Spouse (પત્ની/પતિ)', age: '', gender: 'Female', specialNeed: '' }
      ]
    }));
  };

  const removeFamilyMember = (index) => {
    setFormData(prev => ({
      ...prev,
      familyMembers: prev.familyMembers.filter((_, i) => i !== index)
    }));
  };

  const handleMemberChange = (index, field, value) => {
    setFormData(prev => {
      const updated = [...prev.familyMembers];
      updated[index][field] = value;
      return { ...prev, familyMembers: updated };
    });
  };

  // Comprehensive Client-side Form Validation
  const validateForm = () => {
    const errs = {};
    const errorList = [];

    // 1. Personal Details Validation
    if (!formData.fullName || !formData.fullName.trim()) {
      errs.fullName = 'Devotee full name is required (યાત્રિકનું પૂરું નામ અનિવાર્ય છે).';
      errorList.push('યાત્રિકનું પૂરું નામ (Full Name)');
    }

    if (!formData.age || isNaN(formData.age) || Number(formData.age) < 1 || Number(formData.age) > 120) {
      errs.age = 'Please enter a valid age between 1 and 120.';
      errorList.push('ઉંમર ૧ થી ૧૨૦ વચ્ચે હોવી જોઈએ (Valid Age)');
    }

    const cleanMobile = formData.mobileNumber.replace(/\D/g, '').slice(-10);
    if (!cleanMobile || cleanMobile.length !== 10 || !/^[6-9]\d{9}$/.test(cleanMobile)) {
      errs.mobileNumber = 'Please enter a valid 10-digit Indian mobile number (e.g. 9876543210).';
      errorList.push('૧૦ આંકડાનો સાચો મોબાઈલ નંબર (10-Digit Mobile Number)');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      errs.email = 'Please provide a valid email address.';
      errorList.push('ઈમેલ એડ્રેસ (Valid Email Address)');
    }

    // 2. Address Validation
    if (!formData.fullAddress.trim()) {
      errs.fullAddress = 'Full address is required.';
      errorList.push('સંપૂર્ણ સરનામું (Full Address)');
    }
    if (!formData.city.trim()) {
      errs.city = 'City / Town name is required.';
      errorList.push('શહેર / ગામનું નામ (City)');
    }

    const cleanPincode = formData.pincode.replace(/\D/g, '');
    if (!cleanPincode || cleanPincode.length !== 6) {
      errs.pincode = 'Please enter a valid 6-digit Pincode (e.g. 395009).';
      errorList.push('૬ આંકડાનો પીનકોડ (6-Digit Pincode)');
    }

    // 3. Family Members Validation
    formData.familyMembers.forEach((member, i) => {
      if (!member.name || !member.name.trim()) {
        errs[`member_${i}_name`] = `Please enter the name of member #${i + 1}`;
        errorList.push(`પરિવાર સભ્ય #${i + 1} નું નામ (Member #${i + 1} Name)`);
      }
      if (!member.age || isNaN(member.age) || Number(member.age) < 1) {
        errs[`member_${i}_age`] = `Please enter valid age for member #${i + 1}`;
        errorList.push(`પરિવાર સભ્ય #${i + 1} ની ઉંમર (Member #${i + 1} Age)`);
      }
    });

    // 4. Declaration
    if (!formData.isDeclarationConfirmed) {
      errs.isDeclarationConfirmed = 'You must confirm the declaration to proceed.';
      errorList.push('ખાતરી પત્રક ચેકબોક્સ (Declaration confirmation)');
    }

    setErrors(errs);
    setValidationList(errorList);
    return errorList.length === 0;
  };

  // Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setDuplicateError(null);
    setValidationList([]);

    if (!validateForm()) {
      // Scroll to registration top with clear view
      const el = document.getElementById('registration');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    setSubmitting(true);

    try {
      // Calculate total participants
      const totalParticipants = 1 + formData.familyMembers.length;
      const cleanMobile = formData.mobileNumber.replace(/\D/g, '').slice(-10);
      const cleanWhatsApp = (formData.whatsappNumber || formData.mobileNumber).replace(/\D/g, '').slice(-10);
      const cleanEmergency = (formData.emergencyContactNumber || '').replace(/\D/g, '').slice(-10) || cleanMobile;

      const payload = {
        ...formData,
        mobileNumber: cleanMobile,
        whatsappNumber: cleanWhatsApp,
        emergencyContactNumber: cleanEmergency,
        totalParticipants,
        age: Number(formData.age),
      };

      const res = await fetch(getApiUrl('/api/registrations'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (res.status === 409 || data.isDuplicate) {
          setDuplicateError(data);
          const el = document.getElementById('registration');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        } else {
          setErrors({ form: data.message || 'Registration failed. Please check entries.' });
          const el = document.getElementById('registration');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
        return;
      }

      // Success! Fire Festive Confetti
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#7A0C1E', '#E65100', '#FFD700', '#4A0012']
      });

      setSuccessData(data.registration);
      // Scroll to success card
      setTimeout(() => {
        const el = document.getElementById('registration');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      setErrors({ form: 'Network error or connection issue: ' + err.message });
      const el = document.getElementById('registration');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setSuccessData(null);
    setDuplicateError(null);
    setFormData({
      fullName: '',
      gender: 'Male',
      dateOfBirth: '',
      age: '',
      mobileNumber: '',
      whatsappNumber: '',
      email: '',
      fullAddress: '',
      city: '',
      state: 'Gujarat',
      pincode: '',
      familyName: '',
      familyMembers: [],
      registrationCategory: '99 Yatra Devotee (૯૯ યાત્રા યાત્રિક)',
      preferredYatraDate: '04 Jan 2027 - 13 Jan 2027',
      specialRequirements: '',
      emergencyContactNumber: '',
      emergencyContactName: '',
      hasMedicalNeed: false,
      medicalDetails: '',
      hasTravelAssistanceNeed: false,
      travelDetails: '',
      doliAssistanceRequired: false,
      additionalNotes: '',
      isDeclarationConfirmed: false,
    });
    setErrors({});
  };

  return (
    <section id="registration" className="py-20 bg-gradient-to-b from-yatra-ivory via-yatra-cream to-yatra-sand/50 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/85 backdrop-blur-md border border-[#C59B27]/40 text-yatra-maroon font-semibold text-xs uppercase tracking-wider font-gujarati shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" />
            <span>ઓનલાઇન યાત્રિક નોંધણી ફોર્મ</span>
            <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" />
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-yatra-maroon font-gujaratiSerif tracking-tight matra-safe">
            Shri Shatrunjay 99 Yatra Registration
          </h2>
          <p className="text-sm sm:text-base text-gray-700 font-gujarati matra-safe">
            શ્રી શત્રુંજય ગિરિરાજ ૯૯ યાત્રા માટે આપની તથા પરિવારની માહિતી નીચે આપેલા ફોર્મમાં ભરી રજીસ્ટ્રેશન કન્ફર્મ કરો.
          </p>

          <OrnamentalDivider className="my-2" />
        </div>

        {/* Duplicate Error Alert if already registered */}
        {duplicateError && (
          <div className="mb-8 p-5 bg-amber-50 border-2 border-amber-400 rounded-2xl shadow-md text-amber-900 font-gujarati space-y-3">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-base text-amber-900">આ માહિતી પર પહેલેથી રજીસ્ટ્રેશન નોંધાયેલ છે!</h4>
                <p className="text-sm text-amber-800 mt-1">{duplicateError.message}</p>
                {duplicateError.existingRegistrationId && (
                  <div className="mt-3 inline-block font-mono bg-white px-3 py-1.5 rounded-lg border border-amber-300 font-bold text-yatra-maroon">
                    રજીસ્ટ્રેશન આઇડી: {duplicateError.existingRegistrationId}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Validation Errors Summary Alert */}
        {validationList && validationList.length > 0 && (
          <div className="mb-8 p-5 bg-red-50 border-2 border-red-400 rounded-2xl shadow-md text-red-900 font-gujarati space-y-2 animate-fadeIn">
            <div className="flex items-center space-x-2 font-bold text-red-800 text-sm">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              <span>કૃપા કરીને નીચે આપેલી વિગતો યોગ્ય રીતે ભરો ({validationList.length} વિગત અધૂરી છે):</span>
            </div>
            <ul className="list-disc list-inside text-xs text-red-700 pl-4 space-y-1">
              {validationList.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        {/* General Form Error Alert */}
        {errors.form && (
          <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 rounded-xl text-red-700 text-sm flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errors.form}</span>
          </div>
        )}

        {/* SUCCESS CONFIRMATION - ORNATE ROYAL DIGITAL YATRIK PASS */}
        {successData ? (
          <div className="max-w-3xl mx-auto">
            {/* Top Celebratory Banner */}
            <div className="text-center mb-6 space-y-2">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md border-2 border-emerald-400">
                <CheckCircle className="w-10 h-10" />
              </div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest font-serifHeading block">
                REGISTRATION CONFIRMED • JAI JINENDRA
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-yatra-maroon font-gujaratiSerif matra-safe">
                અભિનંદન! યાત્રા રજીસ્ટ્રેશન સફળ થયું છે.
              </h3>
              <p className="text-sm text-gray-600 font-gujarati max-w-xl mx-auto matra-safe">
                શ્રી શત્રુંજય ગિરિરાજ ૯૯ યાત્રા સંઘમાં આપનું રજીસ્ટ્રેશન નોંધાઈ ગયું છે. આપનો સત્તાવાર ડિજિટલ યાત્રિક પાસ નીચે મુજબ છે:
              </p>
            </div>

            <DigitalYatrikPass registration={successData} onReset={handleReset} />
          </div>
        ) : (
          /* MAIN REGISTRATION FORM */
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl border-2 border-yatra-gold/60 p-6 sm:p-10 shadow-xl space-y-8"
          >
            {/* 1. PERSONAL DETAILS SECTION */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 pb-2 border-b-2 border-yatra-gold/30">
                <User className="w-5 h-5 text-yatra-maroon" />
                <h3 className="text-lg font-bold text-yatra-maroon font-gujarati">
                  ૧. વ્યક્તિગત વિગતો (Personal Details)
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Full Name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1 font-gujarati">
                    યાત્રિકનું પૂરું નામ (Full Name) <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="દા.ત. શૈલેષભાઈ શાંતિલાલ શાહ"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-gujarati focus:ring-2 focus:ring-yatra-gold focus:outline-none transition-all ${
                      errors.fullName ? 'border-red-500 bg-red-50/50' : 'border-gray-300'
                    }`}
                  />
                  {errors.fullName && <p className="text-red-600 text-xs mt-1 font-gujarati">{errors.fullName}</p>}
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 font-gujarati">
                    જાતિ (Gender) <span className="text-red-600">*</span>
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm font-gujarati focus:ring-2 focus:ring-yatra-gold focus:outline-none bg-white"
                  >
                    <option value="Male">પુરુષ (Male)</option>
                    <option value="Female">સ્ત્રી (Female)</option>
                    <option value="Other">અન્ય (Other)</option>
                  </select>
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 font-gujarati">
                    જન્મ તારીખ (Date of Birth)
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-yatra-gold focus:outline-none"
                  />
                </div>

                {/* Age */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 font-gujarati">
                    ઉંમર (Age) <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="number"
                    name="age"
                    min="1"
                    max="120"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="ઉંમર (વર્ષ)"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:ring-2 focus:ring-yatra-gold focus:outline-none ${
                      errors.age ? 'border-red-500 bg-red-50/50' : 'border-gray-300'
                    }`}
                  />
                  {errors.age && <p className="text-red-600 text-xs mt-1 font-gujarati">{errors.age}</p>}
                </div>

                {/* Mobile Number */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 font-gujarati">
                    મોબાઈલ નંબર (Mobile Number) <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="tel"
                    name="mobileNumber"
                    maxLength="10"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    placeholder="૧૦ આંકડાનો મોબાઈલ નંબર"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:ring-2 focus:ring-yatra-gold focus:outline-none ${
                      errors.mobileNumber ? 'border-red-500 bg-red-50/50' : 'border-gray-300'
                    }`}
                  />
                  {errors.mobileNumber && <p className="text-red-600 text-xs mt-1 font-gujarati">{errors.mobileNumber}</p>}
                </div>

                {/* WhatsApp Number */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 font-gujarati">
                    વોટ્સએપ નંબર (WhatsApp Number)
                  </label>
                  <input
                    type="tel"
                    name="whatsappNumber"
                    maxLength="10"
                    value={formData.whatsappNumber}
                    onChange={handleChange}
                    placeholder="વોટ્સએપ નંબર (જો અલગ હોય તો)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-yatra-gold focus:outline-none"
                  />
                </div>

                {/* Email Address */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1 font-gujarati">
                    ઈમેલ એડ્રેસ (Email Address) <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="devotee@example.com"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:ring-2 focus:ring-yatra-gold focus:outline-none ${
                      errors.email ? 'border-red-500 bg-red-50/50' : 'border-gray-300'
                    }`}
                  />
                  {errors.email && <p className="text-red-600 text-xs mt-1 font-gujarati">{errors.email}</p>}
                </div>
              </div>
            </div>

            {/* 2. ADDRESS DETAILS SECTION */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 pb-2 border-b-2 border-yatra-gold/30">
                <MapPin className="w-5 h-5 text-yatra-maroon" />
                <h3 className="text-lg font-bold text-yatra-maroon font-gujarati">
                  ૨. સરનામાની વિગતો (Address Details)
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Full Address */}
                <div className="sm:col-span-2 lg:col-span-4">
                  <label className="block text-xs font-bold text-gray-700 mb-1 font-gujarati">
                    સંપૂર્ણ સરનામું (Full Address) <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    rows="2"
                    name="fullAddress"
                    value={formData.fullAddress}
                    onChange={handleChange}
                    placeholder="ઘર/ફ્લેટ નં, સોસાયટી/બિલ્ડીંગ, વિસ્તાર/લેન્ડમાર્ક"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-gujarati focus:ring-2 focus:ring-yatra-gold focus:outline-none ${
                      errors.fullAddress ? 'border-red-500 bg-red-50/50' : 'border-gray-300'
                    }`}
                  ></textarea>
                  {errors.fullAddress && <p className="text-red-600 text-xs mt-1 font-gujarati">{errors.fullAddress}</p>}
                </div>

                {/* City */}
                <div className="sm:col-span-1 lg:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1 font-gujarati">
                    શહેર / ગામ (City / Town) <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="દા.ત. સુરત, અમદાવાદ, મુંબઈ"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-gujarati focus:ring-2 focus:ring-yatra-gold focus:outline-none ${
                      errors.city ? 'border-red-500 bg-red-50/50' : 'border-gray-300'
                    }`}
                  />
                  {errors.city && <p className="text-red-600 text-xs mt-1 font-gujarati">{errors.city}</p>}
                </div>

                {/* State */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 font-gujarati">
                    રાજ્ય (State)
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm font-gujarati focus:ring-2 focus:ring-yatra-gold focus:outline-none"
                  />
                </div>

                {/* Pincode */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 font-gujarati">
                    પીનકોડ (Pincode) <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    maxLength="6"
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="૬ આંકડાનો પીનકોડ"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:ring-2 focus:ring-yatra-gold focus:outline-none ${
                      errors.pincode ? 'border-red-500 bg-red-50/50' : 'border-gray-300'
                    }`}
                  />
                  {errors.pincode && <p className="text-red-600 text-xs mt-1 font-gujarati">{errors.pincode}</p>}
                </div>
              </div>
            </div>

            {/* 3. FAMILY DETAILS (WITH DYNAMIC ADD MEMBER) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b-2 border-yatra-gold/30">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-yatra-maroon" />
                  <h3 className="text-lg font-bold text-yatra-maroon font-gujarati">
                    ૩. પરિવારની વિગતો (Family Details)
                  </h3>
                </div>

                {/* Add Member Button */}
                <button
                  type="button"
                  onClick={addFamilyMember}
                  className="px-3.5 py-1.5 text-xs font-bold text-yatra-maroon bg-yatra-sand/80 hover:bg-yatra-sand border border-yatra-gold/60 rounded-xl transition-all flex items-center space-x-1.5 font-gujarati shadow-sm"
                >
                  <Plus className="w-4 h-4 text-yatra-goldDark" />
                  <span>સભ્ય ઉમેરો (Add Member)</span>
                </button>
              </div>

              {/* Family Name */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 font-gujarati">
                  પરિવારનું નામ / ઓળખ (Family Name / Surname)
                </label>
                <input
                  type="text"
                  name="familyName"
                  value={formData.familyName}
                  onChange={handleChange}
                  placeholder="દા.ત. શાહ પરિવાર (એકલારા વાળા)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm font-gujarati focus:ring-2 focus:ring-yatra-gold focus:outline-none"
                />
              </div>

              {/* Dynamic Members List */}
              {formData.familyMembers.length === 0 ? (
                <div className="p-4 bg-yatra-cream/60 rounded-2xl border border-dashed border-yatra-gold/40 text-center text-xs text-gray-600 font-gujarati">
                  જો આપની સાથે પરિવારના અન્ય સભ્યો યાત્રામાં જોડાવાના હોય, તો ઉપર આપેલા <span className="font-bold text-yatra-maroon">"સભ્ય ઉમેરો"</span> બટન પર ક્લિક કરો.
                </div>
              ) : (
                <div className="space-y-3">
                  {formData.familyMembers.map((member, index) => (
                    <div
                      key={index}
                      className="p-4 bg-amber-50/50 rounded-2xl border border-yatra-gold/40 space-y-3 relative"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-yatra-maroon font-gujarati">
                          પરિવાર સભ્ય #{index + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFamilyMember(index)}
                          className="text-red-500 hover:text-red-700 p-1 rounded-lg transition-colors"
                          title="Remove Member"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-bold text-gray-700 mb-1 font-gujarati">
                            સભ્યનું નામ <span className="text-red-600">*</span>
                          </label>
                          <input
                            type="text"
                            value={member.name}
                            onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                            placeholder="સભ્યનું પૂરું નામ"
                            className={`w-full px-3 py-2 rounded-lg border text-xs font-gujarati focus:ring-2 focus:ring-yatra-gold focus:outline-none ${
                              errors[`member_${index}_name`] ? 'border-red-500 bg-red-50' : 'border-gray-300'
                            }`}
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-gray-700 mb-1 font-gujarati">
                            સંબંધ (Relation)
                          </label>
                          <select
                            value={member.relation}
                            onChange={(e) => handleMemberChange(index, 'relation', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs font-gujarati focus:ring-2 focus:ring-yatra-gold focus:outline-none bg-white"
                          >
                            <option value="Spouse (પત્ની/પતિ)">Spouse (પત્ની/પતિ)</option>
                            <option value="Son (પુત્ર)">Son (પુત્ર)</option>
                            <option value="Daughter (પુત્રી)">Daughter (પુત્રી)</option>
                            <option value="Father (પિતા)">Father (પિતા)</option>
                            <option value="Mother (માતા)">Mother (માતા)</option>
                            <option value="Brother (ભાઈ)">Brother (ભાઈ)</option>
                            <option value="Sister (બહેન)">Sister (બહેન)</option>
                            <option value="Relative (સગા)">Relative (સગા)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-gray-700 mb-1 font-gujarati">
                            ઉંમર (Age) <span className="text-red-600">*</span>
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="120"
                            value={member.age}
                            onChange={(e) => handleMemberChange(index, 'age', e.target.value)}
                            placeholder="ઉંમર"
                            className={`w-full px-3 py-2 rounded-lg border text-xs focus:ring-2 focus:ring-yatra-gold focus:outline-none ${
                              errors[`member_${index}_age`] ? 'border-red-500 bg-red-50' : 'border-gray-300'
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 4. YATRA DETAILS SECTION */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 pb-2 border-b-2 border-yatra-gold/30">
                <Calendar className="w-5 h-5 text-yatra-maroon" />
                <h3 className="text-lg font-bold text-yatra-maroon font-gujarati">
                  ૪. યાત્રા અને સેવા વિગતો (Yatra & Category Details)
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Registration Category */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 font-gujarati">
                    રજીસ્ટ્રેશન કેટેગરી (Registration Category) <span className="text-red-600">*</span>
                  </label>
                  <select
                    name="registrationCategory"
                    value={formData.registrationCategory}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm font-gujarati focus:ring-2 focus:ring-yatra-gold focus:outline-none bg-white font-medium"
                  >
                    <option value="99 Yatra Devotee (૯૯ યાત્રા યાત્રિક)">99 Yatra Devotee (૯૯ યાત્રા યાત્રિક)</option>
                    <option value="Chha'ri Palit Sangh (છ'રી પાલિત સંઘ યાત્રિક)">Chha'ri Palit Sangh (છ'રી પાલિત સંઘ યાત્રિક)</option>
                    <option value="Seva Bhavi Karyakarta (સેવાભાવી કાર્યકર્તા)">Seva Bhavi Karyakarta (સેવાભાવી કાર્યકર્તા)</option>
                    <option value="Senior Citizen Devotee (વરિષ્ઠ નાગરિક)">Senior Citizen Devotee (વરિષ્ઠ નાગરિક)</option>
                  </select>
                </div>

                {/* Total Participants Preview */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 font-gujarati">
                    કુલ યાત્રિકોની સંખ્યા (Total Participants)
                  </label>
                  <div className="w-full px-3.5 py-2.5 rounded-xl border border-yatra-gold/40 bg-yatra-cream text-sm font-bold text-yatra-maroon font-gujarati flex items-center justify-between">
                    <span>૧ મુખ્ય યાત્રિક + {formData.familyMembers.length} પરિવાર સભ્ય</span>
                    <span className="bg-yatra-maroon text-white text-xs px-2.5 py-0.5 rounded-full">
                      {1 + formData.familyMembers.length} સભ્યો
                    </span>
                  </div>
                </div>

                {/* Emergency Contact Number */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 font-gujarati">
                    ઇમરજન્સી સંપર્ક નંબર (Emergency Mobile) <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="tel"
                    name="emergencyContactNumber"
                    maxLength="10"
                    value={formData.emergencyContactNumber}
                    onChange={handleChange}
                    placeholder="કટોકટીમાં સંપર્ક કરવા માટે નંબર"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:ring-2 focus:ring-yatra-gold focus:outline-none ${
                      errors.emergencyContactNumber ? 'border-red-500 bg-red-50/50' : 'border-gray-300'
                    }`}
                  />
                  {errors.emergencyContactNumber && <p className="text-red-600 text-xs mt-1 font-gujarati">{errors.emergencyContactNumber}</p>}
                </div>

                {/* Emergency Contact Name */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 font-gujarati">
                    ઇમરજન્સી સંપર્ક વ્યક્તિનું નામ (Emergency Person Name)
                  </label>
                  <input
                    type="text"
                    name="emergencyContactName"
                    value={formData.emergencyContactName}
                    onChange={handleChange}
                    placeholder="સંપર્ક વ્યક્તિનું નામ"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm font-gujarati focus:ring-2 focus:ring-yatra-gold focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 5. MEDICAL & SPECIAL ASSISTANCE */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 pb-2 border-b-2 border-yatra-gold/30">
                <Heart className="w-5 h-5 text-yatra-maroon" />
                <h3 className="text-lg font-bold text-yatra-maroon font-gujarati">
                  ૫. વિશેષ સહાય અને તબીબી જરૂરિયાત (Special Assistance)
                </h3>
              </div>

              <div className="space-y-3">
                {/* Doli Assistance Checkbox */}
                <label className="flex items-start space-x-3 p-3 bg-amber-50/60 rounded-xl border border-yatra-gold/30 cursor-pointer">
                  <input
                    type="checkbox"
                    name="doliAssistanceRequired"
                    checked={formData.doliAssistanceRequired}
                    onChange={handleChange}
                    className="mt-1 w-4 h-4 text-yatra-maroon rounded focus:ring-yatra-gold border-gray-300"
                  />
                  <div className="text-xs sm:text-sm font-gujarati">
                    <span className="font-bold text-yatra-maroon">પાલિતાણા ગિરિરાજ ચઢાણ માટે ડોળી / પાલખી (Doli) વ્યવસ્થા જરૂરી છે?</span>
                    <p className="text-gray-600 text-xs mt-0.5">
                      વૃદ્ધ અથવા શારીરિક તકલીફવાળા યાત્રિકો માટે સંઘ દ્વારા સ્થાનિક ડોળી સેવાઓનું સંકલન કરવામાં આવશે.
                    </p>
                  </div>
                </label>

                {/* Medical Need Checkbox */}
                <label className="flex items-start space-x-3 p-3 bg-white rounded-xl border border-gray-200 cursor-pointer">
                  <input
                    type="checkbox"
                    name="hasMedicalNeed"
                    checked={formData.hasMedicalNeed}
                    onChange={handleChange}
                    className="mt-1 w-4 h-4 text-yatra-maroon rounded focus:ring-yatra-gold border-gray-300"
                  />
                  <div className="text-xs sm:text-sm font-gujarati">
                    <span className="font-semibold text-gray-800">કોઈ ખાસ તબીબી દવા અથવા સ્વાસ્થ્ય સંબંધિત કાળજી જરૂરી છે?</span>
                  </div>
                </label>
                {formData.hasMedicalNeed && (
                  <textarea
                    rows="2"
                    name="medicalDetails"
                    value={formData.medicalDetails}
                    onChange={handleChange}
                    placeholder="તબીબી વિગતો લખો (દા.ત. ડાયાબિટીસ, બીપી, વગેરે)..."
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs font-gujarati focus:ring-2 focus:ring-yatra-gold focus:outline-none"
                  ></textarea>
                )}

                {/* Additional Notes */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 font-gujarati">
                    અન્ય વિશેષ નોંધ / વિગત (Additional Notes)
                  </label>
                  <textarea
                    rows="2"
                    name="additionalNotes"
                    value={formData.additionalNotes}
                    onChange={handleChange}
                    placeholder="સંઘ આયોજકો માટે કોઈ વિશેષ સૂચન કે નોંધ..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm font-gujarati focus:ring-2 focus:ring-yatra-gold focus:outline-none"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* 6. DECLARATION CONFIRMATION */}
            <div className="pt-2">
              <label className="flex items-start space-x-3 p-4 bg-yatra-cream rounded-2xl border-2 border-yatra-gold/50 cursor-pointer">
                <input
                  type="checkbox"
                  name="isDeclarationConfirmed"
                  checked={formData.isDeclarationConfirmed}
                  onChange={handleChange}
                  className="mt-1 w-5 h-5 text-yatra-maroon rounded focus:ring-yatra-gold border-gray-300"
                />
                <div className="text-xs sm:text-sm font-gujarati text-gray-800">
                  <span className="font-bold text-yatra-maroon block">
                    "I confirm that the information provided above is correct."
                  </span>
                  <span>
                    હું ખાતરીપૂર્વક જણાવું છું કે ઉપર જણાવેલી તમામ વ્યક્તિગત અને પારિવારિક વિગતો સાચી અને પ્રમાણિત છે. હું સંઘના પાવન ધાર્મિક નિયમોનું પાલન કરીશ.
                  </span>
                </div>
              </label>
              {errors.isDeclarationConfirmed && (
                <p className="text-red-600 text-xs mt-1.5 font-gujarati pl-2">{errors.isDeclarationConfirmed}</p>
              )}
            </div>

            {/* SUBMIT BUTTON */}
            <div className="pt-4 border-t border-yatra-gold/30">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 text-base sm:text-lg font-bold text-white bg-gradient-to-r from-yatra-maroon via-yatra-maroonLight to-yatra-maroon hover:shadow-maroon-lg rounded-2xl shadow-md transition-all font-gujarati flex items-center justify-center space-x-2 border-2 border-yatra-goldLight/60 disabled:opacity-60 cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Clock className="w-5 h-5 animate-spin text-amber-200" />
                    <span>રજીસ્ટ્રેશન નોંધાઈ રહ્યું છે... કૃપા કરીને પ્રતીક્ષા કરો...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5 text-amber-200" />
                    <span>શ્રી શત્રુંજય ૯૯ યાત્રા રજીસ્ટ્રેશન કન્ફર્મ કરો (Submit Registration)</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

      </div>
    </section>
  );
};

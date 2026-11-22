import React, { useState } from 'react';
import { 
  FileDown, 
  Printer, 
  CheckCircle, 
  Copy, 
  Check, 
  Phone, 
  MapPin, 
  Calendar, 
  Users, 
  ShieldCheck, 
  Sparkles,
  Heart
} from 'lucide-react';
import { generateDevoteePassPDF } from '../../utils/pdfGenerator';

export const DigitalYatrikPass = ({ registration, onReset, isModal = false }) => {
  const [copied, setCopied] = useState(false);

  if (!registration) return null;

  const handleCopyId = () => {
    if (registration.registrationId) {
      navigator.clipboard.writeText(registration.registrationId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full mx-auto animate-fadeIn">
      {/* ROYAL DIGITAL YATRIK PASS CONTAINER */}
      <div 
        id="printable-receipt"
        className="relative bg-[#FFFDF8] rounded-3xl border-4 border-[#C59B27] shadow-2xl p-4 sm:p-7 md:p-8 overflow-hidden text-yatra-charcoal"
      >
        {/* Ornate Corner Elements in Maroon & Gold */}
        <div className="absolute top-2.5 left-2.5 w-7 h-7 border-t-2 border-l-2 border-[#6E0D1C] pointer-events-none"></div>
        <div className="absolute top-2.5 right-2.5 w-7 h-7 border-t-2 border-r-2 border-[#6E0D1C] pointer-events-none"></div>
        <div className="absolute bottom-2.5 left-2.5 w-7 h-7 border-b-2 border-l-2 border-[#6E0D1C] pointer-events-none"></div>
        <div className="absolute bottom-2.5 right-2.5 w-7 h-7 border-b-2 border-r-2 border-[#6E0D1C] pointer-events-none"></div>

        {/* Decorative Inner Golden Dashed Border */}
        <div className="absolute inset-2 border border-dashed border-[#C59B27]/40 rounded-2xl pointer-events-none"></div>

        {/* Top Auspicious Header Banner */}
        <div className="relative text-center border-b-2 border-[#C59B27]/30 pb-5 mb-5 space-y-2">
          {/* Mangal Shloka */}
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-[#6E0D1C] font-gujarati tracking-wider">
            <span>卐</span>
            <span>શ્રી આદેશ્વર દાદા પ્રસન્ન</span>
            <span>卐</span>
          </div>

          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#6E0D1C] font-gujaratiSerif tracking-tight leading-tight matra-safe">
            શ્રી બેતાલીસ વિશા શ્રીમાળી જૈન સમાજ
          </h2>
          <h3 className="text-xs sm:text-sm font-serifHeading font-bold text-[#C59B27] tracking-widest uppercase">
            SHRI SHATRUNJAY GIRIRAJ 99 YATRA • OFFICIAL DIGITAL YATRIK PASS
          </h3>
          <p className="text-[11px] sm:text-xs text-gray-600 font-gujarati matra-safe">
            શાશ્વતાગિરિના પથ પર ૯૯ યાત્રા સહ છ'રી પાલિત યાત્રા સંઘ • પાલિતાણા મહાતીર્થ
          </p>

          {/* Verification Badge */}
          <div className="pt-2 flex items-center justify-center space-x-2">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs font-gujarati shadow-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>સત્તાવાર માન્ય યાત્રિક પાસ (Verified Yatrik Pass)</span>
            </span>
          </div>
        </div>

        {/* Registration ID & QR / Status Strip */}
        <div className="bg-gradient-to-r from-amber-50/90 via-[#FDF8F0] to-amber-50/90 rounded-2xl p-4 border-2 border-[#C59B27]/40 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 mb-5">
          <div>
            <span className="text-[10px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-wider block font-serif">
              REGISTRATION CONFIRMATION ID
            </span>
            <div className="flex items-center space-x-2 mt-0.5">
              <span className="font-mono font-black text-xl sm:text-2xl text-[#6E0D1C] tracking-wider">
                {registration.registrationId}
              </span>
              <button
                type="button"
                onClick={handleCopyId}
                className="p-1.5 rounded-lg bg-white border border-[#C59B27]/40 text-[#6E0D1C] hover:bg-amber-100 transition-colors shadow-sm"
                title="Copy Registration ID"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="text-center sm:text-right">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">સ્થિતિ (Status)</span>
            <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              registration.status === 'Confirmed'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-amber-600 text-white shadow-sm'
            }`}>
              {registration.status || 'Confirmed'}
            </span>
          </div>
        </div>

        {/* Devotee Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 text-xs sm:text-sm font-gujarati mb-5">
          
          {/* Devotee Name */}
          <div className="p-3 bg-white rounded-xl border border-[#C59B27]/25 shadow-sm">
            <span className="text-[11px] font-semibold text-gray-500 block">મુખ્ય યાત્રિકનું નામ (Devotee Name)</span>
            <span className="text-sm sm:text-base font-bold text-[#6E0D1C] block matra-safe">
              {registration.fullName}
            </span>
            {(registration.age || registration.gender) && (
              <span className="text-xs text-gray-500 block mt-0.5">
                {registration.gender} • {registration.age} વર્ષ
              </span>
            )}
          </div>

          {/* Contact Details */}
          <div className="p-3 bg-white rounded-xl border border-[#C59B27]/25 shadow-sm">
            <span className="text-[11px] font-semibold text-gray-500 block">સંપર્ક વિગત (Contact)</span>
            <span className="font-bold text-gray-900 block font-mono">
              +91 {registration.mobileNumber}
            </span>
            {registration.email && (
              <span className="text-xs text-gray-600 block truncate mt-0.5">
                {registration.email}
              </span>
            )}
          </div>

          {/* City / State */}
          <div className="p-3 bg-white rounded-xl border border-[#C59B27]/25 shadow-sm">
            <span className="text-[11px] font-semibold text-gray-500 block">સ્થળ / શહેર (City & State)</span>
            <span className="font-bold text-gray-800 block matra-safe">
              {registration.city}, {registration.state} {registration.pincode ? `(${registration.pincode})` : ''}
            </span>
          </div>

          {/* Registration Category */}
          <div className="p-3 bg-white rounded-xl border border-[#C59B27]/25 shadow-sm">
            <span className="text-[11px] font-semibold text-gray-500 block">યાત્રા કેટેગરી (Category)</span>
            <span className="font-bold text-[#6E0D1C] block matra-safe">
              {registration.registrationCategory}
            </span>
          </div>

          {/* Total Participants */}
          <div className="p-3 bg-white rounded-xl border border-[#C59B27]/25 shadow-sm">
            <span className="text-[11px] font-semibold text-gray-500 block">કુલ સભ્યો (Total Participants)</span>
            <span className="font-bold text-gray-900 block matra-safe">
              {registration.totalParticipants || (registration.familyMembers ? registration.familyMembers.length + 1 : 1)} વ્યક્તિ
            </span>
          </div>

          {/* Doli Assistance */}
          <div className={`p-3 rounded-xl border shadow-sm ${
            registration.doliAssistanceRequired
              ? 'bg-amber-50 border-amber-300 text-amber-900'
              : 'bg-white border-[#C59B27]/25 text-gray-700'
          }`}>
            <span className="text-[11px] font-semibold block">ડોળી / પાલખી સહાય (Doli Support)</span>
            <span className="font-bold block matra-safe">
              {registration.doliAssistanceRequired ? '✦ વિનંતી નોંધાયેલ છે (Requested)' : 'જરૂર નથી (Not Required)'}
            </span>
          </div>
        </div>

        {/* Family Members Breakdown (if any) */}
        {registration.familyMembers && registration.familyMembers.length > 0 && (
          <div className="border-2 border-[#C59B27]/30 rounded-2xl overflow-hidden mb-5 font-gujarati">
            <div className="bg-gradient-to-r from-[#6E0D1C] to-yatra-maroon text-amber-100 text-xs font-bold px-4 py-2 flex items-center justify-between">
              <span>સાથે આવનાર પરિવારના સભ્યો ({registration.familyMembers.length})</span>
              <span className="text-[10px] text-amber-200/80 font-serif">FAMILY MEMBERS</span>
            </div>
            <div className="divide-y divide-gray-100 bg-white">
              {registration.familyMembers.map((m, idx) => (
                <div key={idx} className="p-3 text-xs flex items-center justify-between hover:bg-amber-50/40 transition-colors">
                  <span className="font-bold text-gray-900">
                    {idx + 1}. {m.name} {m.relation ? `(${m.relation})` : ''}
                  </span>
                  <span className="text-gray-500">
                    {m.gender} • {m.age} વર્ષ
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sacred Jain Shloka Footer on Card */}
        <div className="text-center pt-3 pb-2 border-t-2 border-[#C59B27]/30 text-xs text-[#6E0D1C] font-bold font-gujarati matra-safe">
          <span>॥ જેણે શત્રુંજય ના જોયો, તેનો માનવભવ એળે ગયો ॥</span>
        </div>

        {/* Action Buttons: PDF Download, Print, New Form (no-print) */}
        <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 not-printable">
          <button
            type="button"
            onClick={() => generateDevoteePassPDF(registration)}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-[#6E0D1C] to-yatra-maroon hover:from-yatra-maroon hover:to-[#6E0D1C] text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 font-gujarati text-xs sm:text-sm border border-amber-300/40"
          >
            <FileDown className="w-4 h-4 text-amber-200" />
            <span>યાત્રા પાસ ડાઉનલોડ (PDF Pass)</span>
          </button>

          <div className="flex items-center space-x-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => window.print()}
              className="flex-1 sm:flex-initial px-4 py-2.5 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-bold rounded-xl transition-all flex items-center justify-center space-x-1.5 text-xs font-gujarati shadow-sm"
            >
              <Printer className="w-4 h-4 text-gray-500" />
              <span>પ્રિન્ટ પાસ (Print)</span>
            </button>

            {onReset && (
              <button
                type="button"
                onClick={onReset}
                className="flex-1 sm:flex-initial px-4 py-2.5 bg-amber-100 hover:bg-amber-200 border border-[#C59B27] text-[#6E0D1C] font-bold rounded-xl transition-all flex items-center justify-center space-x-1 text-xs font-gujarati shadow-sm"
              >
                <span>બીજું ફોર્મ (New)</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

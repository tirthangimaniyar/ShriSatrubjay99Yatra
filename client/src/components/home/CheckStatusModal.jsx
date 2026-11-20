import React, { useState } from 'react';
import { Search, X, CheckCircle, Clock, AlertCircle, FileDown, Printer, User, Phone, MapPin } from 'lucide-react';
import { generateDevoteePassPDF } from '../../utils/pdfGenerator';
import { getApiUrl } from '../../config';

export const CheckStatusModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) {
      setError('કૃપા કરીને રજીસ્ટ્રેશન આઇડી અથવા ૧૦ આંકડાનો મોબાઈલ નંબર દાખલ કરો.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(getApiUrl(`/api/registrations/check/${encodeURIComponent(query.trim())}`));
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || 'કોઈ રજીસ્ટ્રેશન મળ્યું નથી. કૃપા કરીને દાખલ કરેલ વિગત ચકાસો.');
        return;
      }

      setResult(data.registration);
    } catch (err) {
      setError('સર્વર સાથે સંપર્ક થઈ શક્યો નથી. ફરી પ્રયાસ કરો.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl border-2 border-yatra-gold max-w-lg w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="text-center mb-6 space-y-1">
          <div className="w-12 h-12 rounded-full bg-yatra-maroon/10 text-yatra-maroon flex items-center justify-center mx-auto mb-2 border border-yatra-gold/30">
            <Search className="w-6 h-6 text-yatra-goldDark" />
          </div>
          <h3 className="text-xl font-bold text-yatra-maroon font-gujarati">
            રજીસ્ટ્રેશન સ્થિતિ ચકાસો (Check Status)
          </h3>
          <p className="text-xs text-gray-500 font-gujarati">
            આપનો ૧૦ આંકડાનો મોબાઈલ નંબર અથવા રજીસ્ટ્રેશન આઇડી દાખલ કરો
          </p>
        </div>

        {/* Search Input Form */}
        <form onSubmit={handleSearch} className="space-y-3 mb-6">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="દા.ત. 99YATRA-2027-1001 અથવા 9876543210"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-yatra-gold focus:outline-none font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-yatra-maroon to-yatra-maroonLight hover:from-yatra-maroonLight hover:to-yatra-maroon text-white font-bold rounded-xl shadow-md transition-all font-gujarati text-sm flex items-center justify-center space-x-2"
          >
            {loading ? (
              <span>ચકાસી રહ્યા છીએ...</span>
            ) : (
              <>
                <Search className="w-4 h-4 text-amber-200" />
                <span>સ્થિતિ શોધો (Search Details)</span>
              </>
            )}
          </button>
        </form>

        {/* Error message */}
        {error && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center space-x-2 font-gujarati mb-4">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Result Details */}
        {result && (
          <div className="bg-yatra-cream/60 border border-yatra-gold/30 rounded-2xl p-4 space-y-3 font-gujarati animate-fadeIn">
            <div className="flex items-center justify-between border-b border-yatra-gold/20 pb-2">
              <div>
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block font-serif">REGISTRATION ID</span>
                <span className="font-mono font-bold text-yatra-maroon text-base">{result.registrationId}</span>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                result.status === 'Confirmed'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-amber-100 text-amber-800 border border-amber-300'
              }`}>
                {result.status}
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-gray-700">
              <p><span className="font-bold text-gray-900">યાત્રિક:</span> {result.fullName} ({result.gender}, {result.age} વર્ષ)</p>
              <p><span className="font-bold text-gray-900">મોબાઈલ:</span> {result.mobileNumber}</p>
              <p><span className="font-bold text-gray-900">શહેર:</span> {result.city}, {result.state}</p>
              <p><span className="font-bold text-gray-900">કેટેગરી:</span> {result.registrationCategory}</p>
              <p><span className="font-bold text-gray-900">કુલ સભ્યો:</span> {result.totalParticipants} વ્યક્તિ</p>
            </div>

            <div className="pt-2 border-t border-yatra-gold/20 flex items-center space-x-2">
              <button
                onClick={() => generateDevoteePassPDF(result)}
                className="flex-1 py-2 px-3 bg-yatra-maroon text-white font-bold text-xs rounded-xl shadow-sm hover:bg-yatra-maroonLight transition-colors flex items-center justify-center space-x-1.5"
              >
                <FileDown className="w-3.5 h-3.5 text-amber-200" />
                <span>પાસ ડાઉનલોડ (PDF)</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

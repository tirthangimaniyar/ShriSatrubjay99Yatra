import React from 'react';
import { Heart, Search, Phone, UserCheck, Sparkles } from 'lucide-react';

export const FloatingQuickBar = ({ onRegisterClick, onOpenStatusModal }) => {
  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-xl border-t-2 border-[#C59B27]/40 shadow-[0_-5px_25px_rgba(0,0,0,0.12)] px-2 py-2 pb-3">
      <div className="grid grid-cols-3 gap-1.5 max-w-md mx-auto items-center">
        
        {/* 1. Register Action Button */}
        <button
          type="button"
          onClick={onRegisterClick}
          className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-gradient-to-r from-[#6E0D1C] to-yatra-maroon text-white shadow-md active:scale-95 transition-transform"
        >
          <Heart className="w-4 h-4 text-amber-200 fill-current mb-0.5" />
          <span className="text-[11px] font-bold font-gujarati leading-tight">
            રજીસ્ટ્રેશન
          </span>
          <span className="text-[9px] text-amber-200/90 font-serif leading-none">
            REGISTER
          </span>
        </button>

        {/* 2. Check Status Action Button */}
        <button
          type="button"
          onClick={onOpenStatusModal}
          className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-amber-50/90 hover:bg-amber-100 border border-[#C59B27]/50 text-[#6E0D1C] shadow-sm active:scale-95 transition-transform"
        >
          <Search className="w-4 h-4 text-[#C59B27] mb-0.5" />
          <span className="text-[11px] font-bold font-gujarati leading-tight">
            સ્ટેટસ જુઓ
          </span>
          <span className="text-[9px] text-[#6E0D1C]/80 font-serif leading-none">
            CHECK STATUS
          </span>
        </button>

        {/* 3. Direct Phone Call / Helpline */}
        <a
          href="tel:+916352366615"
          className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-white hover:bg-emerald-50 border border-emerald-500/40 text-emerald-800 shadow-sm active:scale-95 transition-transform"
        >
          <Phone className="w-4 h-4 text-emerald-600 mb-0.5" />
          <span className="text-[11px] font-bold font-gujarati leading-tight">
            સંઘ હેલ્પલાઇન
          </span>
          <span className="text-[9px] text-emerald-700 font-serif leading-none">
            HELPLINE
          </span>
        </a>

      </div>
    </div>
  );
};

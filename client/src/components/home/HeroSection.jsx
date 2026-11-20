import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Calendar, MapPin, ArrowRight, FileText, Heart, ShieldCheck } from 'lucide-react';

export const HeroSection = ({ onRegisterClick, onInvitationClick }) => {
  return (
    <section id="hero" className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-yatra-cream via-yatra-ivory to-yatra-sand/40 pt-8 pb-16">
      {/* Background Divine Radial Glow & Motifs */}
      <div className="absolute inset-0 bg-mandir-pattern pointer-events-none"></div>
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-b from-amber-200/25 via-yatra-gold/15 to-transparent blur-3xl pointer-events-none rounded-full"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* LEFT / TOP on mobile: The Sacred Jain Tirthankar Idol (IMAGE 3) - PLACED PROMINENTLY */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-5 flex flex-col items-center justify-center order-1 lg:order-2"
          >
            {/* Ornate Temple Mandap Frame for the Idol */}
            <div className="relative group">
              {/* Outer Golden Aura Effect */}
              <div className="absolute -inset-3 bg-gradient-to-r from-yatra-goldLight via-amber-300 to-yatra-gold rounded-3xl blur-md opacity-60 group-hover:opacity-85 transition-opacity duration-700 animate-pulse"></div>

              {/* Main Frame Container */}
              <div className="relative bg-gradient-to-b from-amber-50 via-white to-amber-100/90 p-3 sm:p-4 rounded-2xl shadow-gold-lg border-2 border-yatra-gold">
                {/* Traditional Corner Golden Ornaments */}
                <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-yatra-maroon z-20"></div>
                <div className="absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2 border-yatra-maroon z-20"></div>
                <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 border-yatra-maroon z-20"></div>
                <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-yatra-maroon z-20"></div>

                {/* Holy Arch Top Header */}
                <div className="bg-gradient-to-r from-yatra-maroon via-yatra-maroonLight to-yatra-maroon text-amber-100 text-center py-1.5 px-3 rounded-t-xl text-xs font-gujarati font-semibold border-b border-yatra-gold mb-2 shadow-sm flex items-center justify-center space-x-2">
                  <span className="text-yatra-goldAccent">✦</span>
                  <span>શ્રી આદિનાથ ભગવાન (મૂળનાયક શ્રી શત્રુંજય)</span>
                  <span className="text-yatra-goldAccent">✦</span>
                </div>

                {/* The Sacred Image (Image 3) */}
                <div className="relative overflow-hidden rounded-xl max-w-sm sm:max-w-md mx-auto aspect-[3/4] bg-stone-900 shadow-inner">
                  <img
                    src="/images/hero-idol.png"
                    alt="Shri Adinath Bhagwan Palitana Idol"
                    className="w-full h-full object-cover object-center transform group-hover:scale-102 transition-transform duration-700 divine-glow"
                  />
                  {/* Subtle lighting overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none"></div>

                  {/* Devotional Bottom Caption on Image */}
                  <div className="absolute bottom-3 inset-x-3 text-center bg-black/60 backdrop-blur-sm py-1.5 px-3 rounded-lg border border-amber-300/30">
                    <p className="text-amber-200 text-xs sm:text-sm font-bold font-gujarati">
                      ॥ જય ગિરિરાજ! જય આદેશ્વર દાદા ॥
                    </p>
                  </div>
                </div>

                {/* Bottom Auspicious Sub-caption */}
                <div className="mt-2 text-center text-[11px] text-yatra-maroon font-semibold font-gujarati flex items-center justify-center space-x-1">
                  <span>શાશ્વત તીર્થ ગિરિરાજ પાલિતાણા</span>
                  <span>•</span>
                  <span>સુવર્ણ આંગી અને પુષ્પ દર્શન</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT / MAIN CONTENT: Headings, Details, Call to Action */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-7 space-y-6 order-2 lg:order-1 text-center lg:text-left"
          >
            {/* Auspicious Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-yatra-maroon/10 via-amber-100 to-yatra-maroon/10 border border-yatra-gold/50 shadow-sm text-yatra-maroon font-semibold text-xs sm:text-sm font-gujarati">
              <span className="text-yatra-gold text-base">卐</span>
              <span>શ્રી બેતાલીસ વિશા શ્રીમાળી જૈન સમાજ આયોજિત</span>
              <span className="text-yatra-gold text-base">卐</span>
            </div>

            {/* Main Headings */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-extrabold text-yatra-maroon font-gujarati leading-tight tracking-tight drop-shadow-sm">
                શ્રી શત્રુંજય ગિરિરાજ ૯૯ યાત્રા
              </h1>
              <h2 className="text-lg sm:text-xl md:text-2xl font-serifHeading font-bold text-yatra-purple tracking-wide">
                Shri Shatrunjay Giriraj 99 Yatra
              </h2>
              <p className="text-sm sm:text-base font-semibold text-yatra-goldDark font-gujarati">
                શાશ્વતાગિરિના પથ પર ૯૯ યાત્રા સહ છ'રી પાલિત યાત્રા સંઘ
              </p>
            </div>

            {/* Gujarati Description */}
            <p className="text-base sm:text-lg text-yatra-charcoal/85 leading-relaxed font-gujarati max-w-2xl mx-auto lg:mx-0">
              "પરમાત્માની પાવન ભક્તિ અને શ્રી શત્રુંજય ગિરિરાજની પવિત્ર યાત્રામાં જોડાવા માટે આપનું હાર્દિક સ્વાગત છે."
            </p>

            {/* Key Information Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto lg:mx-0 pt-1 text-left">
              <div className="flex items-center space-x-3 p-3 bg-white/80 rounded-xl border border-yatra-gold/30 shadow-sm backdrop-blur-sm">
                <div className="w-9 h-9 rounded-lg bg-yatra-maroon/10 flex items-center justify-center text-yatra-maroon shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block">તીર્થ સ્થળ</span>
                  <span className="text-xs sm:text-sm font-bold text-yatra-charcoal font-gujarati">શ્રી શત્રુંજય ગિરિરાજ, પાલિતાણા</span>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-white/80 rounded-xl border border-yatra-gold/30 shadow-sm backdrop-blur-sm">
                <div className="w-9 h-9 rounded-lg bg-yatra-gold/15 flex items-center justify-center text-yatra-goldDark shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block">યાત્રા સમયગાળો</span>
                  <span className="text-xs sm:text-sm font-bold text-yatra-charcoal font-gujarati">કારતક સુદ ૧૫ થી મહા સુદ ૧૦</span>
                </div>
              </div>
            </div>

            {/* Two Main Call-To-Action Buttons */}
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={onRegisterClick}
                className="w-full sm:w-auto px-7 py-3.5 text-base font-bold text-white bg-gradient-to-r from-yatra-maroon via-yatra-maroonLight to-yatra-maroon hover:shadow-maroon-lg rounded-xl shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0 font-gujarati flex items-center justify-center space-x-2 border border-yatra-goldLight/50"
              >
                <Heart className="w-5 h-5 text-amber-200 fill-current" />
                <span>યાત્રા રજીસ્ટ્રેશન કરો (Register for Yatra)</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                onClick={onInvitationClick}
                className="w-full sm:w-auto px-6 py-3.5 text-base font-bold text-yatra-maroon bg-white hover:bg-amber-50/80 rounded-xl shadow-md border-2 border-yatra-gold transition-all transform hover:-translate-y-0.5 active:translate-y-0 font-gujarati flex items-center justify-center space-x-2"
              >
                <FileText className="w-5 h-5 text-yatra-goldDark" />
                <span>સંઘ પત્રિકા જુઓ (View Invitation)</span>
              </button>
            </div>

            {/* Sub-notice */}
            <div className="pt-2 text-xs text-gray-600 font-gujarati flex items-center justify-center lg:justify-start space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>ઓનલાઇન ફોર્મ ભરીને તુરંત કન્ફર્મેશન આઇડી અને યતિ પાસ મેળવો.</span>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

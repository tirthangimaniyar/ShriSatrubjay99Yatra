import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, ArrowRight, FileText, Heart, ShieldCheck } from 'lucide-react';

export const HeroSection = ({ onRegisterClick, onInvitationClick }) => {
  return (
    <section id="hero" className="relative min-h-[92vh] flex items-center justify-center overflow-hidden pt-8 pb-16 lg:py-20">
      
      {/* 1. Full-Bleed Palitana Giriraj Landscape Background with Ambient Slow Drift */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img
          src="/images/gallery/palitana-panoramic.jpg"
          alt="Shri Shatrunjay Mahatirth Palitana Panoramic View"
          className="w-full h-full object-cover object-center animate-hero-drift"
        />
      </div>

      {/* 2. Multi-Stop Sacred Ivory & Cream Readability Gradient Overlays */}
      {/* Desktop Left-to-Right Sacred Ivory Gradient */}
      <div
        className="absolute inset-0 pointer-events-none hidden lg:block"
        style={{
          background: 'linear-gradient(90deg, rgba(253, 248, 240, 0.94) 0%, rgba(253, 248, 240, 0.91) 40%, rgba(253, 248, 240, 0.68) 65%, rgba(253, 248, 240, 0.82) 100%)'
        }}
      />

      {/* Mobile / Tablet Vertical Gradient for High Text Legibility */}
      <div
        className="absolute inset-0 pointer-events-none lg:hidden"
        style={{
          background: 'linear-gradient(180deg, rgba(253, 248, 240, 0.94) 0%, rgba(253, 248, 240, 0.84) 45%, rgba(253, 248, 240, 0.93) 100%)'
        }}
      />

      {/* Subtle Auspicious Jain Mandir Geometric Pattern */}
      <div className="absolute inset-0 bg-mandir-pattern opacity-60 pointer-events-none" />

      {/* Seamless Bottom Gradient Fade into next section (no harsh horizontal seam) */}
      <div
        className="absolute inset-x-0 bottom-0 h-32 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, rgba(253, 248, 240, 0.65) 45%, #FFFDF8 100%)'
        }}
      />

      {/* 3. Main Hero Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* RIGHT-SIDE on desktop / TOP on mobile: Ornate Shri Adinath Bhagwan Shrine Frame */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.85, ease: "easeOut" }}
            className="lg:col-span-5 flex flex-col items-center justify-center order-1 lg:order-2 relative"
          >
            {/* Sacred Divine Halo / Golden Radial Glow behind the Idol Shrine Card */}
            <div
              className="absolute -inset-6 sm:-inset-10 pointer-events-none rounded-full blur-3xl opacity-80"
              style={{
                background: 'radial-gradient(circle at center, rgba(245, 197, 85, 0.45) 0%, rgba(200, 147, 38, 0.22) 45%, transparent 70%)'
              }}
            />

            {/* Ornate Temple Mandap Frame for the Idol */}
            <div className="relative group w-full max-w-sm sm:max-w-md">
              {/* Outer Golden Aura Effect */}
              <div className="absolute -inset-3 bg-gradient-to-r from-yatra-goldLight via-amber-300 to-yatra-gold rounded-3xl blur-md opacity-60 group-hover:opacity-85 transition-opacity duration-700 animate-pulse pointer-events-none"></div>

              {/* Main Frame Container with Glassmorphism */}
              <div className="relative bg-white/90 backdrop-blur-md p-3.5 sm:p-5 rounded-2xl shadow-2xl border-2 border-amber-500/40">
                {/* Traditional Corner Golden Ornaments */}
                <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-yatra-maroon z-20"></div>
                <div className="absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2 border-yatra-maroon z-20"></div>
                <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 border-yatra-maroon z-20"></div>
                <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-yatra-maroon z-20"></div>

                {/* Holy Arch Top Header */}
                <div className="bg-gradient-to-r from-yatra-maroon via-yatra-maroonLight to-yatra-maroon text-amber-100 text-center py-2 px-3 rounded-t-xl text-xs sm:text-sm font-gujarati font-semibold border-b border-yatra-gold mb-2.5 shadow-sm flex items-center justify-center space-x-2">
                  <span className="text-yatra-goldAccent">✦</span>
                  <span>શ્રી આદિનાથ ભગવાન (મૂળનાયક શ્રી શત્રુંજય)</span>
                  <span className="text-yatra-goldAccent">✦</span>
                </div>

                {/* The Sacred Image */}
                <div className="relative overflow-hidden rounded-xl mx-auto aspect-[3/4] bg-stone-900 shadow-inner">
                  <img
                    src="/images/hero-idol.png"
                    alt="Shri Adinath Bhagwan Palitana Idol"
                    className="w-full h-full object-cover object-center transform group-hover:scale-102 transition-transform duration-700 divine-glow"
                  />
                  {/* Subtle lighting overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>

                  {/* Devotional Bottom Caption on Image */}
                  <div className="absolute bottom-3 inset-x-3 text-center bg-black/65 backdrop-blur-md py-2 px-3 rounded-lg border border-amber-300/40 shadow-md">
                    <p className="text-amber-200 text-xs sm:text-sm font-bold font-gujarati tracking-wide">
                      ॥ જય ગિરિરાજ! જય આદેશ્વર દાદા ॥
                    </p>
                  </div>
                </div>

                {/* Bottom Auspicious Sub-caption */}
                <div className="mt-2.5 text-center text-[11px] sm:text-xs text-yatra-maroon font-semibold font-gujarati flex items-center justify-center space-x-1.5">
                  <span>શાશ્વત તીર્થ ગિરિરાજ પાલિતાણા</span>
                  <span className="text-amber-600 font-bold">•</span>
                  <span>સુવર્ણ આંગી અને પુષ્પ દર્શન</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* LEFT-SIDE / MAIN CONTENT: Headings, Details, Call to Action */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="lg:col-span-7 space-y-6 order-2 lg:order-1 text-center lg:text-left"
          >
            {/* Top Auspicious Badge with Glassmorphism */}
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/85 backdrop-blur-md border border-amber-500/40 shadow-sm text-yatra-maroon font-semibold text-xs sm:text-sm font-gujarati">
              <span className="text-amber-600 text-base font-bold">卐</span>
              <span>શ્રી બેતાલીસ વિશા શ્રીમાળી જૈન સમાજ આયોજિત</span>
              <span className="text-amber-600 text-base font-bold">卐</span>
            </div>

            {/* Main Headings */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-yatra-royalMaroon font-gujaratiSerif leading-tight tracking-tight drop-shadow-sm matra-safe">
                શ્રી શત્રુંજય ગિરિરાજ ૯૯ યાત્રા
              </h1>
              <h2 className="text-lg sm:text-xl md:text-2xl font-serifHeading font-bold text-yatra-purple tracking-wide">
                Shri Shatrunjay Giriraj 99 Yatra
              </h2>
              <p className="text-sm sm:text-base font-semibold text-[#C59B27] font-gujarati matra-safe">
                શાશ્વતાગિરિના પથ પર ૯૯ યાત્રા સહ છ'રી પાલિત યાત્રા સંઘ
              </p>
            </div>

            {/* Gujarati Description */}
            <p className="text-base sm:text-lg text-yatra-charcoal/90 leading-relaxed font-gujarati max-w-2xl mx-auto lg:mx-0 matra-safe">
              "પરમાત્માની પાવન ભક્તિ અને શ્રી શત્રુંજય ગિરિરાજની પવિત્ર યાત્રામાં જોડાવા માટે આપનું હાર્દિક સ્વાગત છે."
            </p>

            {/* Key Information Badges with Frosted Glass Styling */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-xl mx-auto lg:mx-0 pt-1 text-left">
              <div className="flex items-center space-x-3 p-3.5 bg-white/85 backdrop-blur-md rounded-xl border border-amber-900/15 shadow-md hover:border-amber-600/40 hover:shadow-lg transition duration-300">
                <div className="w-10 h-10 rounded-lg bg-yatra-maroon/10 border border-yatra-maroon/20 flex items-center justify-center text-yatra-maroon shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block">તીર્થ સ્થળ</span>
                  <span className="text-xs sm:text-sm font-bold text-yatra-charcoal font-gujarati">શ્રી શત્રુંજય ગિરિરાજ, પાલિતાણા</span>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3.5 bg-white/85 backdrop-blur-md rounded-xl border border-amber-900/15 shadow-md hover:border-amber-600/40 hover:shadow-lg transition duration-300">
                <div className="w-10 h-10 rounded-lg bg-amber-500/15 border border-amber-600/20 flex items-center justify-center text-yatra-goldDark shrink-0">
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
                className="w-full sm:w-auto px-7 py-3.5 text-base font-bold text-white bg-gradient-to-r from-[#7A1020] via-[#8C1425] to-[#9E1B2E] hover:from-[#660C1A] hover:to-[#8B1324] rounded-xl shadow-lg hover:shadow-2xl hover:shadow-maroon-900/35 transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 font-gujarati flex items-center justify-center space-x-2 border border-amber-300/40"
              >
                <Heart className="w-5 h-5 text-amber-200 fill-current" />
                <span>યાત્રા રજીસ્ટ્રેશન કરો (Register for Yatra)</span>
                <ArrowRight className="w-4 h-4 ml-1 text-amber-200" />
              </button>

              <button
                onClick={onInvitationClick}
                className="w-full sm:w-auto px-6 py-3.5 text-base font-bold text-yatra-maroon bg-white/90 backdrop-blur-md hover:bg-white rounded-xl shadow-md hover:shadow-lg border-2 border-[#7A1020]/30 hover:border-[#7A1020] transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 font-gujarati flex items-center justify-center space-x-2"
              >
                <FileText className="w-5 h-5 text-yatra-goldDark" />
                <span>સંઘ પત્રિકા જુઓ (View Invitation)</span>
              </button>
            </div>

            {/* Sub-notice */}
            <div className="pt-2 text-xs text-gray-700 font-medium font-gujarati flex items-center justify-center lg:justify-start space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>ઓનલાઇન ફોર્મ ભરીને તુરંત કન્ફર્મેશન આઇડી અને યતિ પાસ મેળવો.</span>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

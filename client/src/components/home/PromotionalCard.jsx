import React from 'react';
import { Calendar, MapPin, Users, HeartHandshake, Sparkles, ArrowRight, CheckCircle2, Phone } from 'lucide-react';

export const PromotionalCard = ({ onRegisterClick, onInvitationClick }) => {
  return (
    <section className="py-8 bg-yatra-ivory relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Promotional Card Container */}
        <div className="bg-gradient-to-br from-white via-amber-50/40 to-white rounded-3xl border-2 border-yatra-gold/60 shadow-gold-lg overflow-hidden transition-all duration-300 hover:shadow-2xl">
          
          {/* Top Banner Header */}
          <div className="bg-gradient-to-r from-yatra-maroon via-yatra-maroonLight to-yatra-maroon p-5 sm:p-6 text-white text-center sm:text-left flex flex-col sm:flex-row items-center justify-between border-b-2 border-yatra-gold relative">
            <div className="space-y-1 mb-3 sm:mb-0">
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-yatra-gold/30 border border-yatra-goldLight/40 text-amber-200 text-xs font-semibold font-gujarati">
                <Sparkles className="w-3 h-3 text-yatra-goldAccent" />
                <span>શાશ્વતાગિરિના પથ પર ૯૯ યાત્રા સહ છ'રી પાલિત સંઘ</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-gujaratiSerif tracking-wide text-amber-100 matra-safe">
                શ્રી બેતાલીસ વિશા શ્રીમાળી જૈન સમાજ
              </h3>
              <p className="text-xs text-amber-200/80 font-serifHeading">
                SHRI BETALISI VISA SHRIMALI JAIN SAMAJ PALITANA YATRA
              </p>
            </div>

            {/* Helpline quick badge */}
            <div className="bg-black/25 backdrop-blur-sm border border-yatra-gold/40 px-4 py-2.5 rounded-2xl flex items-center space-x-3 shrink-0">
              <div className="w-9 h-9 rounded-full bg-yatra-gold flex items-center justify-center text-white shadow-sm">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-200/80 block tracking-wider">સંઘ હેલ્પલાઇન</span>
                <a href="tel:+916352366615" className="text-sm font-bold text-white hover:text-amber-200 transition-colors">
                  +91 63523 66615
                </a>
              </div>
            </div>
          </div>

          {/* Card Body with Key Specifications & Devotional Details */}
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Quick Highlight Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-yatra-cream border border-yatra-gold/30 rounded-xl p-3 text-center">
                <Calendar className="w-5 h-5 mx-auto text-yatra-maroon mb-1" />
                <span className="text-[11px] text-gray-500 font-medium block">યાત્રા પર્વ</span>
                <span className="text-xs font-bold text-yatra-charcoal font-gujarati">૯૯ યાત્રા મહોત્સવ</span>
              </div>
              <div className="bg-yatra-cream border border-yatra-gold/30 rounded-xl p-3 text-center">
                <MapPin className="w-5 h-5 mx-auto text-yatra-goldDark mb-1" />
                <span className="text-[11px] text-gray-500 font-medium block">પાવન તીર્થ</span>
                <span className="text-xs font-bold text-yatra-charcoal font-gujarati">પાલિતાણા ગિરિરાજ</span>
              </div>
              <div className="bg-yatra-cream border border-yatra-gold/30 rounded-xl p-3 text-center">
                <HeartHandshake className="w-5 h-5 mx-auto text-purple-800 mb-1" />
                <span className="text-[11px] text-gray-500 font-medium block">છ'રી પાલિત નિયમ</span>
                <span className="text-xs font-bold text-yatra-charcoal font-gujarati">૬ ધર્મ નિયમ પાલન</span>
              </div>
              <div className="bg-yatra-cream border border-yatra-gold/30 rounded-xl p-3 text-center">
                <Users className="w-5 h-5 mx-auto text-emerald-700 mb-1" />
                <span className="text-[11px] text-gray-500 font-medium block">સંઘ વ્યવસ્થા</span>
                <span className="text-xs font-bold text-yatra-charcoal font-gujarati">ધર્મશાળા & ભોજનશાળા</span>
              </div>
            </div>

            {/* Nishra Data & Labharthi Summary */}
            <div className="bg-amber-50/70 border-l-4 border-yatra-maroon p-4 rounded-r-xl space-y-2 font-gujarati">
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-5 h-5 text-yatra-maroon shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-yatra-maroon text-sm">પાવન નિશ્રા દાતા : </span>
                  <span className="text-xs sm:text-sm text-gray-800">
                    પ.પૂ.આ.ભ. શ્રી જગતચંદ્રસૂરીશ્વરજી મ.સા. તથા પ.પૂ.આ.ભ. શ્રી જીનેશરત્નસૂરીશ્વરજી મ.સા. તથા સમાજના સર્વે સાધુ સાધ્વી ભગવંતો પધારશે.
                  </span>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-5 h-5 text-yatra-goldDark shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-yatra-goldDark text-sm">મુખ્ય લાભાર્થી પરિવારો : </span>
                  <span className="text-xs sm:text-sm text-gray-800">
                    માતુશ્રી કંચનબેન શાંતિલાલ શાહ પરિવાર (એકલારા-સુરત) & માતુશ્રી કાન્તાબેન ગીરધરલાલ વાડીલાલ શાહ પરિવાર (તેનીવાડા-સુરત).
                  </span>
                </div>
              </div>
            </div>

            {/* Footer Call to Action strip inside card */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-yatra-gold/30">
              <div className="text-xs text-gray-600 font-gujarati text-center sm:text-left">
                <p className="font-semibold text-yatra-maroon">
                  મર્યાદિત સંખ્યામાં યાત્રિકો માટે બેઠકો ઉપલબ્ધ છે.
                </p>
                <p>વહેલા તે પહેલાના ધોરણે ઓનલાઇન રજીસ્ટ્રેશન સુવિધા ઉપલબ્ધ છે.</p>
              </div>

              <div className="flex items-center space-x-3 w-full sm:w-auto">
                <button
                  onClick={onInvitationClick}
                  className="flex-1 sm:flex-initial px-4 py-2.5 text-xs sm:text-sm font-semibold text-yatra-purple bg-white border border-yatra-gold/50 hover:bg-amber-50 rounded-xl transition-all font-gujarati"
                >
                  પત્રિકા જુઓ
                </button>
                <button
                  onClick={onRegisterClick}
                  className="flex-1 sm:flex-initial px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-yatra-maroon hover:bg-yatra-maroonLight rounded-xl shadow-md transition-all font-gujarati flex items-center justify-center space-x-1.5"
                >
                  <span>હમણાં રજીસ્ટર કરો</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

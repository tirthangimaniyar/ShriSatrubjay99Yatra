import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Mountain, 
  Heart, 
  Compass, 
  Award, 
  Calendar, 
  Sun, 
  Clock, 
  Flag, 
  CheckCircle2, 
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import { OrnamentalDivider } from '../common/OrnamentalDivider';

export const AboutYatra = () => {
  const [activeTab, setActiveTab] = useState('timeline'); // 'timeline' | 'significance'

  // Sacred 99 Yatra Pilgrimage Milestones
  const timelineMilestones = [
    {
      step: "૦૧",
      milestone: "પ્રારંભ પર્વ",
      date: "કારતક સુદ ૧૫ (દેવ દિવાળી)",
      title: "મંગલ પ્રયાણ & જયતળેટી પાવન વંદના",
      englishTitle: "Mangal Aarambh - Kartak Sud 15",
      badge: "પ્રારંભ પર્વ • STAGE 1",
      desc: "દેવ દિવાળીના પરમ પવિત્ર દિવસે પૂજ્ય આચાર્ય ભગવંતોની પાટોપચાર નિશ્રામાં સંઘનું મંગલ પ્રયાણ થશે. જયતળેટી ખાતે પ્રથમ ગિરિરાજ નમસ્કાર સાથે ૯૯ યાત્રાનો સંકલ્પ લેવાશે.",
      highlight: "ગિરિરાજ ચરણ સ્પર્શ અને પ્રથમ સંઘ પ્રયાણ"
    },
    {
      step: "૦૨",
      milestone: "ગિરિરાજ આરોહણ",
      date: "પ્રત્યેક યાત્રા સવાર",
      title: "૩,૮૦૦+ પવિત્ર પગથિયાંનું તપસ્વી ચઢાણ",
      englishTitle: "3,800+ Sacred Stone Steps Ascent",
      badge: "૩,૮૦૦+ પગથિયાં • PILGRIMAGE PATH",
      desc: "જયતળેટીથી હિંગળાજ આંબલી, બાબુનું દેરું અને રામપોળ દરવાજા સુધીના ૩,૮૦૦ થી વધુ પ્રાચીન પગથિયાં ચઢતાં દરેક ડગલે અસંખ્ય કર્મોની નિર્જરા અને આત્મશુદ્ધિ થાય છે.",
      highlight: "ડોળી અને પાલખી વ્યવસ્થા સહાય ઉપલબ્ધ"
    },
    {
      step: "૦૩",
      milestone: "દિનચર્યા & ભક્તિ",
      date: "નિત્ય ક્રમ",
      title: "દાદાની ભવ્ય આંગી પૂજા, સ્નાત્ર & ચૈત્યવંદન",
      englishTitle: "Daily Chaityavandan & Angi Darshan",
      badge: "દૈનિક આરાધના • DAILY ROUTINE",
      desc: "પ્રાતઃકાળે પ્રભાતિયાં સાથે યાત્રા, મૂળનાયક શ્રી આદિનાથ દાદાના અલૌકિક મુખારવિંદ દર્શન, સ્નાત્ર પૂજા, સામુહિક ચૈત્યવંદન, નવકાર મહામંત્ર જાપ અને સંધ્યા પ્રતિક્રમણ.",
      highlight: "પૂ. ગુરુભગવંતોની નિશ્રામાં સામુહિક જાપ"
    },
    {
      step: "૦૪",
      milestone: "તીર્થ ટૂંક યાત્રા",
      date: "યાત્રા અવધિ",
      title: "મોતીશા ટૂંક, ચૌમુખજી & નવ ટૂંક પરિક્રમા",
      englishTitle: "Sheth Motisha Tonk & Chaumukha Darshan",
      badge: "ટૂંક પરિક્રમા • SACRED SHRINES",
      desc: "આરસ પહાણના વિશ્વવિખ્યાત દેરાસરો, મોતીશા શેઠની ટૂંક, અદ્ભુત ચૌમુખજી જિનાલય અને ગિરિરાજ પર સ્થિત તમામ પાવન જિનબિંબોના એકીસાથે ભાવપૂર્ણ દર્શન.",
      highlight: "અજોડ જૈન શિલ્પકળા અને આધ્યાત્મિક વારસો"
    },
    {
      step: "૦૫",
      milestone: "મહા પૂર્ણાહુતિ",
      date: "મહા સુદ ૧૦",
      title: "૯૯ યાત્રા પરિપૂર્ણ મહોત્સવ & પારણા",
      englishTitle: "Grand Conclusion - Maha Sud 10",
      badge: "પૂર્ણતા પર્વ • GRAND FINALE",
      desc: "૯૯ યાત્રા સંપન્ન થયા બાદ સમવસરણ મહાપૂજા, સાધર્મિક વાત્સલ્ય, ભવ્ય સંઘ જમણ અને તપસ્વી આરાધકોના હૃદયપૂર્વક પારણા મહોત્સવ સાથે યાત્રાની પૂર્ણાહુતિ થશે.",
      highlight: "સર્વ યાત્રિકો માટે બહુમાન અને સ્મૃતિ ભેટ"
    }
  ];

  // 4 Spiritual Pillars of Yatra
  const significanceCards = [
    {
      icon: Mountain,
      title: "શાશ્વત ગિરિરાજ મહિમા",
      englishTitle: "Eternal Sacred Shatrunjay Giriraj",
      desc: "જૈન ધર્મનું સર્વોચ્ચ અને પાવનતમ તીર્થ જ્યાં અસંખ્ય અનંત આત્માઓએ તપશ્ચર્યા કરી મોક્ષ પદ પ્રાપ્ત કર્યું છે. પ્રથમ તીર્થંકર ભગવાન ઋષભદેવ (આદિનાથ) અહીં અનંત વાર પધાર્યા હતા.",
      tag: "શાશ્વત તીર્થ"
    },
    {
      icon: Award,
      title: "૯૯ યાત્રાનું આધ્યાત્મિક મહત્વ",
      englishTitle: "Significance of 99 Yatra (Navanu)",
      desc: "૯૯ યાત્રા એટલે શત્રુંજય ગિરિરાજની ૯૯ વખત શ્રદ્ધા અને તપપૂર્વક કરવામાં આવતી પાવન પરિક્રમા. આ તપથી ભવોભવના કર્મોનો ક્ષય થાય છે અને અંતરાત્મા પાવન બને છે.",
      tag: "કર્મ નિર્જરા"
    },
    {
      icon: Compass,
      title: "છ'રી પાલિત સંઘના ૬ નિયમ",
      englishTitle: "6 Sacred Rules of Chha'ri Palit Sangh",
      desc: "પગપાળા પ્રયાણ, એકાસણું (એક જ વખત આહાર), ભૂમિશયન (જમીન પર શયન), બ્રહ્મચર્ય પાલન, સચિત્ત ત્યાગ (ઉકાળેલું પાણી), અને અક્રોધ (ક્રોધ ત્યાગ). આ છ ધર્મ અંગોનું પાવન પાલન.",
      tag: "આચાર સંહિતા"
    },
    {
      icon: Heart,
      title: "સંઘ ભાવના અને સમુદાય સહયોગ",
      englishTitle: "Community Unity & Sangh Seva",
      desc: "શ્રી બેતાલીસ વિશા શ્રીમાળી જૈન સમાજ દ્વારા તમામ યાત્રિકો માટે સુવિધાયુક્ત ધર્મશાળા, શુદ્ધ જૈન ભોજનશાળા, મેડિકલ સહાય અને ડોળી વ્યવસ્થા ઉપલબ્ધ કરાવાશે.",
      tag: "વાત્સલ્ય & સેવા"
    }
  ];

  return (
    <section id="about" className="py-20 bg-[#F7EFE2] relative overflow-hidden">
      {/* Background Divine Radial Glow & Watermarks */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl pointer-events-none -translate-y-1/2"></div>
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-yatra-gold/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/85 backdrop-blur-md border border-[#C59B27]/50 text-yatra-maroon font-semibold text-xs uppercase tracking-wider font-gujarati shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" />
            <span>યાત્રાનો પાવન મહિમા અને યાત્રા ક્રમ</span>
            <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" />
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-yatra-maroon font-gujaratiSerif tracking-tight leading-tight matra-safe">
            શ્રી શત્રુંજય પાલિતાણા ૯૯ યાત્રા
          </h2>
          <p className="text-sm sm:text-base text-gray-700 font-gujarati max-w-2xl mx-auto leading-relaxed matra-safe">
            "સિદ્ધક્ષેત્ર ગિરિરાજ શત્રુંજય તીર્થ પર એક એક પગલું ભરવાથી કરોડ ગાયોના દાન કરતા પણ અધિક પુણ્ય ઉપાર્જન થાય છે."
          </p>

          <OrnamentalDivider className="my-3" />
        </div>

        {/* Interactive Tab Switcher */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex p-1.5 rounded-2xl bg-white/90 backdrop-blur-md border-2 border-[#C59B27]/40 shadow-md">
            <button
              onClick={() => setActiveTab('timeline')}
              className={`px-5 py-2.5 rounded-xl font-gujarati text-xs sm:text-sm font-bold transition-all duration-300 flex items-center space-x-2 ${
                activeTab === 'timeline'
                  ? 'bg-gradient-to-r from-yatra-royalMaroon to-yatra-maroon text-white shadow-md'
                  : 'text-yatra-charcoal hover:bg-amber-50/70'
              }`}
            >
              <Calendar className="w-4 h-4 text-[#C59B27]" />
              <span>યાત્રા ક્રમ & દિનચર્યા (Pilgrimage Milestones)</span>
            </button>

            <button
              onClick={() => setActiveTab('significance')}
              className={`px-5 py-2.5 rounded-xl font-gujarati text-xs sm:text-sm font-bold transition-all duration-300 flex items-center space-x-2 ${
                activeTab === 'significance'
                  ? 'bg-gradient-to-r from-yatra-royalMaroon to-yatra-maroon text-white shadow-md'
                  : 'text-yatra-charcoal hover:bg-amber-50/70'
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#C59B27]" />
              <span>શાશ્વત મહિમા (Spiritual Significance)</span>
            </button>
          </div>
        </div>

        {/* TAB 1: INTERACTIVE PILGRIMAGE TIMELINE */}
        {activeTab === 'timeline' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {timelineMilestones.map((m, idx) => (
                <div
                  key={idx}
                  className="relative patrika-card rounded-2xl p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
                >
                  {/* Top Step Number & Golden Milestone Badge */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="w-9 h-9 rounded-xl bg-yatra-maroon text-amber-200 font-serifHeading font-bold text-sm flex items-center justify-center shadow-sm">
                        {m.step}
                      </span>
                      <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-amber-100/90 text-yatra-royalMaroon border border-[#C59B27]/40 font-gujarati">
                        {m.badge}
                      </span>
                    </div>

                    {/* Date Tag */}
                    <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#C59B27] mb-2 font-gujarati">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{m.date}</span>
                    </div>

                    <h3 className="text-lg font-bold text-yatra-maroon font-gujaratiSerif mb-1 matra-safe">
                      {m.title}
                    </h3>
                    <h4 className="text-[11px] font-serifHeading text-yatra-purple/80 uppercase tracking-wider mb-3">
                      {m.englishTitle}
                    </h4>

                    <p className="text-xs sm:text-sm text-gray-700 font-gujarati leading-relaxed matra-safe">
                      {m.desc}
                    </p>
                  </div>

                  {/* Highlight pill at bottom */}
                  <div className="pt-4 mt-4 border-t border-[#C59B27]/25 flex items-center text-xs text-yatra-royalMaroon font-semibold font-gujarati space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="truncate">{m.highlight}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick 3,800 Steps Counter Box */}
            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border-2 border-[#C59B27]/50 shadow-md text-center max-w-2xl mx-auto mt-8">
              <div className="flex items-center justify-center space-x-3 text-yatra-maroon mb-2">
                <Mountain className="w-6 h-6 text-[#C59B27]" />
                <span className="text-2xl sm:text-3xl font-black font-serifHeading text-[#C59B27]">3,800+</span>
                <span className="text-lg font-bold font-gujarati">પાવન પગથિયાં</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 font-gujarati leading-relaxed matra-safe">
                શ્રી શત્રુંજય ગિરિરાજ પર તળેટીથી ટોચ સુધી ૩,૮૦૦ થી અધિક પવિત્ર પગથિયાં છે, જ્યાં દરેક ડગલે ભાવિકોને પુણ્યફળ અને આત્મશાંતિ પ્રાપ્ત થાય છે.
              </p>
            </div>
          </motion.div>
        )}

        {/* TAB 2: SPIRITUAL SIGNIFICANCE CARDS */}
        {activeTab === 'significance' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {significanceCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <div
                  key={idx}
                  className="patrika-card rounded-2xl p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-yatra-maroon/10 border border-[#C59B27]/40 flex items-center justify-center text-yatra-maroon group-hover:bg-yatra-maroon group-hover:text-amber-100 transition-colors shadow-sm">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-100 text-yatra-royalMaroon font-gujarati border border-[#C59B27]/30">
                        {card.tag}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-yatra-maroon font-gujaratiSerif mb-1 matra-safe">
                      {card.title}
                    </h3>
                    <h4 className="text-[11px] font-serifHeading text-yatra-purple/80 uppercase tracking-wider mb-3">
                      {card.englishTitle}
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-600 font-gujarati leading-relaxed matra-safe">
                      {card.desc}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#C59B27]/25 flex items-center text-xs text-[#C59B27] font-semibold font-gujarati">
                    <span>શાશ્વત ધર્મ આરાધના</span>
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}

        {/* Royal Deep Maroon Accent Banner with Poojya Acharya Bhagwant Blessing */}
        <div className="mt-14 bg-gradient-to-r from-[#6E0D1C] via-[#851325] to-[#6E0D1C] p-6 sm:p-8 rounded-2xl text-white text-center shadow-2xl border-2 border-[#C59B27] relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-300/10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-amber-300/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="relative z-10 space-y-3">
            <span className="text-amber-300 text-xs font-serifHeading font-bold uppercase tracking-widest block">
              POOJYA ACHARYA BHAGWANT ASHIRWAD
            </span>
            <p className="text-base sm:text-xl font-bold font-gujaratiSerif text-amber-100 max-w-3xl mx-auto leading-relaxed matra-safe">
              "શ્રી શત્રુંજય ગિરિરાજની ૯૯ યાત્રા એ માત્ર પર્વત ચઢાણ નથી, એ અંતરાત્માને કર્મમુક્ત બનાવવાની દિવ્ય સાધના છે."
            </p>
            <p className="text-xs sm:text-sm text-amber-200/80 font-gujarati pt-1 matra-safe">
              — નિશ્રા દાતા પ.પૂ.આ.ભ. શ્રી જગતચંદ્રસૂરીશ્વરજી મ.સા. & પ.પૂ.આ.ભ. શ્રી જીનેશરત્નસૂરીશ્વરજી મ.સા.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

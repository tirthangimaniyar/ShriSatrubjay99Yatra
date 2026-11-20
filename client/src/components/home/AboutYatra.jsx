import React from 'react';
import { Sparkles, Mountain, Heart, Compass, Shield, Award } from 'lucide-react';

export const AboutYatra = () => {
  const cards = [
    {
      icon: Mountain,
      title: "શાશ્વત ગિરિરાજ મહિમા",
      englishTitle: "Eternal Sacred Shatrunjay Giriraj",
      desc: "જૈન ધર્મનું સર્વોચ્ચ અને પાવનતમ તીર્થ જ્યાં અસંખ્ય અનંત આત્માઓએ તપશ્ચર્યા કરી મોક્ષ પદ પ્રાપ્ત કર્યું છે. પ્રથમ તીર્થંકર ભગવાન ઋષભદેવ (આદિનાથ) અહીં અસંખ્ય વાર પધાર્યા હતા.",
      tag: "શાશ્વત તીર્થ"
    },
    {
      icon: Award,
      title: "૯૯ યાત્રાનું આધ્યાત્મિક મહત્વ",
      englishTitle: "Significance of 99 Yatra (Navanu)",
      desc: "૯૯ યાત્રા એટલે શત્રુંજય ગિરિરાજની ૯૯ વખત શ્રદ્ધા અને તપપૂર્વક કરવામાં આવતી પાવન પરિક્રમા. આ તપથી ભવોભવના કર્મોનો ક્ષય થાય છે અને આત્મા પાવન બને છે.",
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
    <section id="about" className="py-20 bg-yatra-cream relative overflow-hidden">
      {/* Background Watermark & Glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl pointer-events-none -translate-y-1/2"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center space-x-2 px-4 py-1 rounded-full bg-yatra-maroon/10 border border-yatra-gold/40 text-yatra-maroon font-semibold text-xs uppercase tracking-wider font-gujarati">
            <Sparkles className="w-3.5 h-3.5 text-yatra-goldDark" />
            <span>યાત્રાનો પાવન મહિમા અને પરંપરા</span>
            <Sparkles className="w-3.5 h-3.5 text-yatra-goldDark" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-yatra-maroon font-gujarati tracking-tight">
            શ્રી શત્રુંજય પાલિતાણા ૯૯ યાત્રા
          </h2>
          <p className="text-base text-gray-700 font-gujarati leading-relaxed">
            "સિદ્ધક્ષેત્ર ગિરિરાજ શત્રુંજય તીર્થ પર એક એક પગલું ભરવાથી કરોડ ગાયોના દાન કરતા પણ અધિક પુણ્ય ઉપાર્જન થાય છે."
          </p>

          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-yatra-gold to-transparent mx-auto mt-2"></div>
        </div>

        {/* 4 Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border-2 border-yatra-gold/40 shadow-sm hover:shadow-gold transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-yatra-maroon/10 border border-yatra-gold/30 flex items-center justify-center text-yatra-maroon group-hover:bg-yatra-maroon group-hover:text-amber-100 transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-yatra-maroon font-gujarati">
                      {card.tag}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-yatra-maroon font-gujarati mb-1">
                    {card.title}
                  </h3>
                  <h4 className="text-[11px] font-serifHeading text-yatra-purple/80 uppercase tracking-wider mb-3">
                    {card.englishTitle}
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600 font-gujarati leading-relaxed">
                    {card.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-yatra-gold/20 flex items-center text-xs text-yatra-goldDark font-semibold font-gujarati">
                  <span>શાશ્વત ધર્મ આરાધના</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Highlight quote box */}
        <div className="mt-14 bg-gradient-to-r from-yatra-maroon via-yatra-purple to-yatra-maroon p-6 sm:p-8 rounded-2xl text-white text-center shadow-maroon-lg border border-yatra-gold/50 relative overflow-hidden">
          <div className="relative z-10 space-y-2">
            <span className="text-yatra-goldAccent text-xs font-serifHeading font-bold uppercase tracking-widest block">
              POOJYA ACHARYA BHAGWANT ASHIRWAD
            </span>
            <p className="text-base sm:text-lg font-bold font-gujarati text-amber-100 max-w-3xl mx-auto leading-relaxed">
              "શ્રી શત્રુંજય ગિરિરાજની ૯૯ યાત્રા એ માત્ર પર્વત ચઢાણ નથી, એ અંતરાત્માને કર્મમુક્ત બનાવવાની દિવ્ય સાધના છે."
            </p>
            <p className="text-xs text-amber-200/70 font-gujarati pt-1">
              — નિશ્રા દાતા પ.પૂ.આ.ભ. શ્રી જગતચંદ્રસૂરીશ્વરજી મ.સા. & પ.પૂ.આ.ભ. શ્રી જીનેશરત્નસૂરીશ્વરજી મ.સા.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

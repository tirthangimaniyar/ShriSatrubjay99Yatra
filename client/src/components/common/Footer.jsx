import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Sparkles, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-yatra-maroon to-yatra-maroonDark text-amber-50 pt-16 pb-8 border-t-4 border-yatra-gold relative overflow-hidden">
      {/* Decorative background watermark */}
      <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center">
        <span className="text-[180px] font-serif font-black text-amber-100">卐</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Navkar Mantra Card */}
        <div className="bg-yatra-maroonDark/80 border border-yatra-gold/40 rounded-2xl p-6 sm:p-8 text-center max-w-3xl mx-auto shadow-2xl mb-12 backdrop-blur-sm relative">
          <div className="text-yatra-goldAccent text-xs font-semibold uppercase tracking-widest mb-2 font-serifHeading flex items-center justify-center space-x-2">
            <span>✦</span>
            <span>શ્રી નવકાર મહામંત્ર</span>
            <span>✦</span>
          </div>
          <p className="font-gujarati text-amber-100 text-sm sm:text-base leading-relaxed font-medium">
            નમો અરિહંતાણં । નમો સિદ્ધાણં । નમો આયરિયાણં ।<br />
            નમો ઉવજ્ઝાયાણં । નમો લોએ સવ્વસાહૂણં ।<br />
            <span className="text-xs text-amber-200/80 mt-1 inline-block">
              એસિ પંચ નમુક્કારો, સવ્વ પાવપ્પણાસણો । મંગલાણં ચ સવ્વેસિં, પઢમં હવઈ મંગલમ્ ॥
            </span>
          </p>
        </div>

        {/* Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12 text-sm">
          {/* Col 1: About Yatra */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full border border-yatra-gold overflow-hidden bg-yatra-sand/20 flex items-center justify-center">
                <img src="/images/hero-idol.png" alt="Palitana Idol" className="w-full h-full object-cover object-top" />
              </div>
              <div>
                <h4 className="font-bold text-amber-200 font-gujarati text-base leading-tight">
                  શ્રી શત્રુંજય ગિરિરાજ ૯૯ યાત્રા
                </h4>
                <p className="text-xs text-amber-200/60 font-serifHeading">Palitana 99 Yatra Sangh</p>
              </div>
            </div>
            <p className="text-xs text-amber-100/70 leading-relaxed font-gujarati">
              શ્રી બેતાલીસ વિશા શ્રીમાળી જૈન સમાજ આયોજિત શાશ્વતાગિરિના પથ પર ૯૯ યાત્રા સહ છ'રી પાલિત યાત્રા સંઘ. અનંત તીર્થંકરો અને મુનિ ભગવંતોની મોક્ષભૂમિ પાલિતાણામાં પાવન આરાધના.
            </p>
            <div className="pt-2 flex items-center space-x-2 text-xs text-yatra-goldAccent">
              <Sparkles className="w-4 h-4" />
              <span className="font-gujarati">ભાવથી બોલો શ્રી આદેશ્વર ભગવાન કી જય!</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="font-bold text-amber-200 text-sm uppercase tracking-wider mb-4 border-b border-yatra-gold/30 pb-1.5 font-serifHeading">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs font-gujarati">
              <li>
                <a href="#hero" className="hover:text-yatra-goldAccent transition-colors">
                  મુખ્ય પૃષ્ઠ (Home)
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-yatra-goldAccent transition-colors">
                  શત્રુંજય ગિરિરાજ મહિમા (Significance)
                </a>
              </li>
              <li>
                <a href="#invitation" className="hover:text-yatra-goldAccent transition-colors">
                  સત્તાવાર સંઘ પત્રિકા (Official Poster)
                </a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-yatra-goldAccent transition-colors">
                  પાલિતાણા દર્શન ગેલેરી (Temple Gallery)
                </a>
              </li>
              <li>
                <a href="#registration" className="hover:text-yatra-goldAccent transition-colors text-amber-200 font-bold">
                  ઓનલાઇન રજીસ્ટ્રેશન ફોર્મ (Register Online)
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Offices & Contact */}
          <div className="space-y-3">
            <h4 className="font-bold text-amber-200 text-sm uppercase tracking-wider mb-4 border-b border-yatra-gold/30 pb-1.5 font-serifHeading">
              Sangh Addresses
            </h4>
            <div className="flex items-start space-x-2 text-xs text-amber-100/80">
              <MapPin className="w-4 h-4 text-yatra-goldAccent shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-amber-200 font-gujarati">સુરત કાર્યાલય:</p>
                <p className="font-gujarati">શ્રી બેતાલીસ વિશા શ્રીમાળી જૈન ભવન, અડાજણ - પાલ, સુરત - 395009</p>
              </div>
            </div>
            <div className="flex items-start space-x-2 text-xs text-amber-100/80">
              <MapPin className="w-4 h-4 text-yatra-goldAccent shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-amber-200 font-gujarati">પાલિતાણા સંઘ ભવન:</p>
                <p className="font-gujarati">શ્રી બેતાલીસ ભવન, તળેટી રોડ, પાલિતાણા, ગુજરાત - 364270</p>
              </div>
            </div>
          </div>

          {/* Col 4: Helpline & Admin */}
          <div className="space-y-3">
            <h4 className="font-bold text-amber-200 text-sm uppercase tracking-wider mb-4 border-b border-yatra-gold/30 pb-1.5 font-serifHeading">
              Helpline & Support
            </h4>
            <div className="flex items-center space-x-2 text-xs text-amber-100/80">
              <Phone className="w-4 h-4 text-yatra-goldAccent shrink-0" />
              <a href="tel:+916352366615" className="hover:text-white transition-colors">
                +91 63523 66615
              </a>
            </div>
            <div className="flex items-center space-x-2 text-xs text-amber-100/80">
              <Mail className="w-4 h-4 text-yatra-goldAccent shrink-0" />
              <a href="mailto:info@palitana99yatra.org" className="hover:text-white transition-colors">
                info@palitana99yatra.org
              </a>
            </div>
          </div>
        </div>

        {/* Bottom divider and copyright */}
        <div className="border-t border-yatra-gold/20 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-amber-200/60 font-gujarati space-y-2 sm:space-y-0">
          <p>© {new Date().getFullYear()} શ્રી બેતાલીસ વિશા શ્રીમાળી જૈન સમાજ. સર્વાધિકાર સુરક્ષિત.</p>
          <div className="flex items-center space-x-4">
            <span>શાશ્વતાગિરિ પાવન યાત્રા</span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <span>જય જિનેન્દ્ર</span>
              <Heart className="w-3 h-3 text-red-400 fill-current" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

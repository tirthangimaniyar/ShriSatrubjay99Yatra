import React from 'react';
import { MapPin, Phone, Mail, Clock, MessageSquare, Compass, Shield } from 'lucide-react';
import { OrnamentalDivider } from '../common/OrnamentalDivider';

export const ContactSection = () => {
  return (
    <section id="contact" className="py-20 bg-[#FDF8F0] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/85 backdrop-blur-md border border-[#C59B27]/40 text-yatra-maroon font-semibold text-xs uppercase tracking-wider font-gujarati shadow-sm">
            <span>સંપર્ક અને સહાયતા કેન્દ્ર</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-yatra-maroon font-gujaratiSerif tracking-tight matra-safe">
            Contact Us & Helpline
          </h2>
          <p className="text-sm sm:text-base text-gray-700 font-gujarati matra-safe">
            શ્રી શત્રુંજય ૯૯ યાત્રા સંબંધી કોઈપણ પૂછપરછ અથવા માર્ગદર્શન માટે સંઘ કાર્યાલયનો સંપર્ક કરો.
          </p>

          <OrnamentalDivider className="my-2" />
        </div>

        {/* 3 Main Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Surat Office */}
          <div className="bg-white rounded-2xl p-6 border-2 border-yatra-gold/30 shadow-sm hover:shadow-gold transition-all font-gujarati space-y-3">
            <div className="w-12 h-12 rounded-xl bg-yatra-maroon/10 text-yatra-maroon flex items-center justify-center border border-yatra-gold/30">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-yatra-maroon">
              સુરત મુખ્ય કાર્યાલય
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              શ્રી બેતાલીસ વિશા શ્રીમાળી જૈન ભવન, અડાજણ - પાલ રોડ, સુરત, ગુજરાત - 395009
            </p>
            <div className="pt-2 text-xs text-yatra-goldDark font-semibold">
              સમય: સવારે ૯:૦૦ થી સાંજે ૬:૦૦
            </div>
          </div>

          {/* Card 2: Palitana Sangh Bhawan */}
          <div className="bg-white rounded-2xl p-6 border-2 border-yatra-gold/30 shadow-sm hover:shadow-gold transition-all font-gujarati space-y-3">
            <div className="w-12 h-12 rounded-xl bg-yatra-purple/10 text-yatra-purple flex items-center justify-center border border-yatra-gold/30">
              <Compass className="w-6 h-6 text-yatra-purple" />
            </div>
            <h3 className="text-lg font-bold text-yatra-maroon">
              પાલિતાણા તીર્થ સંઘ ભવન
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              શ્રી બેતાલીસ ભવન, તળેટી રોડ, જય તળેટી પાસે, પાલિતાણા, જિ. ભાવનગર, ગુજરાત - 364270
            </p>
            <div className="pt-2 text-xs text-yatra-goldDark font-semibold">
              ધર્મશાળા & ભોજનશાળા વ્યવસ્થા કેન્દ્ર
            </div>
          </div>

          {/* Card 3: Direct Phone & WhatsApp */}
          <div className="bg-white rounded-2xl p-6 border-2 border-yatra-gold/30 shadow-sm hover:shadow-gold transition-all font-gujarati space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center border border-emerald-300">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-yatra-maroon">
              ટેલિફોન & વોટ્સએપ હેલ્પલાઇન
            </h3>
            <div className="space-y-1.5 text-xs text-gray-700">
              <p className="flex items-center space-x-2">
                <span className="font-bold">સંઘ મંત્રીશ્રી:</span>
                <a href="tel:+916352366615" className="text-yatra-maroon font-bold hover:underline">
                  +91 63523 66615
                </a>
              </p>
              <p className="flex items-center space-x-2">
                <span className="font-bold">ઈમેલ:</span>
                <a href="mailto:info@palitana99yatra.org" className="text-yatra-purple hover:underline">
                  info@palitana99yatra.org
                </a>
              </p>
            </div>
            <div className="pt-2">
              <a
                href="https://wa.me/916352366615?text=Jai%20Jinendra!%20I%20would%20like%20information%20about%20Shri%20Shatrunjay%2099%20Yatra"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>વોટ્સએપ પર પૂછપરછ કરો</span>
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

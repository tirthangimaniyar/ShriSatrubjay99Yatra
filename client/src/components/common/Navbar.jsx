import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Search, Sparkles, Heart } from 'lucide-react';

export const Navbar = ({ onOpenStatusModal }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setIsOpen(false);
    if (location.pathname !== '/') {
      window.location.href = `/#${id}`;
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 transition-all duration-300">
      {/* Top Auspicious Religious Bar */}
      <div className="bg-yatra-maroon text-amber-100 text-xs py-1.5 px-4 text-center border-b border-yatra-gold/30 font-gujarati flex items-center justify-between shadow-sm">
        <div className="hidden sm:flex items-center space-x-2">
          <span className="text-yatra-goldAccent">✦</span>
          <span>॥ શ્રી આદિનાથાય નમઃ ॥ શ્રી શંખેશ્વર પાર્શ્વનાથાય નમઃ ॥</span>
        </div>
        <div className="mx-auto sm:mx-0 font-medium tracking-wide flex items-center space-x-1.5">
          <span className="text-yatra-goldAccent font-serif">卐</span>
          <span>શ્રી બેતાલીસ વિશા શ્રીમાળી જૈન સમાજ આયોજિત શાશ્વતાગિરિ ૯૯ યાત્રા</span>
          <span className="text-yatra-goldAccent font-serif">卐</span>
        </div>
        <div className="hidden md:flex items-center space-x-4 text-xs">
          <a href="tel:+916352366615" className="hover:text-yatra-goldAccent transition-colors flex items-center space-x-1">
            <Phone className="w-3 h-3 text-yatra-goldAccent" />
            <span>+91 63523 66615</span>
          </a>
        </div>
      </div>

      {/* Main Navbar */}
      <nav
        className={`transition-all duration-300 ${
          isScrolled
            ? 'bg-yatra-ivory/95 backdrop-blur-md shadow-md py-2.5 border-b border-yatra-gold/30'
            : 'bg-yatra-ivory py-3.5 border-b border-yatra-gold/20'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo and Title */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-yatra-gold shadow-gold flex items-center justify-center bg-yatra-maroon group-hover:scale-105 transition-transform duration-300">
                  <img
                    src="/images/hero-idol.png"
                    alt="Palitana Dada Idol"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <span className="absolute -bottom-1 -right-1 bg-yatra-gold text-white text-[9px] font-bold px-1 rounded-full border border-white">
                  ૯૯
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-bold font-gujarati text-yatra-maroon leading-tight tracking-wide">
                  શ્રી શત્રુંજય ગિરિરાજ ૯૯ યાત્રા
                </span>
                <span className="text-[10px] sm:text-xs font-serifHeading text-yatra-purple font-medium tracking-wider">
                  PALITANA 99 YATRA MAHOTTSAV
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-6 text-sm font-medium">
              <button
                onClick={() => scrollToSection('hero')}
                className="text-yatra-charcoal hover:text-yatra-maroon transition-colors py-1 hover:border-b-2 hover:border-yatra-gold font-gujarati"
              >
                મુખ્ય પૃષ્ઠ
              </button>
              <button
                onClick={() => scrollToSection('about')}
                className="text-yatra-charcoal hover:text-yatra-maroon transition-colors py-1 hover:border-b-2 hover:border-yatra-gold font-gujarati"
              >
                યાત્રા મહિમા
              </button>
              <button
                onClick={() => scrollToSection('invitation')}
                className="text-yatra-charcoal hover:text-yatra-maroon transition-colors py-1 hover:border-b-2 hover:border-yatra-gold font-gujarati"
              >
                સંઘ પત્રિકા
              </button>
              <button
                onClick={() => scrollToSection('gallery')}
                className="text-yatra-charcoal hover:text-yatra-maroon transition-colors py-1 hover:border-b-2 hover:border-yatra-gold font-gujarati"
              >
                ફોટો ગેલેરી
              </button>
              <button
                onClick={() => scrollToSection('registration')}
                className="text-yatra-maroon font-bold hover:text-yatra-maroonLight transition-colors py-1 hover:border-b-2 hover:border-yatra-gold font-gujarati flex items-center space-x-1"
              >
                <Sparkles className="w-3.5 h-3.5 text-yatra-gold" />
                <span>રજીસ્ટ્રેશન</span>
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="text-yatra-charcoal hover:text-yatra-maroon transition-colors py-1 hover:border-b-2 hover:border-yatra-gold font-gujarati"
              >
                સંપર્ક
              </button>
            </div>

            {/* Desktop Action Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              <button
                onClick={onOpenStatusModal}
                className="px-3 py-1.5 text-xs font-semibold text-yatra-purple bg-yatra-sand/60 hover:bg-yatra-sand border border-yatra-gold/40 rounded-lg transition-all flex items-center space-x-1.5 shadow-sm"
              >
                <Search className="w-3.5 h-3.5 text-yatra-goldDark" />
                <span className="font-gujarati">સ્થિતિ ચકાસો</span>
              </button>

              <button
                onClick={() => scrollToSection('registration')}
                className="px-4 py-2 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-yatra-maroon to-yatra-maroonLight hover:from-yatra-maroonLight hover:to-yatra-maroon rounded-lg shadow-maroon-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 font-gujarati flex items-center space-x-1.5 border border-yatra-goldLight/40"
              >
                <Heart className="w-3.5 h-3.5 fill-current text-amber-200" />
                <span>યાત્રા રજીસ્ટ્રેશન</span>
              </button>
            </div>

            {/* Mobile Hamburger Toggle */}
            <div className="flex items-center space-x-2 lg:hidden">
              <button
                onClick={onOpenStatusModal}
                className="p-2 text-yatra-purple hover:bg-yatra-sand/60 rounded-lg text-xs flex items-center space-x-1 border border-yatra-gold/30"
                title="Check Status"
              >
                <Search className="w-4 h-4 text-yatra-goldDark" />
              </button>

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg text-yatra-maroon hover:bg-yatra-sand transition-colors"
                aria-label="Toggle menu"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isOpen && (
          <div className="lg:hidden bg-yatra-ivory border-t border-yatra-gold/30 px-4 pt-3 pb-6 space-y-3 shadow-xl">
            <button
              onClick={() => scrollToSection('hero')}
              className="block w-full text-left py-2 px-3 text-base font-medium text-yatra-charcoal hover:bg-yatra-sand/50 rounded-lg font-gujarati"
            >
              મુખ્ય પૃષ્ઠ (Home)
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="block w-full text-left py-2 px-3 text-base font-medium text-yatra-charcoal hover:bg-yatra-sand/50 rounded-lg font-gujarati"
            >
              યાત્રા મહિમા (About Yatra)
            </button>
            <button
              onClick={() => scrollToSection('invitation')}
              className="block w-full text-left py-2 px-3 text-base font-medium text-yatra-charcoal hover:bg-yatra-sand/50 rounded-lg font-gujarati"
            >
              સંઘ પત્રિકા (Official Invitation)
            </button>
            <button
              onClick={() => scrollToSection('gallery')}
              className="block w-full text-left py-2 px-3 text-base font-medium text-yatra-charcoal hover:bg-yatra-sand/50 rounded-lg font-gujarati"
            >
              ફોટો ગેલેરી (Photo Gallery)
            </button>
            <button
              onClick={() => scrollToSection('registration')}
              className="block w-full text-left py-2 px-3 text-base font-bold text-yatra-maroon bg-yatra-sand/40 rounded-lg font-gujarati"
            >
              યાત્રા રજીસ્ટ્રેશન (Register for Yatra)
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="block w-full text-left py-2 px-3 text-base font-medium text-yatra-charcoal hover:bg-yatra-sand/50 rounded-lg font-gujarati"
            >
              સંપર્ક (Contact Us)
            </button>

            <div className="pt-2 border-t border-yatra-gold/20 flex flex-col space-y-2">
              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenStatusModal();
                }}
                className="w-full py-2.5 px-4 text-center text-sm font-semibold text-yatra-purple bg-yatra-sand/70 rounded-lg border border-yatra-gold/40 flex items-center justify-center space-x-2"
              >
                <Search className="w-4 h-4 text-yatra-gold" />
                <span>રજીસ્ટ્રેશન સ્થિતિ ચકાસો (Check Status)</span>
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

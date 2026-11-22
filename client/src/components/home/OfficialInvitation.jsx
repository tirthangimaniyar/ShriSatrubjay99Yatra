import React, { useState } from 'react';
import { Eye, Download, Maximize2, X, ZoomIn, ZoomOut, Sparkles } from 'lucide-react';
import { OrnamentalDivider } from '../common/OrnamentalDivider';

export const OfficialInvitation = () => {
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  const posterPath = '/images/invitation-poster.jpeg';

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = posterPath;
    link.download = 'Palitana-99-Yatra-Official-Invitation-Poster.jpeg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openFullscreen = () => {
    setZoomLevel(1);
    setIsFullscreenOpen(true);
  };

  return (
    <section id="invitation" className="py-20 bg-[#F7EFE2] relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#C59B27] to-transparent"></div>
      <div className="absolute -left-20 top-40 w-72 h-72 bg-amber-200/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -right-20 bottom-40 w-72 h-72 bg-yatra-gold/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading */}
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/85 backdrop-blur-md border border-[#C59B27]/40 text-yatra-maroon font-semibold text-xs uppercase tracking-wider font-gujarati shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" />
            <span>સત્તાવાર સંઘ આમંત્રણ દર્શન</span>
            <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" />
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-yatra-maroon font-gujaratiSerif tracking-tight matra-safe">
            Official Yatra Invitation
          </h2>
          <p className="text-sm sm:text-base text-yatra-royalMaroon font-medium font-gujarati max-w-xl mx-auto matra-safe">
            શ્રી બેતાલીસ વિશા શ્રીમાળી જૈન સમાજ આયોજિત શાશ્વતાગિરિના પથ પર ૯૯ યાત્રા સહ છ'રી પાલિત યાત્રા સંઘની મૂળ પત્રિકા
          </p>

          <OrnamentalDivider className="my-2" />
        </div>

        {/* Poster Showcase Container with Golden Decorative Frame */}
        <div className="max-w-xl mx-auto">
          <div className="relative group">
            {/* Outer Golden Glow */}
            <div className="absolute -inset-3 bg-gradient-to-r from-yatra-gold via-amber-200 to-yatra-goldDark rounded-3xl blur opacity-40 group-hover:opacity-75 transition-opacity duration-500"></div>

            {/* The Ornate Frame */}
            <div className="relative bg-white p-3 sm:p-5 rounded-2xl border-4 border-yatra-gold shadow-2xl">
              
              {/* Ornate Corner Elements */}
              <div className="absolute top-2 left-2 w-7 h-7 border-t-2 border-l-2 border-yatra-maroon pointer-events-none"></div>
              <div className="absolute top-2 right-2 w-7 h-7 border-t-2 border-r-2 border-yatra-maroon pointer-events-none"></div>
              <div className="absolute bottom-2 left-2 w-7 h-7 border-b-2 border-l-2 border-yatra-maroon pointer-events-none"></div>
              <div className="absolute bottom-2 right-2 w-7 h-7 border-b-2 border-r-2 border-yatra-maroon pointer-events-none"></div>

              {/* The Invitation Image - DISPLAYED COMPLETELY WITHOUT CROPPING MAINTAINING ASPECT RATIO */}
              <div className="relative overflow-hidden rounded-xl bg-amber-50 cursor-pointer" onClick={openFullscreen}>
                <img
                  src={posterPath}
                  alt="Official Gujarati Invitation Poster of Shri Betalisi Visa Shrimali Jain Samaj"
                  className="w-full h-auto object-contain block transition-transform duration-500 group-hover:scale-[1.01]"
                />

                {/* Subtle Hover Overlay */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-3">
                  <span className="bg-white/95 text-yatra-maroon font-bold px-4 py-2 rounded-xl text-xs sm:text-sm shadow-lg flex items-center space-x-2 font-gujarati">
                    <Maximize2 className="w-4 h-4 text-yatra-goldDark" />
                    <span>સંપૂર્ણ સ્ક્રીન પર જુઓ (Full Screen)</span>
                  </span>
                </div>
              </div>

              {/* Action Buttons Below Poster */}
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-yatra-gold/30">
                <button
                  onClick={openFullscreen}
                  className="w-full px-4 py-3 bg-gradient-to-r from-yatra-maroon to-yatra-maroonLight hover:from-yatra-maroonLight hover:to-yatra-maroon text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 font-gujarati text-sm"
                >
                  <Eye className="w-4 h-4 text-amber-200" />
                  <span>View Invitation (પત્રિકા દર્શન)</span>
                </button>

                <button
                  onClick={handleDownload}
                  className="w-full px-4 py-3 bg-yatra-ivory hover:bg-amber-100 text-yatra-maroon border-2 border-yatra-gold font-bold rounded-xl shadow-sm transition-all flex items-center justify-center space-x-2 font-gujarati text-sm"
                >
                  <Download className="w-4 h-4 text-yatra-goldDark" />
                  <span>Download Invitation (ડાઉનલોડ)</span>
                </button>
              </div>

              <div className="mt-3 text-center text-xs text-gray-500 font-gujarati">
                <span>મૂળ પત્રિકાને ઉચ્ચ રિઝોલ્યુશનમાં જોવા માટે ફોટો પર ક્લિક કરો.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {isFullscreenOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-2 sm:p-6 animate-fadeIn">
          {/* Modal Header Controls */}
          <div className="w-full max-w-4xl flex items-center justify-between py-2 px-4 bg-stone-900/90 text-white rounded-t-xl border border-yatra-gold/30">
            <span className="text-xs sm:text-sm font-bold font-gujarati text-amber-200">
              સત્તાવાર યાત્રા સંઘ પત્રિકા - શ્રી બેતાલીસ વિશા શ્રીમાળી જૈન સમાજ
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 2.5))}
                className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-200 transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 0.75))}
                className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-200 transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={handleDownload}
                className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-200 transition-colors"
                title="Download"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsFullscreenOpen(false)}
                className="p-1.5 rounded-lg bg-red-800/80 hover:bg-red-700 text-white transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Body with Zoomable Poster */}
          <div className="w-full max-w-4xl max-h-[85vh] overflow-auto bg-stone-950 p-2 sm:p-4 rounded-b-xl border-x border-b border-yatra-gold/30 flex items-center justify-center">
            <img
              src={posterPath}
              alt="Official Invitation Poster Full View"
              style={{ transform: `scale(${zoomLevel})`, transition: 'transform 0.2s ease-out' }}
              className="max-h-[80vh] w-auto object-contain mx-auto rounded shadow-2xl"
            />
          </div>
        </div>
      )}
    </section>
  );
};

import React, { useState, useEffect } from 'react';
import { Sparkles, Maximize2, X, ChevronLeft, ChevronRight, Download, Filter } from 'lucide-react';
import { getApiUrl } from '../../config';

export const PalitanaGallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  const categories = [
    'All',
    'Palitana Giriraj',
    'Tirthankar Idols',
    'Derasar Architecture',
    'Yatra Path',
    'Religious Ceremonies'
  ];

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await fetch(getApiUrl('/api/gallery'));
        const data = await res.json();
        if (data.success && data.images) {
          setImages(data.images);
        }
      } catch (err) {
        console.error('Failed to load gallery:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const filteredImages = activeCategory === 'All'
    ? images
    : images.filter(img => img.category === activeCategory);

  const openLightbox = (index) => {
    setSelectedImageIndex(index);
  };

  const closeLightbox = () => {
    setSelectedImageIndex(null);
  };

  const nextImage = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex + 1) % filteredImages.length);
    }
  };

  const prevImage = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex - 1 + filteredImages.length) % filteredImages.length);
    }
  };

  return (
    <section id="gallery" className="py-20 bg-yatra-ivory relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center space-x-2 px-4 py-1 rounded-full bg-yatra-maroon/10 border border-yatra-gold/40 text-yatra-maroon font-semibold text-xs uppercase tracking-wider font-gujarati">
            <Sparkles className="w-3.5 h-3.5 text-yatra-goldDark" />
            <span>પાવન તીર્થ પાલિતાણા દર્શન</span>
            <Sparkles className="w-3.5 h-3.5 text-yatra-goldDark" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-yatra-maroon font-gujarati tracking-tight">
            Palitana Giriraj Image Gallery
          </h2>
          <p className="text-sm sm:text-base text-gray-700 font-gujarati">
            શ્રી શત્રુંજય તીર્થ, જિનાલયો, આરસ શિલ્પકળા અને તીર્થંકર પરમાત્માના અલૌકિક દર્શન
          </p>

          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-yatra-gold to-transparent mx-auto mt-2"></div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center justify-center flex-wrap gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all font-gujarati ${
                activeCategory === cat
                  ? 'bg-yatra-maroon text-white shadow-md border-2 border-yatra-gold'
                  : 'bg-white text-yatra-charcoal border border-yatra-gold/40 hover:bg-amber-50'
              }`}
            >
              {cat === 'All' ? 'તમામ દર્શન (All)' : cat}
            </button>
          ))}
        </div>

        {/* Gallery Image Grid */}
        {loading ? (
          <div className="text-center py-16 text-yatra-maroon font-gujarati">
            દર્શન તસવીરો લોડ થઈ રહી છે...
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="text-center py-16 text-gray-500 font-gujarati bg-white rounded-2xl border border-dashed border-gray-300">
            આ કેટેગરીમાં હાલ કોઈ તસવીરો ઉપલબ્ધ નથી.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredImages.map((img, index) => (
              <div
                key={img._id || index}
                onClick={() => openLightbox(index)}
                className="group relative bg-white rounded-2xl overflow-hidden border-2 border-yatra-gold/30 hover:border-yatra-gold shadow-sm hover:shadow-gold transition-all duration-300 cursor-pointer flex flex-col"
              >
                {/* Image Container */}
                <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                  <img
                    src={img.imageUrl}
                    alt={img.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                    loading="lazy"
                  />
                  {/* Subtle hover overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="p-2.5 rounded-full bg-white/90 text-yatra-maroon shadow-md transform scale-90 group-hover:scale-100 transition-transform">
                      <Maximize2 className="w-5 h-5 text-yatra-goldDark" />
                    </span>
                  </div>

                  {/* Category Pill on top left */}
                  <div className="absolute top-2 left-2">
                    <span className="text-[10px] font-bold bg-yatra-maroon/85 text-amber-100 px-2 py-0.5 rounded-md backdrop-blur-sm border border-yatra-gold/30">
                      {img.category}
                    </span>
                  </div>
                </div>

                {/* Caption Block */}
                <div className="p-3.5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-xs sm:text-sm text-yatra-maroon font-gujarati line-clamp-1 mb-1">
                      {img.gujaratiTitle || img.title}
                    </h3>
                    <p className="text-[11px] text-gray-600 font-gujarati line-clamp-2">
                      {img.description || img.title}
                    </p>
                  </div>
                  <div className="pt-2 mt-2 border-t border-gray-100 flex items-center justify-between text-[10px] text-yatra-goldDark font-bold">
                    <span>દર્શન કરો</span>
                    <span>✦</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* LIGHTBOX MODAL */}
      {selectedImageIndex !== null && filteredImages[selectedImageIndex] && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-2 sm:p-6 animate-fadeIn">
          
          {/* Top Bar with Title and Controls */}
          <div className="w-full max-w-4xl flex items-center justify-between py-2 px-4 text-white mb-2">
            <div className="font-gujarati text-xs sm:text-sm text-amber-200 truncate pr-4">
              {filteredImages[selectedImageIndex].gujaratiTitle || filteredImages[selectedImageIndex].title}
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <a
                href={filteredImages[selectedImageIndex].imageUrl}
                download
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-200 transition-colors"
                title="Download Image"
              >
                <Download className="w-4 h-4" />
              </a>

              <button
                onClick={closeLightbox}
                className="p-2 rounded-lg bg-red-800/80 hover:bg-red-700 text-white transition-colors"
                title="Close Lightbox"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Central Image with Navigation Chevrons */}
          <div className="relative w-full max-w-4xl max-h-[75vh] flex items-center justify-center">
            {/* Prev Button */}
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white transition-colors z-20"
              title="Previous Image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Displayed Image */}
            <img
              src={filteredImages[selectedImageIndex].imageUrl}
              alt={filteredImages[selectedImageIndex].title}
              className="max-h-[72vh] w-auto max-w-full object-contain rounded-lg shadow-2xl border border-yatra-gold/30"
            />

            {/* Next Button */}
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white transition-colors z-20"
              title="Next Image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Bottom Caption & Counter */}
          <div className="w-full max-w-4xl mt-3 text-center px-4">
            <p className="text-xs sm:text-sm text-amber-100 font-gujarati">
              {filteredImages[selectedImageIndex].description}
            </p>
            <span className="text-[11px] text-amber-300/70 mt-1 inline-block">
              {selectedImageIndex + 1} of {filteredImages.length}
            </span>
          </div>
        </div>
      )}
    </section>
  );
};

import React, { useState, useEffect } from 'react';
import { Sparkles, Maximize2, X, ChevronLeft, ChevronRight, Download, Filter, Tag } from 'lucide-react';
import { getApiUrl } from '../../config';
import { OrnamentalDivider } from '../common/OrnamentalDivider';

// Built-in high quality gallery images as guaranteed fallback
const defaultGalleryImages = [
  {
    _id: "gal_1",
    title: "શ્રી શત્રુંજય ગિરિરાજ દર્શન - પાલિતાણા",
    gujaratiTitle: "શ્રી શત્રુંજય મહાતીર્થ ગિરિરાજ સમગ્ર દર્શન",
    category: "Palitana Giriraj",
    imageUrl: "/images/gallery/palitana-panoramic.jpg",
    description: "શાશ્વત ગિરિરાજ પર સ્થિત દેવવિમાન સમાન પાવન જિનાલયોની નયનરમ્ય હારમાળા.",
    isFeatured: true,
    order: 1
  },
  {
    _id: "gal_2",
    name: "દાદા આદેશ્વર ભગવાન સોનાના શૃંગારમાં",
    title: "શ્રી આદિનાથ ભગવાન - મૂળનાયક શ્રી શત્રુંજય",
    gujaratiTitle: "મૂળનાયક શ્રી આદિનાથ દાદા ભવ્ય સુવર્ણ આંગી દર્શન",
    category: "Tirthankar Idols",
    imageUrl: "/images/hero-idol.png",
    description: "શ્રી શત્રુંજય ગિરિરાજના અધિષ્ઠાયક દેવ પ્રથમ તીર્થંકર શ્રી ઋષભદેવ (આદિનાથ) ભગવાન.",
    isFeatured: true,
    order: 2
  },
  {
    _id: "gal_3",
    title: "પૂજ્ય પ્રભુજી ફૂલ અને દીપકના અલૌકિક શણગારમાં",
    gujaratiTitle: "તીર્થંકર પરમાત્મા દિવ્ય પુષ્પ અને દીપ શણગાર દર્શન",
    category: "Tirthankar Idols",
    imageUrl: "/images/dada-idol.jpeg",
    description: "હજારો શ્વેત અને રક્ત પુષ્પોની માળા વચ્ચે ઝગમગતા દીવડાઓ સાથે પરમાત્માની ભક્તિ.",
    isFeatured: true,
    order: 3
  },
  {
    _id: "gal_4",
    title: "અદ્ભુત આરસની કોતરણી અને કલાકૃતિ",
    gujaratiTitle: "જિનાલય સ્થાપત્ય અને અજોડ શિલ્પકળા",
    category: "Derasar Architecture",
    imageUrl: "/images/gallery/marble-carvings-derasar.jpg",
    description: "શ્રી શત્રુંજય ગિરિરાજ પર આવેલા દેરાસરોની વિશ્વવિખ્યાત આરસ શિલ્પકળા.",
    isFeatured: false,
    order: 4
  },
  {
    _id: "gal_5",
    title: "શત્રુંજય ગિરિરાજ સૂર્યોદય વેળા",
    gujaratiTitle: "શાશ્વતા ગિરિના પથ પર પ્રભાત વંદના",
    category: "Palitana Giriraj",
    imageUrl: "/images/gallery/shatrunjay-mountain-sunrise.jpg",
    description: "પ્રાતઃકાળે ગિરિરાજની યાત્રા કરતા ભાવિક ભક્તોનો ભક્તિભાવ.",
    isFeatured: false,
    order: 5
  },
  {
    _id: "gal_6",
    title: "ગગનચુંબી જિનાલય શિખરો",
    gujaratiTitle: "પાવન જિનમંદિર શિખર અને ધ્વજાદંડ",
    category: "Derasar Architecture",
    imageUrl: "/images/gallery/temple-spires-shikhara.jpg",
    description: "આકાશને આંબતા ભવ્ય શિખરો અને ફરફરતી પવિત્ર ધજાઓ.",
    isFeatured: false,
    order: 6
  },
  {
    _id: "gal_7",
    title: "ગિરિરાજ ચઢાણના પવિત્ર પગથિયાં",
    gujaratiTitle: "યાત્રા માર્ગ - ભક્તિ અને તપશ્ચર્યાના સોપાન",
    category: "Yatra Path",
    imageUrl: "/images/gallery/sacred-pilgrimage-steps.jpg",
    description: "દરેક પગલે કર્મની નિર્જરા કરાવતા પાલિતાણા ગિરિરાજના ૩૮૦૦ થી વધુ પગથિયાં.",
    isFeatured: false,
    order: 7
  },
  {
    _id: "gal_8",
    title: "ભાવિકોની આરાધના અને જાપ",
    gujaratiTitle: "નવ્વાણુ યાત્રા દરમિયાન સામુહિક આરાધના",
    category: "Religious Ceremonies",
    imageUrl: "/images/gallery/devotees-ceremony-aaradhna.jpg",
    description: "૯૯ યાત્રા દરમિયાન ભક્તિભાવ સાથે ચૈત્યવંદન અને નવકાર મહામંત્ર જાપ.",
    isFeatured: false,
    order: 8
  },
  {
    _id: "gal_9",
    title: "પ્રાચીન સ્તંભ અને શિલ્પ વારસો",
    gujaratiTitle: "પ્રાચીન સ્તંભ અને જિનાલય વારસો",
    category: "Derasar Architecture",
    imageUrl: "/images/gallery/ancient-pillars-heritage.jpg",
    description: "શ્રી શત્રુંજય મહાતીર્થના પ્રાચીન સ્તંભો અને પવિત્ર શિલ્પો.",
    isFeatured: false,
    order: 9
  },
  {
    _id: "gal_10",
    title: "શ્રી શત્રુંજય તીર્થ ભવ્ય દર્શન",
    gujaratiTitle: "તીર્થરાજ શત્રુંજય ભવ્ય દર્શન",
    category: "Palitana Giriraj",
    imageUrl: "/images/gallery/temple-view.jpg",
    description: "ગિરિરાજ પરથી દેરાસરોનો નયનરમ્ય અને મનમોહક નજારો.",
    isFeatured: false,
    order: 10
  }
];

export const PalitanaGallery = () => {
  const [images, setImages] = useState(defaultGalleryImages);
  const [loading, setLoading] = useState(false);
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
    let isMounted = true;
    const fetchGallery = async () => {
      try {
        const res = await fetch(getApiUrl('/api/gallery'));
        if (!res.ok) return;
        const data = await res.json();
        if (isMounted && data.success && Array.isArray(data.images) && data.images.length > 0) {
          setImages(data.images);
        }
      } catch (err) {
        // Silently preserve defaultGalleryImages so UI is never blank
      }
    };
    fetchGallery();
    return () => { isMounted = false; };
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

  // Keyboard navigation for Lightbox (Arrow Keys & Escape)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedImageIndex === null) return;
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImageIndex, filteredImages.length]);

  return (
    <section id="gallery" className="py-20 bg-[#FDF8F0] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/85 backdrop-blur-md border border-[#C59B27]/40 text-yatra-maroon font-semibold text-xs uppercase tracking-wider font-gujarati shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" />
            <span>પાવન તીર્થ પાલિતાણા દર્શન</span>
            <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" />
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-yatra-maroon font-gujaratiSerif tracking-tight matra-safe">
            Palitana Giriraj Image Gallery
          </h2>
          <p className="text-sm sm:text-base text-gray-700 font-gujarati matra-safe">
            શ્રી શત્રુંજય તીર્થ, જિનાલયો, આરસ શિલ્પકળા અને તીર્થંકર પરમાત્માના અલૌકિક દર્શન
          </p>

          <OrnamentalDivider className="my-2" />
        </div>

        {/* Category Filters */}
        <div className="flex items-center justify-center flex-wrap gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all font-gujarati ${
                activeCategory === cat
                  ? 'bg-yatra-royalMaroon text-white shadow-md border-2 border-[#C59B27]'
                  : 'bg-white text-yatra-charcoal border border-[#C59B27]/40 hover:bg-amber-50'
              }`}
            >
              {cat === 'All' ? 'તમામ દર્શન (All)' : cat}
            </button>
          ))}
        </div>

        {/* Gallery Image Grid */}
        {filteredImages.length === 0 ? (
          <div className="text-center py-16 text-gray-500 font-gujarati bg-white rounded-2xl border border-dashed border-gray-300">
            આ કેટેગરીમાં હાલ કોઈ તસવીરો ઉપલબ્ધ નથી.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredImages.map((img, index) => (
              <div
                key={img._id || index}
                onClick={() => openLightbox(index)}
                className="group relative patrika-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col"
              >
                {/* Image Container - Enforcing 16:9 Landscape Aspect Ratio */}
                <div className="relative aspect-video overflow-hidden bg-stone-100">
                  <img
                    src={img.imageUrl}
                    alt={img.title}
                    className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-108"
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/gallery/palitana-panoramic.jpg';
                    }}
                  />
                  {/* Subtle hover overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="p-2.5 rounded-full bg-white/95 text-yatra-maroon shadow-md transform scale-90 group-hover:scale-100 transition-transform">
                      <Maximize2 className="w-5 h-5 text-[#C59B27]" />
                    </span>
                  </div>

                  {/* Category Pill on top left */}
                  <div className="absolute top-2 left-2">
                    <span className="text-[10px] font-bold bg-yatra-royalMaroon/90 text-amber-100 px-2.5 py-0.5 rounded-md backdrop-blur-sm border border-[#C59B27]/40 shadow-sm">
                      {img.category}
                    </span>
                  </div>
                </div>

                {/* Caption Block */}
                <div className="p-4 flex-1 flex flex-col justify-between bg-white">
                  <div>
                    <h3 className="font-bold text-xs sm:text-sm text-yatra-maroon font-gujaratiSerif line-clamp-1 mb-1 matra-safe">
                      {img.gujaratiTitle || img.title}
                    </h3>
                    <p className="text-[11px] text-gray-600 font-gujarati line-clamp-2 leading-relaxed matra-safe">
                      {img.description || img.title}
                    </p>
                  </div>
                  <div className="pt-2 mt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-[#C59B27] font-bold font-gujarati">
                    <span>દર્શન કરો (View Full)</span>
                    <span>✦</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* FULL-SCREEN LIGHTBOX MODAL */}
      {selectedImageIndex !== null && filteredImages[selectedImageIndex] && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-3 sm:p-6 animate-fadeIn"
          onClick={(e) => {
            // Close if clicked directly on the modal backdrop
            if (e.target === e.currentTarget) closeLightbox();
          }}
        >
          
          {/* Top Bar with Title and Controls */}
          <div className="w-full max-w-5xl flex items-center justify-between py-2.5 px-4 text-white mb-2 bg-stone-900/80 rounded-xl border border-stone-700/60">
            <div className="flex items-center space-x-3 overflow-hidden pr-4">
              <span className="text-xs px-2.5 py-0.5 rounded-md bg-[#C59B27] text-stone-950 font-bold shrink-0">
                {filteredImages[selectedImageIndex].category}
              </span>
              <h3 className="font-gujaratiSerif text-sm sm:text-base text-amber-100 truncate">
                {filteredImages[selectedImageIndex].gujaratiTitle || filteredImages[selectedImageIndex].title}
              </h3>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <a
                href={filteredImages[selectedImageIndex].imageUrl}
                download
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-200 transition-colors"
                title="Download High-Res Image"
              >
                <Download className="w-4 h-4" />
              </a>

              <button
                onClick={closeLightbox}
                className="p-2 rounded-lg bg-red-800/80 hover:bg-red-700 text-white transition-colors"
                title="Close (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Central Image with Navigation Chevrons */}
          <div className="relative w-full max-w-5xl max-h-[75vh] flex items-center justify-center">
            {/* Prev Button */}
            <button
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/70 hover:bg-black/90 text-amber-200 transition-all z-20 border border-[#C59B27]/40 shadow-xl"
              title="Previous (Left Arrow)"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Displayed Image */}
            <img
              src={filteredImages[selectedImageIndex].imageUrl}
              alt={filteredImages[selectedImageIndex].title}
              className="max-h-[72vh] w-auto max-w-full object-contain rounded-xl shadow-2xl border-2 border-[#C59B27]/40"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/images/gallery/palitana-panoramic.jpg';
              }}
            />

            {/* Next Button */}
            <button
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/70 hover:bg-black/90 text-amber-200 transition-all z-20 border border-[#C59B27]/40 shadow-xl"
              title="Next (Right Arrow)"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Bottom Caption & Counter */}
          <div className="w-full max-w-5xl mt-3 text-center px-4 bg-stone-900/80 rounded-xl p-3 border border-stone-700/60">
            <p className="text-xs sm:text-sm text-amber-100 font-gujarati leading-relaxed matra-safe">
              {filteredImages[selectedImageIndex].description}
            </p>
            <div className="flex items-center justify-center space-x-2 text-[11px] text-amber-300/80 mt-1 font-gujarati">
              <span>તસવીર {selectedImageIndex + 1} of {filteredImages.length}</span>
              <span>•</span>
              <span>કીબોર્ડ એરો કી અથવા બટન વડે આગળ-પાછળ કરો</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

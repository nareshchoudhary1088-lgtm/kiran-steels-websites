import React, { useState, useMemo, useRef, useEffect } from "react";
import { X, Phone, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { products, PipesDetails, FittingsDetails } from "../data/products";

interface ProductGalleryViewProps {
  selectedProduct: any;
  onClose?: () => void;
}

const ProductGalleryView: React.FC<ProductGalleryViewProps> = ({ selectedProduct, onClose }) => {
  const [activeSubCat, setActiveSubCat] = useState<string | null>(null);
  const [activeImgIdx, setActiveImgIdx] = useState<number>(0);
  const mobileThumbRef = useRef<HTMLDivElement>(null);
  const desktopThumbRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const displayImages = useMemo(() => {
    if (!selectedProduct) return [];
    if (!activeSubCat) return selectedProduct.images;
    return selectedProduct.subCategories?.find((s: any) => s.name === activeSubCat)?.images || selectedProduct.images;
  }, [selectedProduct, activeSubCat]);

  useEffect(() => {
    const centerThumbnail = (ref: any) => {
      if (ref.current && ref.current.children[activeImgIdx]) {
        const activeThumb = ref.current.children[activeImgIdx] as HTMLElement;
        const parent = ref.current;
        const scrollLeft = activeThumb.offsetLeft - (parent.offsetWidth / 2) + (activeThumb.offsetWidth / 2);
        parent.scrollTo({ left: scrollLeft, behavior: 'smooth' });
      }
    };
    if (selectedProduct) {
      centerThumbnail(mobileThumbRef);
      centerThumbnail(desktopThumbRef);
    }
  }, [activeImgIdx, selectedProduct, activeSubCat]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!displayImages.length) return;
      if (e.key === 'ArrowRight') {
        setActiveImgIdx((prev) => (prev < displayImages.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowLeft') {
        setActiveImgIdx((prev) => (prev > 0 ? prev - 1 : displayImages.length - 1));
      } else if (e.key === 'Escape') {
        if (onClose) onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [displayImages.length, onClose]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const distance = touchStartX.current - touchEndX;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      setActiveImgIdx((prev) => (prev < displayImages.length - 1 ? prev + 1 : 0));
    } else if (distance < -minSwipeDistance) {
      setActiveImgIdx((prev) => (prev > 0 ? prev - 1 : displayImages.length - 1));
    }
    touchStartX.current = null;
  };

  if (!selectedProduct) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center animate-in fade-in duration-300 bg-white">
      {/* Mobile Specific Modal (LOCKED FULL SCREEN - FINAL ICE-STEEL BLUE CHOICE) */}
      <div className={`${selectedProduct.name === "Stainless Steel Pipes & Tubes" || selectedProduct.name === "Stainless Steel Fitting Items" ? 'hidden' : 'md:hidden'} fixed inset-0 z-[120] bg-[#F1F5FF] flex flex-col items-center animate-in fade-in slide-in-from-bottom duration-300 overflow-hidden select-none`}>
        {/* Safe Area Spacer (Minimal) */}
        <div className="h-2 shrink-0" />

        {/* Top Navy Pill - Sleek Dynamic Header */}
        <div className="w-[90%] max-w-[400px] bg-gradient-to-r from-[#172554] via-[#1E3A8A] to-[#2563EB] min-h-[48px] py-3.5 rounded-full flex items-center justify-between shadow-[0_12px_28px_rgba(37,99,235,0.3)] mb-2 shrink-0 relative mt-4 border-2 border-white/20 px-6">
          <span className="text-white font-black text-[13px] tracking-[3px] uppercase text-center leading-tight truncate px-2">
            {products.indexOf(selectedProduct) + 1}. {selectedProduct.name}
          </span>
          {onClose && (
            <button onClick={onClose} className="text-white/80 hover:text-white transition-colors bg-white/10 rounded-full p-1.5 shrink-0">
              <X size={16} />
            </button>
          )}
        </div>

        {/* Main Image Viewport Area (Perfectly Centered in middle gap) */}
        <div className="flex-1 w-full flex items-center justify-center px-12 relative overflow-hidden">
          {/* Navigation Arrows (Fixed to Viewport Edges) */}
          <button
            onClick={() => setActiveImgIdx((prev) => (prev > 0 ? prev - 1 : displayImages.length - 1))}
            className="absolute left-1 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center shadow-[0_10px_30px_rgba(30,58,138,0.4)] active:scale-90 transition-all border-2 border-white z-10"
          >
            <ChevronLeft size={20} strokeWidth={2.5} />
          </button>

          <div
            className="relative flex items-center justify-center w-full max-h-[96%] overflow-visible group"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <img
              src={displayImages[activeImgIdx]}
              className="max-w-full max-h-full w-auto h-auto rounded-[32px] shadow-[0_20px_50px_rgba(15,23,42,0.15)] animate-in fade-in zoom-in-95 duration-500"
              alt={`Kiran Steels - ${activeSubCat || selectedProduct.name} - Image ${activeImgIdx + 1}`}
            />
          </div>

          <button
            onClick={() => setActiveImgIdx((prev) => (prev < displayImages.length - 1 ? prev + 1 : 0))}
            className="absolute right-1 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center shadow-[0_10px_30px_rgba(30,58,138,0.4)] active:scale-90 transition-all border-2 border-white z-10"
          >
            <ChevronRight size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Bottom Controls Area (Anchored & Fixed at bottom) */}
        <div className="w-full px-6 pt-2 pb-6 shrink-0 flex flex-col items-center">
          <div ref={mobileThumbRef} className="flex gap-4 overflow-x-auto w-full px-2 scrollbar-hide py-2">
            {displayImages.map((img: string, i: number) => (
              <div
                key={i}
                onClick={() => setActiveImgIdx(i)}
                className={`flex-shrink-0 w-[84px] h-[84px] rounded-[24px] overflow-hidden border-[4.5px] transition-all shadow-xl cursor-pointer ${activeImgIdx === i ? 'border-[#1e3a8a] scale-115 z-10' : 'border-white opacity-50 grayscale-[0.3]'}`}
              >
                <img src={img} className="w-full h-full object-cover" alt={`Kiran Steels - ${activeSubCat || selectedProduct.name} - Thumbnail ${i + 1}`} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop Specific Modal (Fullscreen) */}
      <div className={`${selectedProduct.name === "Stainless Steel Pipes & Tubes" || selectedProduct.name === "Stainless Steel Fitting Items" ? 'flex z-[120]' : 'hidden md:flex'} fixed inset-0 w-full h-[100dvh] flex-col relative bg-white overflow-y-auto md:overflow-hidden`}>

        {/* Header */}
        <div className="bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] px-8 py-5 flex items-center justify-between text-white border-b border-white/10">
          <div className="flex flex-col">
            <h2 className="text-[24px] font-black tracking-tight leading-none mb-1 uppercase">KIRAN STEELS</h2>
            <p className="text-[10px] uppercase font-bold tracking-[2px] opacity-80">PREMIUM STAINLESS STEEL SOLUTIONS</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-white/15 px-3 py-1.5 rounded-lg flex items-center gap-2 border border-white/20">
              <div className="flex items-center gap-1 text-[#FCD34D]">
                <span className="text-[14px] font-bold">★ 4.6</span>
              </div>
              <span className="text-[10px] font-medium opacity-80 border-l border-white/20 pl-2">35 Reviews</span>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="hidden md:flex bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col md:flex-row flex-1 md:overflow-hidden min-h-max md:min-h-0">

          {/* Left Column: Image Viewer */}
          {displayImages.length > 0 && (
            <div className="w-full md:w-[55%] p-4 md:p-8 flex flex-col gap-4 md:gap-6 bg-[#F8FAFC] h-[350px] shrink-0 md:h-auto md:flex-1">
              <div
                className="relative flex-1 min-h-0 w-full flex items-center justify-center group"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                <div className="absolute top-0 left-0 z-10 bg-[#1E3A8A] text-white px-3 py-1 rounded-[6px] text-[10px] font-bold uppercase tracking-wider shadow-lg">
                  Product {String(activeImgIdx + 1).padStart(2, '0')}
                </div>

                <img
                  src={displayImages[activeImgIdx]}
                  className="max-w-full max-h-full w-auto h-auto rounded-[16px] shadow-[0_10px_30px_rgba(0,0,0,0.15)] animate-in fade-in zoom-in-95 duration-500"
                  alt={`Kiran Steels - ${activeSubCat || selectedProduct.name} - Image ${activeImgIdx + 1}`}
                />

                {/* Navigation Arrows */}
                <button
                  onClick={(e) => { e.stopPropagation(); setActiveImgIdx((prev) => (prev > 0 ? prev - 1 : displayImages.length - 1)); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setActiveImgIdx((prev) => (prev < displayImages.length - 1 ? prev + 1 : 0)); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0"
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              {/* Thumbnails */}
              <div ref={desktopThumbRef} className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {displayImages.map((img: string, i: number) => (
                  <div
                    key={i}
                    onClick={() => setActiveImgIdx(i)}
                    className={`relative min-w-[70px] h-[70px] rounded-[14px] overflow-hidden cursor-pointer border-2 transition-all ${activeImgIdx === i ? 'border-[#2563EB] scale-95 shadow-md' : 'border-transparent hover:border-[#2563EB]/30'}`}
                  >
                    <img src={img} className="w-full h-full object-cover" alt={`Kiran Steels - ${activeSubCat || selectedProduct.name} - Thumbnail ${i + 1}`} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Right Column: Details */}
          <div className={`w-full ${displayImages.length > 0 ? 'md:w-[45%] border-l border-slate-100' : 'md:w-full max-w-4xl mx-auto'} p-5 md:p-8 flex flex-col bg-white md:overflow-y-auto`}>
            <div className="flex flex-col gap-2 mb-4 md:mb-6 shrink-0">
              <p className="text-[11px] font-bold text-[#2563EB] tracking-[3px] uppercase">Stainless Steel</p>
              <h3 className="text-[32px] font-black text-[#1E293B] leading-none uppercase tracking-tight">{selectedProduct.name}</h3>
              <div className="h-[3.5px] w-14 bg-[#2563EB] rounded-full mt-3"></div>
            </div>

            <div className="space-y-6 flex-1 md:overflow-y-auto pr-2 scrollbar-none">
              {selectedProduct.name === "Stainless Steel Pipes & Tubes" ? (
                <PipesDetails />
              ) : selectedProduct.name === "Stainless Steel Fitting Items" ? (
                <FittingsDetails />
              ) : (
                <>
                  {/* Description Section */}
                  <div className="space-y-4">
                    <p className="text-[#64748B] text-[14px] leading-relaxed font-medium">
                      Crafted with precision engineering, our {selectedProduct.name.toLowerCase()} combine industrial-grade durability with elegant design. Ideal for architectural, residential, and commercial projects.
                    </p>

                    {/* Subcategories (if available) */}
                    {selectedProduct.subCategories && (
                      <div className="pt-4 border-t border-slate-100">
                        <p className="text-[10px] font-black text-[#64748B] uppercase tracking-[2px] mb-3">Filter by Type:</p>
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => { setActiveSubCat(null); setActiveImgIdx(0); }}
                            className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border ${!activeSubCat ? 'bg-[#1E3A8A] text-white border-[#1E3A8A] shadow-md' : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'}`}
                          >
                            All
                          </button>
                          {selectedProduct.subCategories.map((sub: any) => (
                            <button
                              key={sub.name}
                              onClick={() => { setActiveSubCat(sub.name); setActiveImgIdx(0); }}
                              className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border ${activeSubCat === sub.name ? 'bg-[#1E3A8A] text-white border-[#1E3A8A] shadow-md' : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'}`}
                            >
                              {sub.name.replace(' Stainless Steel Gates', '').replace('Stainless Steel ', '')}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Features List */}
                  <div className="pt-6 border-t border-slate-100">
                    <p className="text-[10px] font-black text-[#64748B] uppercase tracking-[2px] mb-4">Features & Specs:</p>
                    <ul className="grid grid-cols-1 gap-3">
                      {[
                        "Premium Grade 304/316 Steel",
                        "High Precision Laser Cutting",
                        "Weather-Resistant Coating",
                        "Custom Sizes & Designs",
                        "5-Year Structural Warranty"
                      ].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-[#334155] font-bold text-[13px] group">
                          <div className="w-5 h-5 rounded-full bg-blue-50 text-[#2563EB] flex items-center justify-center text-[10px] group-hover:bg-[#2563EB] group-hover:text-white transition-colors">
                            ✓
                          </div>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}

              <button
                onClick={() => {
                  if (window.innerWidth > 768) {
                    if (onClose) onClose();
                    setTimeout(() => {
                      const element = document.getElementById("get-quote");
                      if (element) {
                        element.scrollIntoView({ behavior: "smooth" });
                        setTimeout(() => {
                          const input = element.querySelector("input");
                          if (input) input.focus();
                        }, 800);
                      }
                    }, 100);
                  } else {
                    window.open("https://wa.me/919618012403", "_blank");
                  }
                }}
                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white py-4.5 rounded-[16px] font-bold text-[15px] uppercase tracking-[1.5px] shadow-[0_10px_20px_rgba(37,99,235,0.2)] hover:shadow-[0_15px_30px_rgba(37,99,235,0.3)] hover:-translate-y-0.5 active:scale-[0.98] transition-all mt-6 py-4"
              >
                <Phone size={18} />
                Enquire via WhatsApp
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Contact Info */}
        <div className="bg-[#0F172A] px-8 py-4 flex items-center justify-between text-white/60 text-[11px] font-bold">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="bg-white/10 p-1.5 rounded-md">
                <Phone size={12} className="text-white/80" />
              </div>
              <span>+91 96180 12403</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-white/10 p-1.5 rounded-md">
                <MapPin size={12} className="text-white/80" />
              </div>
              <span>Gopalapatnam, Visakhapatnam</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="opacity-40 uppercase tracking-widest text-[9px]">Est.</span>
            <span className="text-white/90">2011</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductGalleryView;

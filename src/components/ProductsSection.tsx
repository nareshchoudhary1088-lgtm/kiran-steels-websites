import { useState, useMemo, useRef, useEffect } from "react";
import { ArrowRight, X, Phone, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { supabase } from "@/integrations/supabase/client";
import dimensions from "@/assets/dimensions.json";

import { products, PipesDetails, FittingsDetails } from "../data/products";

interface ProductCardProps {
  product: any;
  onClick: () => void;
  index: number;
  isVisible: boolean;
}

const ProductCard = ({ product, onClick, index, isVisible }: ProductCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const rectRef = useRef<SVGRectElement>(null);

  useEffect(() => {
    if (!cardRef.current || !svgRef.current || !rectRef.current) return;

    const resize = () => {
      if (!cardRef.current || !svgRef.current || !rectRef.current) return;
      const w = cardRef.current.offsetWidth;
      const h = cardRef.current.offsetHeight;
      svgRef.current.setAttribute('viewBox', `0 0 ${w} ${h}`);
      svgRef.current.setAttribute('width', String(w));
      svgRef.current.setAttribute('height', String(h));
      rectRef.current.setAttribute('width', String(w - 2));
      rectRef.current.setAttribute('height', String(h - 2));
      const perim = 2 * ((w - 2) + (h - 2));
      rectRef.current.style.strokeDasharray = String(perim);
      rectRef.current.style.strokeDashoffset = String(perim);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  const handleMouseEnter = () => {
    if (rectRef.current) {
      rectRef.current.style.strokeDashoffset = '0';
    }
  };

  const handleMouseLeave = () => {
    if (rectRef.current) {
      rectRef.current.style.strokeDashoffset = rectRef.current.style.strokeDasharray;
    }
  };

  const settings = {
    fade: false,
    infinite: true,
    speed: 800,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    dots: false,
    pauseOnHover: false,
    lazyLoad: "ondemand" as const,
    cssEase: "cubic-bezier(0.87, 0, 0.13, 1)"
  };

  return (
    <>
      <style>{`
        @property --angle { syntax:'<angle>'; initial-value:0deg; inherits:false; }
        .card-custom {
          position: relative;
          border-radius: 14px;
          background: #fff;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          cursor: pointer;
          transition: transform 0.42s cubic-bezier(0.34,1.45,0.64,1), box-shadow 0.4s ease, opacity 0.8s ease, transform 0.8s ease;
          overflow: hidden;
        }
        .card-border-custom {
          position: absolute;
          inset: 0;
          border-radius: 14px;
          pointer-events: none;
          z-index: 10;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .card-border-custom rect {
          fill: none;
          stroke: url(#blueGradient);
          stroke-width: 2.5;
          rx: 13;
          transition: stroke-dashoffset 0.7s cubic-bezier(0.4,0,0.2,1);
        }
        .card-custom:hover .card-border-custom { opacity: 1; }
        .card-custom::before {
          content: '';
          position: absolute; inset: 0;
          border-radius: 14px;
          box-shadow: inset 0 0 0 1.5px rgba(30,64,175,0);
          background: radial-gradient(ellipse at 50% 0%, rgba(30,64,175,0.2) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 0.4s ease;
          z-index: 2;
          pointer-events: none;
        }
        .card-custom:hover::before { opacity: 1; }
        .card-custom::after {
          content: '';
          position: absolute;
          top: 0; left: -80%; width: 50%; height: 100%;
          background: linear-gradient(105deg, transparent, rgba(255,255,255,0.38), transparent);
          transform: skewX(-14deg);
          z-index: 3;
          opacity: 0;
          pointer-events: none;
        }
        .card-custom:hover::after { animation: shimmer-custom 0.72s ease forwards; }
        .card-custom:hover {
          transform: translateY(-7px) scale(1.012);
          box-shadow: 0 18px 40px rgba(0,0,0,0.10), 0 4px 24px rgba(232,212,138,0.22);
        }
        .img-wrap-custom { overflow:hidden; position:relative; }
        .card-img-custom {
          width:100%; aspect-ratio:1/1; object-transform: scale(1);
          transition: transform 0.55s cubic-bezier(0.25,0.46,0.45,0.94), filter 0.42s;
          filter: brightness(0.93) saturate(0.88);
        }
        .card-body-custom { 
          padding:18px 18px 20px; 
          position:relative; 
          background: #fff; 
          border-top: 1px solid rgba(0,0,0,0.03);
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .card-body-custom::before {
          content:'';
          position:absolute; top:0; left:18px; right:18px; height:1.5px;
          background: linear-gradient(90deg, transparent, #3B82F6, #1E40AF, #3B82F6, transparent);
          transform: scaleX(0);
          transform-origin: center;
          transition: transform 0.5s cubic-bezier(0.4,0,0.2,1);
          border-radius:2px;
        }
        .card-title-custom {
          font-size:13px; font-weight:500; color:#1a1a2e;
          margin-bottom:14px; line-height:1.45;
          transition: color 0.3s;
          font-family: 'Inter', sans-serif;
        }
        .btn-custom {
          display:inline-flex; align-items:center; gap:7px;
          background:#8b1a1a; color:#fff;
          font-size:10.5px; font-weight:600;
          letter-spacing:0.12em; text-transform:uppercase;
          padding:9px 18px; border-radius:5px;
          text-decoration:none; border:none;
          transition: background 0.3s, box-shadow 0.3s, gap 0.25s;
          cursor:pointer;
          position: relative;
          overflow: hidden;
        }
        .btn-custom::after {
          content:'';
          position:absolute; inset:0;
          background: linear-gradient(90deg, transparent 0%, rgba(232,212,138,0.25) 50%, transparent 100%);
          opacity:0; transition:opacity 0.3s;
        }
        @media (min-width: 1024px) {
          .card-img-custom { aspect-ratio: 1/1; }
          .card-title-custom { font-size: 12px; }
          .card-body-custom { padding: 14px 14px 16px; }
          
          .card-custom:hover .card-border-custom { opacity: 1; }
          .card-custom:hover::before { opacity: 1; }
          .card-custom:hover::after { animation: shimmer-custom 0.72s ease forwards; }
          .card-custom:hover {
            transform: translateY(-7px) scale(1.012);
            box-shadow: 0 18px 40px rgba(0,0,0,0.10), 0 4px 24px rgba(30,64,175,0.22);
          }
          .card-custom:hover .card-img-custom {
            transform: scale(1.06);
            filter: brightness(1.02) saturate(1.04);
          }
          .card-custom:hover .card-body-custom::before { transform: scaleX(1); }
          .card-custom:hover .card-title-custom { color:#1e40af; }
          .card-custom:hover .btn-custom {
            background:#8b1a1a;
            box-shadow: 0 4px 14px rgba(139,26,26,0.28);
            gap:11px;
          }
          .card-custom:hover .btn-custom::after { opacity:1; }
          .arr-custom { font-size:14px; line-height:1; transition:transform 0.3s; display:inline-block; }
          .card-custom:hover .arr-custom { transform:translateX(3px); }
        }
        @keyframes shimmer-custom {
          0%   { left:-80%; opacity:1; }
          100% { left:130%; opacity:1; }
        }
      `}</style>
      <div
        ref={cardRef}
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="card-custom group"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
          transitionDelay: `${index * 120}ms`
        }}
      >
        <svg ref={svgRef} className="card-border-custom" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e40af" />
              <stop offset="100%" stopColor="#1e3a8a" />
            </linearGradient>
          </defs>
          <rect ref={rectRef} x="1" y="1" rx="13" />
        </svg>
        <div className="img-wrap-custom">
          <Slider {...settings} className="w-full product-card-slider">
            {(product.frontImages || product.images).map((src: string, i: number) => (
              <div key={i} className="outline-none">
                <img 
                  src={src} 
                  className="card-img-custom object-cover block" 
                  alt={`${product.name} Preview ${i + 1}`} 
                  loading="lazy"
                  decoding="async"
                />
              </div>
            ))}
          </Slider>
        </div>
        <div className="card-body-custom flex flex-col items-start">
          <p className="card-title-custom">
            {product.name}
          </p>
          <button className="btn-custom">
            VIEW MORE <span className="arr-custom">→</span>
          </button>
        </div>
      </div>
    </>
  );
};

const ProductsSection = () => {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectionProduct, setSelectionProduct] = useState<any>(null);
  const [activeSubCat, setActiveSubCat] = useState<string | null>(null);
  const [activeImgIdx, setActiveImgIdx] = useState<number>(0);
  const mobileThumbRef = useRef<HTMLDivElement>(null);
  const desktopThumbRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const [sectionVisible, setSectionVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const isModalOpen = !!selectedProduct || !!selectionProduct;
  const [modalPushed, setModalPushed] = useState(false);

  const selectedProductRef = useRef(selectedProduct);
  const selectionProductRef = useRef(selectionProduct);
  useEffect(() => {
    selectedProductRef.current = selectedProduct;
    selectionProductRef.current = selectionProduct;
  }, [selectedProduct, selectionProduct]);

  useEffect(() => {
    const handlePopState = () => {
      if (window.location.hash !== '#modal') {
        const sel = selectedProductRef.current;
        if (sel && sel.subCategories) {
          setSelectionProduct(sel);
          setSelectedProduct(null);
          setActiveSubCat(null);
          setTimeout(() => {
            if (window.location.hash !== '#modal') {
              window.history.pushState(null, '', '#modal');
            }
          }, 10);
        } else {
          setSelectedProduct(null);
          setSelectionProduct(null);
          setActiveSubCat(null);
        }
      }
    };

    const handleCloseModal = () => {
      setSelectedProduct(null);
      setSelectionProduct(null);
      setActiveSubCat(null);
      if (window.location.hash === '#modal') {
        window.history.back();
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    window.addEventListener('close-product-modal', handleCloseModal);

    if (window.location.hash === '#modal') {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
      window.removeEventListener('close-product-modal', handleCloseModal);
    };
  }, []);

  useEffect(() => {
    if (isModalOpen && window.location.hash !== '#modal') {
      window.history.pushState(null, '', '#modal');
      setModalPushed(true);
    } else if (!isModalOpen && window.location.hash === '#modal' && modalPushed) {
      window.history.back();
      setModalPushed(false);
    }
  }, [isModalOpen, modalPushed]);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setSectionVisible(true);
      }
    }, { threshold: 0.1 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

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

  const displayImages = useMemo(() => {
    if (!selectedProduct) return [];
    if (!activeSubCat) return selectedProduct.images;
    return selectedProduct.subCategories?.find((s: any) => s.name === activeSubCat)?.images || selectedProduct.images;
  }, [selectedProduct, activeSubCat]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isModalOpen || !displayImages.length) return;
      if (e.key === 'ArrowRight') {
        setActiveImgIdx((prev) => (prev < displayImages.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowLeft') {
        setActiveImgIdx((prev) => (prev > 0 ? prev - 1 : displayImages.length - 1));
      } else if (e.key === 'Escape') {
        const sel = selectedProductRef.current;
        if (sel && sel.subCategories) {
          setSelectionProduct(sel);
          setSelectedProduct(null);
          setActiveSubCat(null);
          // no hash change needed because they are both #modal
        } else {
          setSelectedProduct(null);
          setSelectionProduct(null);
          setActiveSubCat(null);
          if (window.location.hash === '#modal') window.history.back();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, displayImages.length]);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);

  const handleProductClick = (product: any) => {
    if (product.subCategories && [
      "Stainless Steel Gates",
      "Stainless Steel Compound Gates",
      "Stainless Steel Railing",
      "Stainless Steel Glass Railing",
      "Stainless Steel Box and Grills",
      "Stainless Steel Letters (Signboards)",
      "Stainless Steel Chairs & Tables"
    ].includes(product.name)) {
      setSelectionProduct(product);
    } else {
      setSelectedProduct(product);
      setActiveSubCat(null);
      setActiveImgIdx(0);
    }
  };

  useEffect(() => {
    const handleOpenProduct = (e: any) => {
      const productName = e.detail;
      const product = products.find(p => p.name === productName);
      if (product) {
        handleProductClick(product);
      }
    };
    window.addEventListener('openProduct', handleOpenProduct);
    return () => window.removeEventListener('openProduct', handleOpenProduct);
  }, []);

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

  return (
    <section id="product" ref={sectionRef} className="py-24 bg-[#eef1f5] relative min-h-screen">
      <div className="container mx-auto px-4 md:px-10 max-w-[1200px]">
        <div className={`text-center mb-[56px] transition-all duration-1000 ${sectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <p className="text-[#c49a2a] font-semibold tracking-[0.38em] uppercase text-[10px] mb-[10px]">What We Offer</p>
          <h2 className="text-[56px] font-playfair font-bold text-[#8B1520] leading-none mb-[14px]">Products</h2>
          <p className="text-[#6b7280] text-[14px] font-light max-w-[360px] mx-auto leading-[1.6]">
            Comprehensive range of steel products catering to diverse industrial requirements.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-[22px]">
          {products.map((product, idx) => (
            <ProductCard
              key={idx}
              product={product}
              index={idx}
              isVisible={sectionVisible}
              onClick={() => handleProductClick(product)}
            />
          ))}
        </div>
      </div>

      {/* Selection Modal (Step 1) - Device Optimized */}
      {selectionProduct && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in duration-300"
          onClick={() => {
            setSelectionProduct(null);
            if (window.location.hash === '#modal') {
              setTimeout(() => window.history.back(), 0);
            }
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#fdfbf7] w-full max-w-[450px] overflow-hidden rounded-[12px] shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),_0_10px_10px_-5px_rgba(0,0,0,0.04)] border border-black/5 animate-in zoom-in-95 duration-300 relative flex flex-col"
          >

            {/* Header Section */}
            <div className="bg-[#064e3b] py-10 px-5 text-center shrink-0">
              <h1 className="font-playfair text-[#ecfdf5] text-[1.75rem] font-normal m-0 leading-tight">
                {selectionProduct.name}
              </h1>
            </div>

            {/* Selection Content */}
            <div className="p-8 overflow-y-auto max-h-[60vh] scrollbar-hide">
              <div className="flex flex-col gap-4">
                {selectionProduct.subCategories.map((sub: any) => {
                  let displayName = sub.name;
                  if (selectionProduct.name === "Stainless Steel Gates") {
                    displayName = sub.name.replace(' Stainless Steel Gates', '').replace('Stainless Steel ', '') + " Series";
                  }

                  return (
                    <button
                      key={sub.name}
                      onClick={() => {
                        setSelectedProduct(selectionProduct);
                        setActiveSubCat(sub.name);
                        setActiveImgIdx(0);
                        setSelectionProduct(null);
                      }}
                      className="group flex items-center justify-between w-full p-6 bg-white border-none border-l-[4px] border-l-[#064e3b] shadow-sm transition-all duration-300 hover:bg-[#f0fdf4] hover:translate-x-1 hover:shadow-md text-left"
                    >
                      <span className="font-bold text-[#064e3b] uppercase tracking-wider text-[15px]">
                        {displayName}
                      </span>
                      <span className="text-[#064e3b] opacity-60 group-hover:opacity-100 transition-opacity text-xl font-serif">
                        →
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer Section */}
            <div className="text-center pb-5 shrink-0">
              <p className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-[0.2em] italic">
                Quality Excellence Since 1998
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Full Screen Gallery (Step 2) */}
      {/* Gallery Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center animate-in fade-in duration-300">

          {/* Mobile Specific Modal (LOCKED FULL SCREEN - FINAL ICE-STEEL BLUE CHOICE) */}
          <div className={`${selectedProduct.name === "Stainless Steel Pipes & Tubes" || selectedProduct.name === "Stainless Steel Fitting Items" ? 'hidden' : 'md:hidden'} fixed inset-0 z-[120] bg-[#F1F5FF] flex flex-col items-center animate-in fade-in slide-in-from-bottom duration-300 overflow-hidden select-none`} onClick={(e) => e.stopPropagation()}>
            {/* Safe Area Spacer (Minimal) */}
            <div className="h-2 shrink-0" />

            {/* Top Navy Pill - Sleek Dynamic Header */}
            <div className="w-[90%] max-w-[400px] bg-gradient-to-r from-[#172554] via-[#1E3A8A] to-[#2563EB] min-h-[48px] py-3.5 rounded-full flex items-center justify-center shadow-[0_12px_28px_rgba(37,99,235,0.3)] mb-2 shrink-0 relative mt-4 border-2 border-white/20 px-10">
              <span className="text-white font-black text-[13px] tracking-[3px] uppercase text-center leading-tight">
                {products.indexOf(selectedProduct) + 1}. {selectedProduct.name}
              </span>
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
                    className={`flex-shrink-0 w-[84px] h-[84px] rounded-[24px] overflow-hidden border-[4.5px] transition-all shadow-xl ${activeImgIdx === i ? 'border-[#1e3a8a] scale-115 z-10' : 'border-white opacity-50 grayscale-[0.3]'}`}
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
                <button
                  onClick={() => {
                    if (selectedProduct.subCategories) {
                      setSelectionProduct(selectedProduct);
                      setSelectedProduct(null);
                      setActiveSubCat(null);
                      setActiveImgIdx(0);
                    } else {
                      setSelectedProduct(null);
                      setActiveSubCat(null);
                      setActiveImgIdx(0);
                      if (window.location.hash === '#modal') window.history.back();
                    }
                  }}
                  className="hidden md:flex bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
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
                        window.dispatchEvent(new Event("close-product-modal"));
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
      )}
    </section>
  );
};

export default ProductsSection;

import ProductGalleryView from './ProductGalleryView';
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
        <ProductGalleryView 
          selectedProduct={selectedProduct} 
          initialSubCat={activeSubCat}
          onClose={() => {
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
        />
      )}
    </section>
  );
};

export default ProductsSection;

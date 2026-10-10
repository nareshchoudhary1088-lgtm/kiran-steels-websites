import aboutShop from "@/assets/about-shop.jpg";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const AboutSection = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const handlePopState = () => setSelectedImage(null);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const openImageModal = (img: string) => {
    window.history.pushState({ imageModal: true }, "");
    setSelectedImage(img);
  };

  const closeImageModal = () => {
    if (window.history.state?.imageModal) {
      window.history.back();
    } else {
      setSelectedImage(null);
    }
  };

  return (
    <section id="about-us" className="py-16 sm:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* Text Content */}
          <div>
            <p className="text-secondary uppercase tracking-[0.45em] font-bold mb-3 text-xs sm:text-sm">
              Who We Are
            </p>
            <h2 className="text-primary mb-5 leading-tight text-4xl sm:text-5xl md:text-6xl font-rozha">
              About Us
            </h2>
            <div className="space-y-5">
              <p className="text-muted-foreground text-base leading-relaxed">
                Kiran Steels is the leading Jindal steel pipe supplier in Gopalpatnam, Visakhapatnam. We are recognized as the prime source for Jindal Stainless Steel, Carbon Steel, and Alloy Steel pipes & tubes, fittings, Welded Pipes, Flats, Angles, Bars, Rods, and Laser Sheets in premium Grades 304, 316, and JT.
              </p>
              <p className="text-muted-foreground text-base leading-relaxed">
                Visakhapatnam's most trusted name for custom Stainless Steel Gates, Grills, Railings, Glass Railings, Compound Gates, Balcony Railings, Main Doors, Gold Coated Railings, Signboards, Dining Tables, and Chairs.
              </p>
            </div>
            <div className="mt-8">
              <Link
                to="/our-story"
                className="inline-block px-7 py-3 bg-primary text-primary-foreground font-semibold text-sm uppercase tracking-wide hover:bg-primary/90 transition-colors rounded-sm"
              >
                Our Story
              </Link>
            </div>
          </div>

          {/* Image Content */}
          <div className="overflow-hidden rounded-sm shadow-2xl h-64 sm:h-80 md:h-[420px]">
            <img
              src={aboutShop}
              alt="Kiran Steels shop"
              loading="lazy"
              decoding="async"
              width={800}
              height={600}
              sizes="(max-width: 768px) 100vw, 50vw"
              className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
            />
          </div>
        </div>
      </div>

      {/* Infinite Scrolling Marquee */}
      <div className="mt-24 max-w-7xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-primary leading-tight text-4xl sm:text-5xl md:text-6xl font-rozha">
          Trending Designs
        </h2>
      </div>
      <div className="mt-8 overflow-hidden relative w-full pb-12 flex flex-col gap-8"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'
        }}>
        {/* Row 1 (Moving Left) */}
        <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
          {[...Array(2)].map((_, i) => (
            <div key={`row1-${i}`} className="flex gap-6 px-3">
              {[
                "WhatsApp Image 2026-10-10 at 11.00.30 AM (1).jpeg",
                "WhatsApp Image 2026-10-10 at 11.00.30 AM.jpeg",
                "WhatsApp Image 2026-10-10 at 11.00.31 AM (1).jpeg",
                "WhatsApp Image 2026-10-10 at 11.00.31 AM.jpeg",
                "WhatsApp Image 2026-10-10 at 11.00.32 AM (1).jpeg",
                "WhatsApp Image 2026-10-10 at 11.00.32 AM.jpeg",
                "WhatsApp Image 2026-10-10 at 11.00.34 AM.jpeg",
                "WhatsApp Image 2026-10-10 at 11.00.35 AM (1).jpeg",
                "WhatsApp Image 2026-10-10 at 11.00.35 AM.jpeg"
              ].map((img, j) => (
                <div key={j} onClick={() => openImageModal(img)} className="group relative w-44 h-32 md:w-64 md:h-48 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-500 shrink-0 border border-[#D4AF37] cursor-pointer bg-muted">
                  <img src={`/marquee-images/${encodeURIComponent(img)}`} alt="Our Work" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Row 2 (Moving Right) */}
        <div className="flex w-max animate-marquee-reverse hover:[animation-play-state:paused]">
          {[...Array(2)].map((_, i) => (
            <div key={`row2-${i}`} className="flex gap-6 px-3">
              {[
                "WhatsApp Image 2026-10-10 at 11.00.36 AM (1).jpeg",
                "WhatsApp Image 2026-10-10 at 11.00.36 AM (2).jpeg",
                "WhatsApp Image 2026-10-10 at 11.00.36 AM.jpeg",
                "WhatsApp Image 2026-10-10 at 11.00.37 AM (1).jpeg",
                "WhatsApp Image 2026-10-10 at 11.00.37 AM.jpeg",
                "WhatsApp Image 2026-10-10 at 11.00.38 AM.jpeg",
                "WhatsApp Image 2026-10-10 at 11.00.39 AM.jpeg",
                "WhatsApp Image 2026-10-10 at 11.00.40 AM (1).jpeg",
                "WhatsApp Image 2026-10-10 at 11.00.40 AM (2).jpeg"
              ].map((img, j) => (
                <div key={j} onClick={() => openImageModal(img)} className="group relative w-44 h-32 md:w-64 md:h-48 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-500 shrink-0 border border-[#D4AF37] cursor-pointer bg-muted">
                  <img src={`/marquee-images/${encodeURIComponent(img)}`} alt="Our Work" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Full Screen Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm cursor-pointer"
          onClick={closeImageModal}
        >
          <div className="relative max-w-5xl max-h-[90vh] w-full flex items-center justify-center">
            <button 
              className="absolute -top-12 right-0 md:-right-12 md:top-0 text-white hover:text-gray-300 transition-colors bg-white/10 rounded-full p-2"
              onClick={(e) => {
                e.stopPropagation();
                closeImageModal();
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img 
              src={`/marquee-images/${encodeURIComponent(selectedImage)}`} 
              alt="Zoomed Design" 
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()} 
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default AboutSection;

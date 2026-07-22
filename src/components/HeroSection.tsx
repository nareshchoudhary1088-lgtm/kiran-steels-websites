import { useEffect, useState } from "react";
import heroSlide2 from "@/assets/hero-slide2.jpg";
import heroShop from "@/assets/hero-shop.jpg";

// hero-slide1 lives in public/ for a stable URL so the <link rel="preload"> in index.html works
const heroSlide1 = "/hero-slide1.jpg";
const slides = [heroSlide1, heroShop, heroSlide2];

const HeroSection = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="home" className="relative w-full h-[82vh] sm:h-[90vh] min-h-[480px] overflow-hidden">
      {slides.map((src, i) => (
        <img
          key={i}
          src={src}
          alt={`Hero slide ${i + 1}`}
          width={1440}
          height={900}
          fetchPriority={i === 0 ? "high" : "low"}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${i === current ? "opacity-100" : "opacity-0"
            }`}
        />
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/20" />

      {/* Wave pattern at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-24 overflow-hidden z-10">
        <svg viewBox="0 0 1440 96" preserveAspectRatio="none" className="w-full h-full">
          <path d="M0,96 C240,20 480,80 720,50 C960,20 1200,70 1440,30 L1440,96 Z" fill="hsl(0 0% 98%)" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center px-5 sm:px-8 max-w-7xl mx-auto">
        <div className="max-w-3xl lg:max-w-4xl w-full">
          <p className="text-secondary uppercase tracking-[0.3em] sm:tracking-[0.45em] font-bold mb-4 text-[13.5px] sm:text-[18px] sm:whitespace-nowrap drop-shadow-md font-google">
            Jindal Stainless Steel Pipe Supplier
          </p>
          <h1 className="text-[3.5rem] sm:text-7xl md:text-9xl leading-[0.9] mb-6 text-white drop-shadow-2xl font-rozha">
            KIRAN<br />
            <span className="text-secondary drop-shadow-lg">STEELS</span>
          </h1>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-2 w-full max-w-xs sm:max-w-none">
            <a
              href="#product"
              className="px-6 sm:px-8 py-3 bg-primary text-white font-bold text-sm uppercase tracking-wide hover:bg-primary/90 transition-colors rounded-sm shadow-lg text-center"
            >
              View Products
            </a>
            <a
              href="#enquiry-form"
              className="px-6 sm:px-8 py-3 border-2 border-secondary text-secondary font-bold text-sm uppercase tracking-wide hover:bg-secondary hover:text-secondary-foreground transition-colors rounded-sm shadow-lg text-center"
            >
              Get Quote
            </a>
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-20 sm:bottom-28 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Slide ${i + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${i === current ? "bg-secondary w-6" : "bg-white/50 w-2"
              }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;

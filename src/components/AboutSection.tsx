import aboutShop from "@/assets/about-shop.jpg";
import { Link } from "react-router-dom";

const AboutSection = () => {
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
    </section>
  );
};

export default AboutSection;

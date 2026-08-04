import { Link } from "react-router-dom";
import { ArrowLeft, Award, ShieldCheck, Truck, Users } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TrustSignalsSection from "@/components/TrustSignalsSection";
import FAQSection from "@/components/FAQSection";
import inventoryImg from "@/assets/story/inventory.png";
import workshopImg from "@/assets/story/workshop.png";

import useAnalytics from "@/hooks/useAnalytics";

const OurStory = () => {
  useAnalytics();
  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <Navbar />
      
      <main className="pt-28 pb-20 overflow-hidden">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-6 mb-16">
          <Link to="/" className="group inline-flex items-center text-primary font-bold gap-2 mb-8 hover:text-primary/80 transition-all">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="tracking-widest text-xs">BACK TO HOME</span>
          </Link>
          
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-primary/10 pb-12">
            <div className="max-w-2xl">
              <p className="text-secondary uppercase tracking-[0.4em] font-bold mb-4 text-xs sm:text-sm">Founding Legacy & Growth</p>
              <h1 className="text-primary text-5xl sm:text-7xl lg:text-8xl font-rozha leading-[1.1] mb-6">Our Story</h1>
              <p className="text-slate-600 text-lg sm:text-xl font-google max-w-xl leading-relaxed">
                From a local steel merchant to Visakhapatnam's premier source for architectural and industrial stainless steel.
              </p>
            </div>
            <div className="hidden lg:block text-right pb-2">
              <span className="text-8xl font-rozha text-primary/5 select-none font-bold">EST. 2011</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-16 items-start">
            
            <div className="lg:col-span-12 space-y-20">
              
              {/* Introduction & Vision */}
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <h2 className="text-3xl font-rozha text-primary">The Vision of Quality</h2>
                  <p className="text-slate-700 text-lg leading-relaxed font-google">
                    Founded in <span className="font-bold text-primary">2011</span> by <span className="font-bold text-primary">Mr. Pataram Choudhary</span>, Kiran Steels was established with a singular mission: to provide Visakhapatnam with unmatched access to India's finest Jindal Stainless Steel. 
                  </p>
                  <p className="text-slate-700 text-lg leading-relaxed font-google">
                    Starting as a dedicated steel distributor in Gopalapatnam, our firm quickly became synonymous with reliability. We recognized that the growing infrastructure of Andhra Pradesh required not just material, but expertise in quality grades like <span className="font-bold">304, 316, and JT</span>.
                  </p>
                </div>
                <div className="rounded-2xl overflow-hidden aspect-[4/3] shadow-2xl">
                  <img 
                    src={inventoryImg} 
                    alt="Kiran Steels Inventory" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>

              {/* Fabrication & Artisanship */}
              <div className="grid md:grid-cols-2 gap-12 items-center md:flex-row-reverse">
                <div className="md:order-2 space-y-6">
                  <h2 className="text-3xl font-rozha text-primary">Mastering the Art of Fabrication</h2>
                  <p className="text-slate-700 text-lg leading-relaxed font-google">
                    Evolution is at our core. Beyond inventory, we expanded into <span className="font-bold">expert fabrication</span>, blending industrial durability with architectural beauty. Today, Kiran Steels is the prime source for custom Stainless Steel Gates, Railings, and Glass systems in the region.
                  </p>
                  <p className="text-slate-700 text-lg leading-relaxed font-google">
                    From luxurious <span className="font-bold text-primary">Gold Coated Railings</span> to functional Main Doors and bespoke furniture, our workshop located near the Gopalapatnam Police Station serves as a hub for craftsmanship and innovation in Visakhapatnam's steel legacy.
                  </p>
                </div>
                <div className="md:order-1 rounded-2xl overflow-hidden aspect-[16/9] md:aspect-[4/5] shadow-2xl">
                  <img 
                    src={workshopImg} 
                    alt="Fabrication Workshop" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>

              {/* Icons */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 py-10 border-y border-primary/10">
                <div className="flex flex-col items-center text-center space-y-3">
                  <Award className="text-secondary w-10 h-10" />
                  <h3 className="font-bold text-primary uppercase text-sm tracking-widest">Quality First</h3>
                  <p className="text-slate-500 text-sm font-google">Sourcing only genuine Jindal Grades for every project.</p>
                </div>
                <div className="flex flex-col items-center text-center space-y-3">
                  <ShieldCheck className="text-secondary w-10 h-10" />
                  <h3 className="font-bold text-primary uppercase text-sm tracking-widest">Trust & Legacy</h3>
                  <p className="text-slate-500 text-sm font-google">14+ years of serving refineries and homes in the city.</p>
                </div>
                <div className="flex flex-col items-center text-center space-y-3">
                  <Truck className="text-secondary w-10 h-10" />
                  <h3 className="font-bold text-primary uppercase text-sm tracking-widest">Broad Reach</h3>
                  <p className="text-slate-500 text-sm font-google">Exporter and supplier to projects across the nation.</p>
                </div>
                <div className="flex flex-col items-center text-center space-y-3">
                  <Users className="text-secondary w-10 h-10" />
                  <h3 className="font-bold text-primary uppercase text-sm tracking-widest">Expert Support</h3>
                  <p className="text-slate-500 text-sm font-google">Consultation from material selection to installation.</p>
                </div>
              </div>

              {/* Closing */}
              <div className="text-center max-w-3xl mx-auto space-y-8">
                <h2 className="text-4xl font-rozha text-primary leading-tight">Building the Future of Visakhapatnam</h2>
                <p className="text-slate-600 text-xl leading-relaxed italic font-google">
                  "Our goal is not just to sell steel, but to build trust that lasts as long as the structures we help create."
                </p>
                <div className="pt-4">
                   <p className="text-slate-700 text-lg font-google">Kiran Steels — Opposite Police Station, Gopalapatnam</p>
                   <p className="text-slate-500 text-sm font-google mt-1 tracking-widest uppercase">Visakhapatnam, Andhra Pradesh</p>
                </div>
              </div>

            </div>
          </div>
        </div>
        
        <div className="mt-20">
          <TrustSignalsSection />
          <FAQSection />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OurStory;

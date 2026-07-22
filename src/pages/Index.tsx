import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ProductsSection from "@/components/ProductsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import useAnalytics from "@/hooks/useAnalytics";
import { useEffect } from "react";
import { toast } from "sonner";

const Index = () => {
  useAnalytics();
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-[96px] sm:pt-[73px]">
        <HeroSection />
        <AboutSection />
        <ProductsSection />
        <ContactSection />
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;

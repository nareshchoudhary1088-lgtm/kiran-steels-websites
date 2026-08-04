import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ProductsSection from "@/components/ProductsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import SEO from "@/components/SEO";
import useAnalytics from "@/hooks/useAnalytics";

const Index = () => {
  useAnalytics();
  
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-secondary/20 overflow-x-hidden">
      <SEO />
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

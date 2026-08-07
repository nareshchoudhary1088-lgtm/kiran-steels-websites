import SEO from "../components/SEO";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ContactSection from "../components/ContactSection";

const ContactUs = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <SEO 
        title="Contact Us - Kiran Steels | Visakhapatnam Showroom" 
        description="Visit our Kiran Steels showroom opposite the Police Station in Gopalapatnam, Visakhapatnam. Contact us for a B2B quote." 
      />
      <Navbar />
      
      <main className="flex-grow pt-32 pb-10">
        <div className="text-center mb-8 px-6">
          <h1 className="text-4xl md:text-5xl font-rozha text-primary mb-4">Contact Kiran Steels</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Visit our showroom or get in touch for custom fabrication quotes.
          </p>
        </div>
        <ContactSection />
      </main>

      <Footer />
    </div>
  );
};

export default ContactUs;

import SEO from "../components/SEO";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const StainlessSteelBoxAndGrills = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <SEO 
        title="Stainless Steel Box and Grills - Kiran Steels" 
        description="Protective stainless steel window grills and utility boxes, custom-designed to fit your space." 
      />
      <Navbar />
      
      <main className="flex-grow pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100">
          <h1 className="text-4xl md:text-5xl font-rozha text-primary mb-6">Stainless Steel Box and Grills</h1>
          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-700 leading-relaxed mb-8">
              Protective stainless steel window grills and utility boxes, custom-designed to fit your space.
            </p>
            {/* More content can be added here */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mt-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Request a Quote</h2>
              <p className="text-slate-600 mb-4">Interested in our Stainless Steel Box and Grills? Contact us today for a customized quote.</p>
              <a href="/contact-us" className="inline-block bg-primary text-white font-semibold px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default StainlessSteelBoxAndGrills;

import SEO from "../components/SEO";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { products } from "../data/products";

const StainlessSteelPipes = () => {
  const product = products.find(p => p.name === "Stainless Steel Pipes & Tubes");
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <SEO 
        title="Stainless Steel Pipes & Tubes - Kiran Steels" 
        description="Premium B2B industrial stainless steel pipes, welded tubes, and fittings. Highlighting Jindal Stainless Steel supplies in Grades 304 and 316." 
      />
      <Navbar />
      
      <main className="flex-grow pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100">
          <h1 className="text-4xl md:text-5xl font-rozha text-primary mb-6">Stainless Steel Pipes & Tubes</h1>
          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-700 leading-relaxed mb-8">
              Premium B2B industrial stainless steel pipes, welded tubes, and fittings. Highlighting Jindal Stainless Steel supplies in Grades 304 and 316.
            </p>
            {/* More content can be added here */}
            {/* Image Gallery for SEO */}
            {product && product.images && product.images.length > 0 && (
              <div className="mt-12 mb-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Our Designs & Projects</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {product.images.map((img: string, idx: number) => (
                    <img 
                      key={idx} 
                      src={img} 
                      alt={`Kiran Steels - ${product.name} - Design ${idx + 1}`} 
                      className="w-full h-auto rounded-xl object-cover shadow-sm hover:shadow-md transition-shadow border border-slate-100"
                      loading="lazy"
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mt-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Request a Quote</h2>
              <p className="text-slate-600 mb-4">Interested in our Stainless Steel Pipes & Tubes? Contact us today for a customized quote.</p>
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

export default StainlessSteelPipes;

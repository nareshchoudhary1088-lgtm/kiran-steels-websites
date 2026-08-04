import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const productsData: Record<string, any> = {
  "jindal-ss-pipes": {
    title: "Jindal Stainless Steel Pipes",
    description: "Premium Quality Jindal Stainless Steel Pipes (Grade 304, 316, & JT).",
    content: `
      <h2>Why Choose Jindal Stainless Steel Pipes?</h2>
      <p>When it comes to construction, fabrication, and structural integrity in Visakhapatnam, <strong>Jindal Stainless Steel Pipes</strong> stand out as the industry gold standard. Kiran Steels is the leading authorized supplier of Jindal SS pipes, ensuring that you receive 100% authentic, certified materials for your residential or commercial projects.</p>
      
      <h3>Available Grades</h3>
      <ul>
        <li><strong>Grade 316:</strong> The ultimate choice for coastal areas like Visakhapatnam. Contains molybdenum, offering exceptional resistance to chloride and saltwater corrosion.</li>
        <li><strong>Grade 304:</strong> The versatile standard. Perfect for indoor fabrication, staircases, and general structural applications where extreme corrosion resistance is not the primary concern.</li>
        <li><strong>JT Grade:</strong> A cost-effective, high-quality alternative developed by Jindal for specific decorative and structural applications.</li>
      </ul>

      <h3>Applications and Use Cases</h3>
      <p>Our Jindal SS pipes are utilized across hundreds of projects in Andhra Pradesh, including:</p>
      <ul>
        <li><strong>Balcony & Staircase Railings:</strong> Providing a sleek, modern finish while ensuring absolute safety and structural rigidity.</li>
        <li><strong>Commercial Plumbing & Pipelines:</strong> Grade 316 pipes are used heavily in industrial and chemical pipeline setups due to their non-reactive nature.</li>
        <li><strong>Custom Gates & Grills:</strong> They form the robust framework for high-security, rust-free compound gates.</li>
      </ul>

      <h3>Technical Specifications</h3>
      <p>We stock pipes ranging from 1/2 inch to 8 inches in outer diameter, with varying wall thicknesses (schedules) to match your exact load-bearing requirements. All pipes are rigorously tested and come with a Manufacturer Test Certificate (MTC).</p>
      <p>For custom lengths or bulk orders, our Visakhapatnam warehouse is fully equipped to deliver on tight deadlines.</p>
    `,
  },
  "carbon-alloy-pipes": {
    title: "Carbon & Alloy Steel Pipes",
    description: "High-strength Carbon and Alloy Steel Pipes for industrial applications.",
    content: `
      <h2>High-Performance Carbon & Alloy Steel Pipes</h2>
      <p>Kiran Steels provides top-tier <strong>Carbon and Alloy Steel Pipes</strong> designed for high-pressure and high-temperature environments. These pipes are the backbone of industrial infrastructure in Visakhapatnam's manufacturing and chemical sectors.</p>
      
      <h3>Key Advantages</h3>
      <ul>
        <li><strong>High Tensile Strength:</strong> Carbon steel offers incredible durability and resistance to stress, making it ideal for structural frameworks and heavy-duty fluid transportation.</li>
        <li><strong>Temperature Resistance:</strong> Alloy pipes are specifically treated to handle extreme temperature variations without warping or losing structural integrity.</li>
        <li><strong>Cost-Effectiveness:</strong> Compared to specialty metals, carbon steel provides an excellent strength-to-cost ratio for large-scale industrial projects.</li>
      </ul>

      <h3>Common Use Cases</h3>
      <p>Our carbon and alloy pipes are trusted by contractors and engineers for:</p>
      <ul>
        <li><strong>Oil & Gas Pipelines:</strong> Safe and reliable transportation of volatile fluids under pressure.</li>
        <li><strong>Structural Foundations:</strong> Used as piling and support columns in large construction projects across Andhra Pradesh.</li>
        <li><strong>Boiler & Heat Exchanger Tubes:</strong> Seamless alloy pipes designed to withstand constant thermal cycling.</li>
      </ul>

      <h3>Custom Sizing and Fabrication</h3>
      <p>We offer both seamless and welded carbon steel pipes in a wide range of schedules (thicknesses). Our in-house fabrication team can cut, thread, and prepare these pipes to your exact project specifications before delivery.</p>
    `,
  },
  "ss-gates": {
    title: "Custom Stainless Steel Gates",
    description: "Premium Stainless Steel Gates for residential and commercial properties.",
    content: `
      <h2>Premium Custom Stainless Steel Gates</h2>
      <p>Your property's entrance is its first impression. Kiran Steels designs, fabricates, and installs stunning <strong>Stainless Steel Gates</strong> that combine unyielding security with elegant, modern aesthetics.</p>
      
      <h3>Why Stainless Steel for Your Gate?</h3>
      <ul>
        <li><strong>Zero Maintenance:</strong> Unlike iron gates that require constant painting to prevent rust, our Grade 304 and 316 SS gates remain pristine year after year, even in Visakhapatnam's humid, salty air.</li>
        <li><strong>Superior Security:</strong> Stainless steel is incredibly tough and difficult to breach, offering peace of mind for your family or business.</li>
        <li><strong>Modern Aesthetics:</strong> Available in brushed, polished, or matte finishes, SS gates instantly elevate the curb appeal of any property.</li>
      </ul>

      <h3>Our Fabrication Capabilities</h3>
      <p>We don't just supply the steel; our master fabricators bring your vision to life. We specialize in:</p>
      <ul>
        <li><strong>Sliding Gates:</strong> Space-saving, smooth-operating gates perfect for wide driveways. We can also integrate automated motor systems.</li>
        <li><strong>Swing Gates:</strong> Traditional double-leaf gates with custom laser-cut design panels and intricate grillwork.</li>
        <li><strong>Pedestrian Wicket Gates:</strong> Integrated small doors within main gates for easy daily access.</li>
      </ul>

      <h3>The Kiran Steels Guarantee</h3>
      <p>Every gate is custom-measured, precision-welded using advanced argon welding techniques to ensure seamless joints, and polished to perfection before installation. We stand by the durability and craftsmanship of every gate we deliver.</p>
    `,
  },
  "custom-fabrication": {
    title: "Custom Steel Fabrication",
    description: "Expert Custom Steel Fabrication services in Visakhapatnam.",
    content: `
      <h2>Expert Custom Steel Fabrication Services</h2>
      <p>Kiran Steels is more than a supplier; we are Visakhapatnam's premier hub for <strong>Custom Steel Fabrication</strong>. From intricate decorative elements to heavy structural frameworks, our state-of-the-art workshop and skilled artisans can handle projects of any scale and complexity.</p>
      
      <h3>Our Fabrication Specialties</h3>
      <ul>
        <li><strong>Glass Railings & Staircases:</strong> We design and install contemporary frameless or semi-frameless glass railings supported by premium Jindal SS hardware.</li>
        <li><strong>Commercial Signboards:</strong> Durable, weather-resistant steel frames and backlit signboards that make your business stand out.</li>
        <li><strong>Custom Furniture:</strong> Bespoke dining tables, chairs, and display racks combining stainless steel frames with glass or wood accents.</li>
        <li><strong>Security Grills:</strong> Window and balcony grills that offer maximum security without compromising on design.</li>
      </ul>

      <h3>The Fabrication Process</h3>
      <p>We believe in precision engineering and flawless execution:</p>
      <ol>
        <li><strong>Consultation & Measurement:</strong> Our team visits your site in Visakhapatnam to take exact measurements and understand your design requirements.</li>
        <li><strong>Material Selection:</strong> We help you choose the right grade of steel (e.g., Grade 316 for exterior, 304 for interior) based on the application.</li>
        <li><strong>Precision Welding & Polishing:</strong> Using TIG/Argon welding, we ensure strong, invisible joints. The final product is polished to your desired finish (mirror, brushed, or matte).</li>
        <li><strong>Professional Installation:</strong> Our installation crew ensures the final product is securely and perfectly fitted at your location.</li>
      </ol>

      <p>Whether you are an architect with a complex blueprint or a homeowner with a unique idea, Kiran Steels has the expertise to bring it to reality.</p>
    `,
  }
};

const ProductDetails = () => {
  const { slug } = useParams<{ slug: string }>();
  const product = slug ? productsData[slug] : null;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center pt-24 text-center">
          <h1 className="text-4xl font-bold text-primary mb-4">Product Not Found</h1>
          <Link to="/" className="text-secondary hover:underline">Return to Home</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-secondary/20">
      <SEO title={product.title + " | Kiran Steels Visakhapatnam"} description={product.description} />
      <Navbar />
      
      <main className="pt-[96px] sm:pt-[73px]">
        <div className="bg-muted/30 py-12 border-b border-border/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <h1 className="text-3xl sm:text-5xl font-rozha text-primary mb-4">{product.title}</h1>
            <p className="text-muted-foreground text-lg">{product.description}</p>
          </div>
        </div>

        <div className="py-16">
          <div 
            className="max-w-4xl mx-auto px-4 sm:px-6 prose prose-lg prose-slate max-w-none 
                       prose-headings:font-rozha prose-headings:text-primary 
                       prose-h2:text-3xl prose-h3:text-2xl
                       prose-p:text-muted-foreground prose-p:leading-relaxed
                       prose-li:text-muted-foreground prose-strong:text-primary"
            dangerouslySetInnerHTML={{ __html: product.content }}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetails;

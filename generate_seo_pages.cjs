const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const pagesDir = path.join(srcDir, 'pages');
const appTsxPath = path.join(srcDir, 'App.tsx');
const sitemapPath = path.join(__dirname, 'public', 'sitemap.xml');

const pages = [
  { name: 'StainlessSteelPipes', slug: 'stainless-steel-pipes', title: 'Stainless Steel Pipes & Tubes', desc: 'Premium B2B industrial stainless steel pipes, welded tubes, and fittings. Highlighting Jindal Stainless Steel supplies in Grades 304 and 316.' },
  { name: 'StainlessSteelFittingItems', slug: 'stainless-steel-fitting-items', title: 'Stainless Steel Fitting Items', desc: 'High-quality stainless steel fitting items for industrial and residential applications.' },
  { name: 'StainlessSteelGates', slug: 'stainless-steel-gates', title: 'Stainless Steel Gates', desc: 'Custom residential and commercial stainless steel main doors and architectural structural fabrication.' },
  { name: 'StainlessSteelCompoundGates', slug: 'stainless-steel-compound-gates', title: 'Stainless Steel Compound Gates', desc: 'Durable and aesthetically pleasing stainless steel compound gates for maximum security and style.' },
  { name: 'StainlessSteelRailing', slug: 'stainless-steel-railing', title: 'Stainless Steel Railing', desc: 'Premium stainless steel balcony and staircase railings, designed for safety and elegance.' },
  { name: 'StainlessSteelGlassRailing', slug: 'stainless-steel-glass-railing', title: 'Stainless Steel Glass Railing', desc: 'Modern frameless and semi-frameless stainless steel glass railings for balconies and stairs.' },
  { name: 'StainlessSteelBalkani', slug: 'stainless-steel-balkani', title: 'Stainless Steel Balkani', desc: 'Beautiful stainless steel balcony designs and grills for residential safety and aesthetics.' },
  { name: 'StainlessSteelBoxAndGrills', slug: 'stainless-steel-box-grills', title: 'Stainless Steel Box and Grills', desc: 'Protective stainless steel window grills and utility boxes, custom-designed to fit your space.' },
  { name: 'StainlessSteelSignboards', slug: 'stainless-steel-signboards', title: 'Stainless Steel Letters & Signboards', desc: 'Laser-cut stainless steel letters and signboards for luxury interior and exterior branding.' },
  { name: 'StainlessSteelSpiralStaircase', slug: 'stainless-steel-spiral-staircase', title: 'Stainless Steel Spiral Staircase', desc: 'Space-saving and elegant stainless steel spiral staircases for homes and commercial spaces.' },
  { name: 'StainlessSteelMandirDesigns', slug: 'stainless-steel-mandir-designs', title: 'Stainless Steel Mandir Designs', desc: 'Beautifully crafted custom stainless steel mandir designs for your home.' },
  { name: 'StainlessSteelChairsTables', slug: 'stainless-steel-chairs-tables', title: 'Stainless Steel Chairs & Tables', desc: 'Luxury interior stainless steel furniture including designer dining tables and chairs.' },
  { name: 'ContactUs', slug: 'contact-us', title: 'Contact Us | Kiran Steels', desc: 'Visit our Kiran Steels showroom opposite the Police Station in Gopalapatnam, Visakhapatnam. Contact us for a B2B quote.' },
];

if (!fs.existsSync(pagesDir)) {
  fs.mkdirSync(pagesDir, { recursive: true });
}

pages.forEach(page => {
  const content = `import SEO from "../components/SEO";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const ${page.name} = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <SEO 
        title="${page.title} - Kiran Steels" 
        description="${page.desc}" 
      />
      <Navbar />
      
      <main className="flex-grow pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100">
          <h1 className="text-4xl md:text-5xl font-rozha text-primary mb-6">${page.title}</h1>
          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-700 leading-relaxed mb-8">
              ${page.desc}
            </p>
            {/* More content can be added here */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mt-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Request a Quote</h2>
              <p className="text-slate-600 mb-4">Interested in our ${page.title}? Contact us today for a customized quote.</p>
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

export default ${page.name};
`;
  
  if (page.name === 'ContactUs') {
    const contactContent = `import SEO from "../components/SEO";
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
`;
    fs.writeFileSync(path.join(pagesDir, page.name + '.tsx'), contactContent);
  } else {
    fs.writeFileSync(path.join(pagesDir, page.name + '.tsx'), content);
  }
});

// Update App.tsx
let appContent = fs.readFileSync(appTsxPath, 'utf8');

const imports = pages.map(p => 'const ' + p.name + ' = lazy(() => import("./pages/' + p.name + '"));').join('\n');
const routes = pages.map(p => '            <Route path="/' + p.slug + '" element={<' + p.name + ' />} />').join('\n');

appContent = appContent.replace(/(const ProductDetails = lazy\(\(\) => import\("\.\/pages\/ProductDetails"\)\);\n)/, '$1\n' + imports + '\n');
appContent = appContent.replace(/(\{\/\* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "\*" ROUTE \*\/\}\n)/, '$1' + routes + '\n');

fs.writeFileSync(appTsxPath, appContent);

// Update sitemap.xml
let sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
const sitemapUrls = pages.map(p => '  <url>\n    <loc>https://kiransteels.in/' + p.slug + '</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>').join('\n');
sitemapContent = sitemapContent.replace(/(<\/urlset>)/, sitemapUrls + '\n$1');
fs.writeFileSync(sitemapPath, sitemapContent);

console.log('Generated pages and updated App.tsx & sitemap.xml');

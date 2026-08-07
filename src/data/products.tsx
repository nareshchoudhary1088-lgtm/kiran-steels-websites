import React from 'react';
import dimensions from "@/assets/dimensions.json";

// --- DYNAMIC ASSET LOADER ---
const allAssets = import.meta.glob("/src/assets/*.{png,jpg,jpeg,webp}", { eager: true });
const assetsArr = Object.entries(allAssets).map(([path, mod]: any) => ({
  path: path.split('/').pop() || "",
  url: mod.default || mod
}));

const filterAssets = (pattern: string) => assetsArr
  .filter(a => a.path.toLowerCase().includes(pattern.toLowerCase()))
  .sort((a, b) => {
    const dimA = (dimensions as any)[a.path] || { w: 0, h: 0 };
    const dimB = (dimensions as any)[b.path] || { w: 0, h: 0 };

    // Sort by largest width first, then largest height
    if (dimA.w !== dimB.w) {
      return dimB.w - dimA.w;
    }
    if (dimA.h !== dimB.h) {
      return dimB.h - dimA.h;
    }
    return a.path.localeCompare(b.path, undefined, { numeric: true, sensitivity: 'base' });
  })
  .map(a => a.url);

// CATEGORY ARRAYS
const plainGateImages = filterAssets('plain-ss-gate');
const modernGateImages = filterAssets('modern-ss-gate');
const packingGateImages = filterAssets('packing-ss-gate');
const compoundGateExclude = ['compound-ss-gate-1.png', 'compound-ss-gate-2.png', 'compound-ss-gate-4.png', 'compound-ss-gate-7.png', 'compound-ss-gate-10.png', 'compound-ss-gate-11.png', 'compound-ss-gate-12.png', 'compound-ss-gate-13.png', 'compound-ss-gate-15.png', 'compound-ss-gate-16.png', 'compound-ss-gate-17.png', 'compound-ss-gate-18.png', 'compound-ss-gate-19.png'];
const plainCompoundGateImages = filterAssets('plain-compound-ss-gate');
const woodenCompoundGateImages = filterAssets('compound-ss-gate').filter(url =>
  !compoundGateExclude.some(ex => url.includes(ex)) && !url.includes('plain-compound-ss-gate')
);

const roundRailingImages = filterAssets('round-railing');
const squareRailingImages = filterAssets('square-railing');
const modernRailingImages = filterAssets('modern-railing');
const modernRailingDesignImages = filterAssets('modern-railing-design');

const glassRailingImages = filterAssets('ss-glass-railing').filter(url => !url.includes('-d') && !url.includes('-e'));
const glassDesignImages = filterAssets('ss-glass-railing-d');
const glassExtraImages = filterAssets('ss-glass-railing-e'); // More variety for glass railing
const goldGlassRailingImages = filterAssets('ss-gold-glass-railing');
const blackGlassRailingImages = filterAssets('ss-black-glass-railing');
const pvdRoseGoldImages = filterAssets('ss-pvd-rose-gold');

const glassRailingNewImages = (() => {
  const arr = [...filterAssets('ss-glass-railing-new')];
  if (arr.length >= 3) {
    const firstImage = arr.shift(); // removes 1st image
    arr.splice(1, 1); // removes the original 3rd image (which is now at index 1)
    if (firstImage) arr.push(firstImage); // add 1st image to end
  }
  return arr;
})();

const englishLetters = (() => {
  const arr = filterAssets('ss-letters-english').filter(url =>
    !url.includes('ss-letters-english-new-11') && !url.includes('ss-letters-english-new-12')
  );

  const new11 = filterAssets('ss-letters-english-new-11')[0];
  const new12 = filterAssets('ss-letters-english-new-12')[0];

  if (arr.length >= 3 && new11) {
    arr[2] = new11;
  }

  let original5th = null;
  if (arr.length >= 5) {
    original5th = arr.splice(4, 1)[0];
  }

  if (new12) {
    arr.splice(4, 0, new12);
  }

  if (original5th) {
    arr.push(original5th);
  }

  return arr;
})();
const teluguLetters = filterAssets('ss-letters-telugu');
const hindiLetters = filterAssets('ss-letters-hindi');
const goldLetters = filterAssets('ss-gold-letters').filter(url =>
  !url.includes('ss-gold-letters-1.png') &&
  !url.includes('ss-gold-letters-2.png') &&
  !url.includes('ss-gold-letters-3.png') &&
  !url.includes('ss-gold-letters-4.png') &&
  !url.includes('ss-gold-letters-real-1.png') &&
  !url.includes('ss-gold-letters-real-2.png') &&
  !url.includes('ss-gold-letters-real-3.png') &&
  !url.includes('ss-gold-letters-real-4.png')
);
const ganeshLetters = filterAssets('ss-letters-ganesh');

const pipesImages = filterAssets('ss-pipes');
const sheetsImages = filterAssets('ss-sheets');
const balkaniImages = filterAssets('ss-balkani');
const boxImages = filterAssets('ss-box-grill');
const grillImages = filterAssets('ss-grill').filter(url => !url.includes('ss-box-grill'));
const boxGrillImages = [...boxImages, ...grillImages];
const wiresImg = filterAssets('ss-wires')[0];
const nipplesImg = filterAssets('ss-nipples')[0];

const frontGateImages = [
  ...filterAssets('modern-ss-gate-1_4x3.jpg'),
  ...filterAssets('modern-ss-gate-2_4x3.jpg'),
  ...filterAssets('packing-ss-gate-1_4x3.jpg'),
  ...filterAssets('plain-ss-gate-5_4x3.jpg'),
  ...filterAssets('plain-ss-gate-24_4x3.jpg')
];

const frontCompoundImages = [
  ...filterAssets('compound-ss-gate-3.png'),
  ...filterAssets('compound-ss-gate-14.png'),
  ...filterAssets('compound-ss-gate-new-23.jpg'),
  ...filterAssets('compound-ss-gate-new-29.jpg'),
  ...filterAssets('plain-compound-ss-gate-2.jpg'),
  ...filterAssets('plain-compound-ss-gate-8.jpg'),
  ...filterAssets('plain-compound-ss-gate-9.jpg')
];

const frontRailingImages = [
  ...filterAssets('modern-railing-design-3.jpg'),
  ...filterAssets('modern-railing-design-5.jpg'),
  ...filterAssets('modern-railing-design-11.jpg'),
  ...filterAssets('round-railing-1.png'),
  ...filterAssets('round-railing-2.jpg'),
  ...filterAssets('round-railing-3.jpg'),
  ...filterAssets('round-railing-12.jpg'),
  ...filterAssets('round-railing-22.jpg'),
  ...filterAssets('square-railing-1.png'),
  ...filterAssets('square-railing-4.jpg')
];

const frontGlassRailingImages = [
  ...filterAssets('ss-black-glass-railing-1.jpg'),
  ...filterAssets('ss-black-glass-railing-11.jpg'),
  ...filterAssets('ss-glass-railing-new-1.png'),
  ...filterAssets('ss-glass-railing-new-2.jpg'),
  ...filterAssets('ss-glass-railing-new-3.png'),
  ...filterAssets('ss-glass-railing-new-9.jpg'),
  ...filterAssets('ss-glass-railing-new-11.jpg'),
  ...filterAssets('ss-glass-railing-new-17.jpg'),
  ...filterAssets('ss-gold-glass-railing-5.jpg'),
  ...filterAssets('ss-gold-glass-railing-6.jpg'),
  ...filterAssets('ss-gold-glass-railing-23.jpg'),
  ...filterAssets('ss-gold-glass-railing-25.jpg')
];

const frontBalkaniImages = [
  ...filterAssets('ss-balkani-1.jpg'),
  ...filterAssets('ss-balkani-2.png'),
  ...filterAssets('ss-balkani-4.jpg'),
  ...filterAssets('ss-balkani-101.jpg'),
  ...filterAssets('ss-balkani-110.jpg'),
  ...filterAssets('ss-balkani-115.jpeg'),
  ...filterAssets('ss-balkani-117.jpeg'),
  ...filterAssets('ss-balkani-124.jpeg'),
  ...filterAssets('ss-balkani-133.jpeg')
];

const frontBoxGrillImages = [
  ...filterAssets('ss-box-grill-1.png'),
  ...filterAssets('ss-box-grill-4.jpg'),
  ...filterAssets('ss-box-grill-11.png'),
  ...filterAssets('ss-box-grill-12.png'),
  ...filterAssets('ss-grill-3.png'),
  ...filterAssets('ss-grill-4.jpg'),
  ...filterAssets('ss-grill-10.png'),
  ...filterAssets('ss-grill-15.jpg'),
  ...filterAssets('ss-grill-21.png')
];

const frontLettersImages = [
  ...filterAssets('ss-gold-letters-real-9.png'),
  ...filterAssets('ss-gold-letters-real-10.jpg'),
  ...filterAssets('ss-gold-letters-real-11.jpg'),
  ...filterAssets('ss-letters-english-1.jpg'),
  ...filterAssets('ss-letters-english-new-11.jpg'),
  ...filterAssets('ss-letters-english-new-12.jpg'),
  ...filterAssets('ss-letters-ganesh-1.36.17-2.jpg'),
  ...filterAssets('ss-letters-hindi-3.jpg'),
  ...filterAssets('ss-letters-telugu-1.png'),
  ...filterAssets('ss-letters-telugu-2.jpg')
];

const spiralStaircaseImages = filterAssets('spiral-staircase');
const mandirImages = filterAssets('mandir');
const chairsImages = filterAssets('ss-chairs');
const tablesImages = filterAssets('ss-tables');
const chairsTablesImages = [...chairsImages, ...tablesImages];

const frontChairsTablesImages = [
  ...filterAssets('ss-chairs-new-4.jpg'),
  ...filterAssets('ss-chairs-new-6.jpg'),
  ...filterAssets('ss-chairs-new-10.jpg'),
  ...filterAssets('ss-chairs-new-11.jpg'),
  ...filterAssets('ss-tables-new-2.jpg'),
  ...filterAssets('ss-tables-new-6.jpg'),
  ...filterAssets('ss-tables-new-9.jpg')
];
const frontMandirImages = [
  ...filterAssets('mandir-new-101.jpeg'),
  ...filterAssets('mandir-new-102.jpeg'),
  ...filterAssets('mandir-new-105.jpeg'),
  ...filterAssets('mandir-new-107.jpeg'),
  ...filterAssets('mandir-new-108.jpeg'),
  ...filterAssets('mandir-new-113.jpeg'),
  ...filterAssets('mandir-new-116.jpeg'),
  ...filterAssets('mandir-new-134.jpeg'),
  ...filterAssets('mandir-new-137.jpeg'),
  ...filterAssets('mandir-new-139.jpeg')
];
const defaultStaircaseImages = spiralStaircaseImages.length > 0 ? spiralStaircaseImages : [
  ...filterAssets('round-railing-1.png'),
  ...filterAssets('square-railing-1.png')
];

const frontSpiralStaircaseImages = [
  ...filterAssets('spiral-staircase-1.jpeg'),
  ...filterAssets('spiral-staircase-3.jpeg'),
  ...filterAssets('spiral-staircase-9.jpeg'),
  ...filterAssets('spiral-staircase-10.jpeg')
];

const PipesDetails = () => (
  <div className="space-y-10 pr-2 pb-8">
    {/* PRODUCT 01 */}
    <div className="space-y-4">
      <div className="space-y-1">
        <p className="text-[10px] font-black text-[#2563EB] tracking-[3px] uppercase">Stainless Steel</p>
        <h4 className="text-[20px] font-black text-[#1E293B] uppercase tracking-tight">Round Pipes</h4>
      </div>
      <p className="text-[#64748B] text-[13px] leading-relaxed font-medium">
        Our round stainless steel pipes are precision-drawn to deliver consistent wall thickness and a flawless finish, making them the preferred choice for staircase railings, handrails, gates, and structural fabrication work. Available in Grade 202, 304 & 316, these pipes combine strength with a smooth, corrosion-resistant surface suited for both indoor and outdoor applications.
      </p>

      <div className="pt-4 border-t border-slate-100">
        <p className="text-[10px] font-black text-[#64748B] uppercase tracking-[2px] mb-3">Features & Specs:</p>
        <ul className="grid grid-cols-1 gap-2.5">
          {["Premium Grade 202 / 304 / 316 Stainless Steel", "Uniform Wall Thickness & Seamless Finish", "High Corrosion & Rust Resistance", "Ideal for Railings, Handrails & Frames", "Custom Lengths Available", "Mirror / Satin Finish Options"].map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-[#334155] font-bold text-[12px] group">
              <div className="w-4 h-4 rounded-full bg-blue-50 text-[#2563EB] flex items-center justify-center text-[9px] mt-0.5 shrink-0">✓</div>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="pt-4 border-t border-slate-100">
        <p className="text-[10px] font-black text-[#64748B] uppercase tracking-[2px] mb-3">Available Sizes (Diameter):</p>
        <div className="grid grid-cols-3 gap-2">
          {["1/2\"", "5/8\"", "3/4\"", "1\"", "1 x 1/4\"", "1 x 1/2\"", "2\"", "2 x 1/2\"", "3\"", "4\""].map((size, i) => (
            <div key={i} className="bg-slate-50 border border-slate-200 rounded-md py-1.5 px-3 text-center text-[12px] font-bold text-slate-700 hover:bg-[#1E3A8A] hover:text-white hover:border-[#1E3A8A] hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-default">
              {size}
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* PRODUCT 02 */}
    <div className="space-y-4 pt-6 border-t-[3px] border-slate-100">
      <div className="space-y-1">
        <p className="text-[10px] font-black text-[#2563EB] tracking-[3px] uppercase">Stainless Steel</p>
        <h4 className="text-[20px] font-black text-[#1E293B] uppercase tracking-tight">Square Pipes</h4>
      </div>
      <p className="text-[#64748B] text-[13px] leading-relaxed font-medium">
        Our square stainless steel pipes offer a clean, modern aesthetic combined with excellent structural rigidity. Widely used for balcony grills, staircase frameworks, gates, and modular fabrication, these pipes are laser-cut to precise dimensions ensuring a perfect fit for every project — from compact residential railings to large-scale commercial structures.
      </p>

      <div className="pt-4 border-t border-slate-100">
        <p className="text-[10px] font-black text-[#64748B] uppercase tracking-[2px] mb-3">Features & Specs:</p>
        <ul className="grid grid-cols-1 gap-2.5">
          {["Premium Grade Stainless Steel", "High Precision Laser-Cut Edges", "Excellent Structural Strength", "Weather-Resistant Coating Available", "Custom Sizes & Designs on Request", "Suitable for Grills, Gates & Frameworks"].map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-[#334155] font-bold text-[12px]">
              <div className="w-4 h-4 rounded-full bg-blue-50 text-[#2563EB] flex items-center justify-center text-[9px] mt-0.5 shrink-0">✓</div>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="pt-4 border-t border-slate-100">
        <p className="text-[10px] font-black text-[#64748B] uppercase tracking-[2px] mb-3">Available Sizes (mm):</p>
        <div className="grid grid-cols-2 gap-2">
          {["12 x 12", "15 x 15", "20 x 20", "25 x 25", "30 x 30", "40 x 40", "50 x 50", "100 x 100"].map((size, i) => (
            <div key={i} className="bg-slate-50 border border-slate-200 rounded-md py-1.5 px-3 text-center text-[12px] font-bold text-slate-700 hover:bg-[#1E3A8A] hover:text-white hover:border-[#1E3A8A] hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-default">
              {size}
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* PRODUCT 03 */}
    <div className="space-y-4 pt-6 border-t-[3px] border-slate-100">
      <div className="space-y-1">
        <p className="text-[10px] font-black text-[#2563EB] tracking-[3px] uppercase">Stainless Steel</p>
        <h4 className="text-[20px] font-black text-[#1E293B] uppercase tracking-tight">Rectangle Pipes</h4>
      </div>
      <p className="text-[#64748B] text-[13px] leading-relaxed font-medium">
        Engineered for projects requiring a stronger structural profile, our rectangular stainless steel pipes are ideal for gate frames, staircase support structures, and heavy-duty fabrication work. Their elongated cross-section provides added strength along one axis, making them a preferred choice for load-bearing and architectural applications.
      </p>

      <div className="pt-4 border-t border-slate-100">
        <p className="text-[10px] font-black text-[#64748B] uppercase tracking-[2px] mb-3">Features & Specs:</p>
        <ul className="grid grid-cols-1 gap-2.5">
          {["Premium Grade Stainless Steel", "Enhanced Load-Bearing Strength", "Precision-Engineered Dimensions", "Rust & Weather Resistant", "Ideal for Gates, Frames & Support Structures", "Custom Cutting Available"].map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-[#334155] font-bold text-[12px]">
              <div className="w-4 h-4 rounded-full bg-blue-50 text-[#2563EB] flex items-center justify-center text-[9px] mt-0.5 shrink-0">✓</div>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="pt-4 border-t border-slate-100">
        <p className="text-[10px] font-black text-[#64748B] uppercase tracking-[2px] mb-3">Available Sizes (mm):</p>
        <div className="grid grid-cols-2 gap-2">
          {["20 x 12", "25 x 12", "40 x 12", "40 x 20", "50 x 25", "50 x 40", "60 x 40", "80 x 40"].map((size, i) => (
            <div key={i} className="bg-slate-50 border border-slate-200 rounded-md py-1.5 px-3 text-center text-[12px] font-bold text-slate-700 hover:bg-[#1E3A8A] hover:text-white hover:border-[#1E3A8A] hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-default">
              {size}
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* PRODUCT 04 */}
    <div className="space-y-4 pt-6 border-t-[3px] border-slate-100">
      <div className="space-y-1">
        <p className="text-[10px] font-black text-[#2563EB] tracking-[3px] uppercase">Stainless Steel</p>
        <h4 className="text-[20px] font-black text-[#1E293B] uppercase tracking-tight">Guru Pipes</h4>
      </div>
      <p className="text-[#64748B] text-[13px] leading-relaxed font-medium">
        Guru Pipes are our heavy-duty stainless steel profile range, built for applications demanding maximum structural strength and durability. Commonly used in industrial fabrication, large gate structures, and reinforced staircase frameworks, these pipes are the trusted choice when strength cannot be compromised.
      </p>

      <div className="pt-4 border-t border-slate-100">
        <p className="text-[10px] font-black text-[#64748B] uppercase tracking-[2px] mb-3">Features & Specs:</p>
        <ul className="grid grid-cols-1 gap-2.5">
          {["Heavy-Duty Stainless Steel Construction", "Superior Strength-to-Weight Ratio", "Built for Industrial & Structural Use", "High Corrosion Resistance", "5-Year Structural Warranty", "Custom Sizes on Request"].map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-[#334155] font-bold text-[12px]">
              <div className="w-4 h-4 rounded-full bg-blue-50 text-[#2563EB] flex items-center justify-center text-[9px] mt-0.5 shrink-0">✓</div>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="pt-4 border-t border-slate-100">
        <p className="text-[10px] font-black text-[#64748B] uppercase tracking-[2px] mb-3">Available Sizes (mm):</p>
        <div className="grid grid-cols-2 gap-2">
          {["25 x 25", "40 x 40", "50 x 50", "60 x 40"].map((size, i) => (
            <div key={i} className="bg-slate-50 border border-slate-200 rounded-md py-1.5 px-3 text-center text-[12px] font-bold text-slate-700 hover:bg-[#1E3A8A] hover:text-white hover:border-[#1E3A8A] hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-default">
              {size}
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const fittingsImages = [
  "/images/fittings/WhatsApp Image 2026-07-18 at 7.38.08 PM.jpg",
  "/images/fittings/WhatsApp Image 2026-07-18 at 7.38.09 PM.jpg",
  "/images/fittings/WhatsApp Image 2026-07-18 at 7.38.11 PM (1).jpg",
  "/images/fittings/WhatsApp Image 2026-07-18 at 7.38.12 PM (1).jpg",
  "/images/fittings/WhatsApp Image 2026-07-18 at 7.38.12 PM.jpg",
  "/images/fittings/WhatsApp Image 2026-07-18 at 7.38.16 PM (1).jpg",
  "/images/fittings/WhatsApp Image 2026-07-18 at 7.38.16 PM (3).jpg",
  "/images/fittings/WhatsApp Image 2026-07-18 at 7.38.16 PM.jpg",
  "/images/fittings/WhatsApp Image 2026-07-18 at 7.38.17 PM.jpg",
  "/images/fittings/WhatsApp Image 2026-07-18 at 7.38.18 PM (1).jpg",
  "/images/fittings/WhatsApp Image 2026-07-18 at 7.38.18 PM.jpg",
  "/images/fittings/WhatsApp Image 2026-07-18 at 7.38.19 PM.jpg"
];

const FITTING_ITEMS_DATA = [
  { name: "1. Elbow", desc: "A pipe fitting used to change the direction of a pipe run, typically at 45° or 90°. Used wherever railing or framework needs to turn a corner.", specs: ["Material: Stainless Steel 202/304", "Common sizes: Matches pipe diameter (½\" to 2\")", "Use: Staircase railings, gate frames, structural bends"] },
  { name: "2. Ball", desc: "A decorative round finial, fitted on top of posts or pipe ends for a finished, ornamental look.", specs: ["Material: Stainless Steel, polished/mirror finish", "Common sizes: Matches post diameter", "Use: Railing post tops, gate pillar tops"] },
  { name: "3. Base Cap", desc: "A flat cover plate fitted at the bottom of a post where it meets the floor, hiding the raw cut edge and anchor bolts.", specs: ["Material: Stainless Steel", "Common sizes: Matches post/pipe diameter", "Use: Floor-mounted posts, staircase bases"] },
  { name: "4. Vyser", desc: "A connector or spacer fitting used between sections of railing/pipe framework.", specs: ["Material: Stainless Steel", "Use: Structural jointing"] },
  { name: "5. Glass Bracket", desc: "A clamp-style fitting that holds and secures glass panels within a railing or balustrade system.", specs: ["Material: Stainless Steel, with rubber/silicone grip lining", "Use: Glass railings, balcony balustrades"] },
  { name: "6. D. Bracket", desc: "A D-shaped mounting bracket used to fix handrails directly onto walls.", specs: ["Material: Stainless Steel", "Use: Wall-mounted handrails, staircases, ramps"] },
  { name: "7. Patti Bracket", desc: "A flat strip-style bracket (\"patti\" = flat band) used for joining or supporting sections of railing.", specs: ["Material: Stainless Steel flat strip", "Use: Structural joints, support bracing"] },
  { name: "8. Welding Rod", desc: "The consumable metal filler rod used during welding to join stainless steel pipes/components.", specs: ["Material: Stainless Steel (matching grade to base metal, e.g., 308L for 304 SS)", "Use: All welded joints in fabrication"] },
  { name: "9. Butterfly", desc: "A butterfly-shaped decorative motif used as infill design in grills and gates.", specs: ["Material: Stainless Steel, laser-cut", "Use: Decorative gates, grill patterns"] },
  { name: "10. Diamond", desc: "A diamond-shaped decorative infill pattern used in grills, gates, and railings.", specs: ["Material: Stainless Steel, laser-cut", "Use: Decorative gates, grill patterns"] },
  { name: "11. Master Post", desc: "The main, load-bearing vertical post anchoring the entire staircase or railing structure.", specs: ["Material: Stainless Steel, thicker gauge than standard balusters", "Common sizes: Larger diameter (2\"–4\")", "Use: Corner posts, starting/ending posts of a railing run"] },
  { name: "12. Starring – 4\"", desc: "Size specification for a starting/reference measurement of 4 inches, used in spacing or post layout.", specs: [] },
  { name: "13. Starring – 6\"", desc: "Size specification for a starting/reference measurement of 6 inches, used in spacing or post layout.", specs: [] },
  { name: "14. Plane Ring", desc: "A plain, undecorated ring fitting used as a simple connector or joint cover.", specs: ["Material: Stainless Steel", "Use: Pipe joints, decorative cover rings"] },
  { name: "15. Wheel Component", desc: "A wheel-shaped part used in sliding gate systems for smooth horizontal movement.", specs: ["Material: Stainless Steel body with nylon/steel bearing wheel", "Use: Sliding gates"] },
  { name: "16. Aldrop", desc: "A traditional sliding bolt latch used as a locking mechanism on gates and doors.", specs: ["Material: Stainless Steel", "Common sizes: 4\", 6\", 8\", 10\", 12\"", "Use: Gate and door locking"] },
  { name: "17. Inches", desc: "Standard unit of measurement applied across all size specifications in your catalog (pipe diameter, gate size, post height, etc.)", specs: [] },
  { name: "18. Compound Gate Inches", desc: "Size specifications (in inches) specifically used for compound/boundary wall gates.", specs: [] },
  { name: "19. Temple Inches", desc: "Size specifications (in inches) used specifically for temple-style gates or railings.", specs: [] },
  { name: "20. Audi Designs", desc: "A specific design pattern/style used in your gate or railing collection.", specs: [] }
];

const FittingsDetails = () => (
  <div className="space-y-6 pr-2 pb-8">
    <div className="space-y-2">
      <p className="text-[10px] font-black text-[#2563EB] tracking-[3px] uppercase">Stainless Steel</p>
      <h4 className="text-[20px] font-black text-[#1E293B] uppercase tracking-tight">Fitting Items</h4>
      <p className="text-[#64748B] text-[13px] leading-relaxed font-medium pt-2">
        Details, Specifications & Uses for our complete range of stainless steel fitting items.
      </p>
    </div>

    <div className="pt-4 border-t border-slate-100">
      <p className="text-[10px] font-black text-[#64748B] uppercase tracking-[2px] mb-3">Fitting Item Names:</p>
      <div className="flex flex-wrap gap-2">
        {FITTING_ITEMS_DATA.map((item, i) => (
          <div key={i} className="bg-slate-50 border border-slate-200 rounded-md py-1.5 px-3 text-center text-[13px] font-bold text-slate-700 shadow-sm hover:bg-[#1E3A8A] hover:text-white hover:border-[#1E3A8A] hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-default">
            {item.name.replace(/^\d+\.\s*/, '')}
          </div>
        ))}
      </div>
    </div>

    <div className="grid grid-cols-1 gap-4 pt-6 border-t border-slate-100">
      {FITTING_ITEMS_DATA.map((item, i) => (
        <div key={i} className="bg-slate-50 border border-slate-100 rounded-xl p-4 shadow-sm">
          <h5 className="text-[16px] font-bold text-[#1E3A8A] mb-2">{item.name}</h5>
          <p className="text-[#475569] text-[14px] leading-relaxed mb-3">{item.desc}</p>
          {item.specs.length > 0 && (
            <ul className="space-y-1.5">
              {item.specs.map((spec, j) => (
                <li key={j} className="flex items-start gap-2 text-[13px] font-medium text-[#64748B]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#2563EB] mt-1.5 shrink-0"></div>
                  {spec}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  </div>
);

const products = [
  {
    name: "Stainless Steel Pipes & Tubes",
    images: pipesImages
  },
  {
    name: "Stainless Steel Fitting Items",
    images: fittingsImages
  },
  {
    name: "Stainless Steel Gates",
    frontImages: frontGateImages.length > 0 ? frontGateImages : undefined,
    images: [...plainGateImages, ...packingGateImages, ...modernGateImages],
    subCategories: [
      { name: "Plain Stainless Steel Gates", images: plainGateImages },
      { name: "Modern Stainless Steel Gates", images: modernGateImages },
      { name: "Stainless Steel Packing Gates", images: packingGateImages }
    ]
  },
  {
    name: "Stainless Steel Compound Gates",
    frontImages: frontCompoundImages.length > 0 ? frontCompoundImages : undefined,
    images: [...plainCompoundGateImages, ...woodenCompoundGateImages],
    subCategories: [
      { name: "Plain Stainless Steel Compound gate", images: plainCompoundGateImages },
      { name: "Wooden Stainless Steel Compound gate", images: woodenCompoundGateImages }
    ]
  },
  {
    name: "Stainless Steel Railing",
    frontImages: frontRailingImages.length > 0 ? frontRailingImages : undefined,
    images: [...roundRailingImages, ...squareRailingImages, ...modernRailingDesignImages],
    subCategories: [
      { name: "Stainless Steel Round Pipe Railing", images: roundRailingImages },
      { name: "Stainless Steel Square Pipe Railing", images: squareRailingImages },
      { name: "Stainless Steel Modern Railing Designs", images: modernRailingDesignImages }
    ]
  },
  {
    name: "Stainless Steel Glass Railing",
    frontImages: frontGlassRailingImages.length > 0 ? frontGlassRailingImages : undefined,
    images: glassRailingNewImages,
    subCategories: [
      { name: "Stainless Steel Glass Railing Designs", images: glassRailingNewImages },
      { name: "Gold Coated Glass Railing Designs", images: goldGlassRailingImages },
      { name: "Black Coated Glass Railing Designs", images: blackGlassRailingImages },
      { name: "PVD Rose Gold Designs & Partitions", images: pvdRoseGoldImages }
    ]
  },
  { name: "Stainless Steel Balkani", frontImages: frontBalkaniImages.length > 0 ? frontBalkaniImages : undefined, images: balkaniImages },
  {
    name: "Stainless Steel Box and Grills",
    frontImages: frontBoxGrillImages.length > 0 ? frontBoxGrillImages : undefined,
    images: boxGrillImages,
    subCategories: [
      { name: "Stainless Steel Box", images: boxImages },
      { name: "Stainless Steel Grills", images: grillImages }
    ]
  },
  {
    name: "Stainless Steel Letters (Signboards)",
    frontImages: frontLettersImages.length > 0 ? frontLettersImages : undefined,
    images: [...englishLetters, ...teluguLetters, ...hindiLetters, ...goldLetters, ...ganeshLetters],
    subCategories: [
      { name: "Steel Letters English", images: englishLetters },
      { name: "Telugu", images: teluguLetters },
      { name: "Hindi", images: hindiLetters },
      { name: "Gold Coated", images: goldLetters },
      { name: "Laser-Engraved Ganesh Design", images: ganeshLetters }
    ]
  },
  {
    name: "Stainless Steel Spiral Staircase",
    frontImages: frontSpiralStaircaseImages,
    images: spiralStaircaseImages,
  },
  {
    name: "Stainless Steel Mandir Designs",
    frontImages: frontMandirImages,
    images: mandirImages,
  },
  {
    name: "Stainless Steel Chairs & Tables",
    frontImages: frontChairsTablesImages,
    images: chairsTablesImages,
    subCategories: [
      { name: "Stainless Steel Chairs", images: chairsImages },
      { name: "Stainless Steel Tables", images: tablesImages }
    ]
  }
];


export { products, PipesDetails, FittingsDetails };

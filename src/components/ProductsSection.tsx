import { useState, useMemo, useRef, useEffect } from "react";
import { ArrowRight, X, Phone, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { supabase } from "@/integrations/supabase/client";
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

interface ProductCardProps {
  product: any;
  onClick: () => void;
  index: number;
  isVisible: boolean;
}

const ProductCard = ({ product, onClick, index, isVisible }: ProductCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const rectRef = useRef<SVGRectElement>(null);

  useEffect(() => {
    if (!cardRef.current || !svgRef.current || !rectRef.current) return;

    const resize = () => {
      if (!cardRef.current || !svgRef.current || !rectRef.current) return;
      const w = cardRef.current.offsetWidth;
      const h = cardRef.current.offsetHeight;
      svgRef.current.setAttribute('viewBox', `0 0 ${w} ${h}`);
      svgRef.current.setAttribute('width', String(w));
      svgRef.current.setAttribute('height', String(h));
      rectRef.current.setAttribute('width', String(w - 2));
      rectRef.current.setAttribute('height', String(h - 2));
      const perim = 2 * ((w - 2) + (h - 2));
      rectRef.current.style.strokeDasharray = String(perim);
      rectRef.current.style.strokeDashoffset = String(perim);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  const handleMouseEnter = () => {
    if (rectRef.current) {
      rectRef.current.style.strokeDashoffset = '0';
    }
  };

  const handleMouseLeave = () => {
    if (rectRef.current) {
      rectRef.current.style.strokeDashoffset = rectRef.current.style.strokeDasharray;
    }
  };

  const settings = {
    fade: false,
    infinite: true,
    speed: 800,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    dots: false,
    pauseOnHover: false,
    lazyLoad: "ondemand" as const,
    cssEase: "cubic-bezier(0.87, 0, 0.13, 1)"
  };

  return (
    <>
      <style>{`
        @property --angle { syntax:'<angle>'; initial-value:0deg; inherits:false; }
        .card-custom {
          position: relative;
          border-radius: 14px;
          background: #fff;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          cursor: pointer;
          transition: transform 0.42s cubic-bezier(0.34,1.45,0.64,1), box-shadow 0.4s ease, opacity 0.8s ease, transform 0.8s ease;
          overflow: hidden;
        }
        .card-border-custom {
          position: absolute;
          inset: 0;
          border-radius: 14px;
          pointer-events: none;
          z-index: 10;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .card-border-custom rect {
          fill: none;
          stroke: url(#blueGradient);
          stroke-width: 2.5;
          rx: 13;
          transition: stroke-dashoffset 0.7s cubic-bezier(0.4,0,0.2,1);
        }
        .card-custom:hover .card-border-custom { opacity: 1; }
        .card-custom::before {
          content: '';
          position: absolute; inset: 0;
          border-radius: 14px;
          box-shadow: inset 0 0 0 1.5px rgba(30,64,175,0);
          background: radial-gradient(ellipse at 50% 0%, rgba(30,64,175,0.2) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 0.4s ease;
          z-index: 2;
          pointer-events: none;
        }
        .card-custom:hover::before { opacity: 1; }
        .card-custom::after {
          content: '';
          position: absolute;
          top: 0; left: -80%; width: 50%; height: 100%;
          background: linear-gradient(105deg, transparent, rgba(255,255,255,0.38), transparent);
          transform: skewX(-14deg);
          z-index: 3;
          opacity: 0;
          pointer-events: none;
        }
        .card-custom:hover::after { animation: shimmer-custom 0.72s ease forwards; }
        .card-custom:hover {
          transform: translateY(-7px) scale(1.012);
          box-shadow: 0 18px 40px rgba(0,0,0,0.10), 0 4px 24px rgba(232,212,138,0.22);
        }
        .img-wrap-custom { overflow:hidden; position:relative; }
        .card-img-custom {
          width:100%; aspect-ratio:1/1; object-transform: scale(1);
          transition: transform 0.55s cubic-bezier(0.25,0.46,0.45,0.94), filter 0.42s;
          filter: brightness(0.93) saturate(0.88);
        }
        .card-body-custom { 
          padding:18px 18px 20px; 
          position:relative; 
          background: #fff; 
          border-top: 1px solid rgba(0,0,0,0.03);
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .card-body-custom::before {
          content:'';
          position:absolute; top:0; left:18px; right:18px; height:1.5px;
          background: linear-gradient(90deg, transparent, #3B82F6, #1E40AF, #3B82F6, transparent);
          transform: scaleX(0);
          transform-origin: center;
          transition: transform 0.5s cubic-bezier(0.4,0,0.2,1);
          border-radius:2px;
        }
        .card-title-custom {
          font-size:13px; font-weight:500; color:#1a1a2e;
          margin-bottom:14px; line-height:1.45;
          transition: color 0.3s;
          font-family: 'Inter', sans-serif;
        }
        .btn-custom {
          display:inline-flex; align-items:center; gap:7px;
          background:#8b1a1a; color:#fff;
          font-size:10.5px; font-weight:600;
          letter-spacing:0.12em; text-transform:uppercase;
          padding:9px 18px; border-radius:5px;
          text-decoration:none; border:none;
          transition: background 0.3s, box-shadow 0.3s, gap 0.25s;
          cursor:pointer;
          position: relative;
          overflow: hidden;
        }
        .btn-custom::after {
          content:'';
          position:absolute; inset:0;
          background: linear-gradient(90deg, transparent 0%, rgba(232,212,138,0.25) 50%, transparent 100%);
          opacity:0; transition:opacity 0.3s;
        }
        @media (min-width: 1024px) {
          .card-img-custom { aspect-ratio: 1/1; }
          .card-title-custom { font-size: 12px; }
          .card-body-custom { padding: 14px 14px 16px; }
          
          .card-custom:hover .card-border-custom { opacity: 1; }
          .card-custom:hover::before { opacity: 1; }
          .card-custom:hover::after { animation: shimmer-custom 0.72s ease forwards; }
          .card-custom:hover {
            transform: translateY(-7px) scale(1.012);
            box-shadow: 0 18px 40px rgba(0,0,0,0.10), 0 4px 24px rgba(30,64,175,0.22);
          }
          .card-custom:hover .card-img-custom {
            transform: scale(1.06);
            filter: brightness(1.02) saturate(1.04);
          }
          .card-custom:hover .card-body-custom::before { transform: scaleX(1); }
          .card-custom:hover .card-title-custom { color:#1e40af; }
          .card-custom:hover .btn-custom {
            background:#8b1a1a;
            box-shadow: 0 4px 14px rgba(139,26,26,0.28);
            gap:11px;
          }
          .card-custom:hover .btn-custom::after { opacity:1; }
          .arr-custom { font-size:14px; line-height:1; transition:transform 0.3s; display:inline-block; }
          .card-custom:hover .arr-custom { transform:translateX(3px); }
        }
        @keyframes shimmer-custom {
          0%   { left:-80%; opacity:1; }
          100% { left:130%; opacity:1; }
        }
      `}</style>
      <div
        ref={cardRef}
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="card-custom group"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
          transitionDelay: `${index * 120}ms`
        }}
      >
        <svg ref={svgRef} className="card-border-custom" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e40af" />
              <stop offset="100%" stopColor="#1e3a8a" />
            </linearGradient>
          </defs>
          <rect ref={rectRef} x="1" y="1" rx="13" />
        </svg>
        <div className="img-wrap-custom">
          <Slider {...settings} className="w-full product-card-slider">
            {(product.frontImages || product.images).map((src: string, i: number) => (
              <div key={i} className="outline-none">
                <img 
                  src={src} 
                  className="card-img-custom object-cover block" 
                  alt={`${product.name} Preview ${i + 1}`} 
                  loading="lazy"
                  decoding="async"
                />
              </div>
            ))}
          </Slider>
        </div>
        <div className="card-body-custom flex flex-col items-start">
          <p className="card-title-custom">
            {product.name}
          </p>
          <button className="btn-custom">
            VIEW MORE <span className="arr-custom">→</span>
          </button>
        </div>
      </div>
    </>
  );
};

const ProductsSection = () => {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectionProduct, setSelectionProduct] = useState<any>(null);
  const [activeSubCat, setActiveSubCat] = useState<string | null>(null);
  const [activeImgIdx, setActiveImgIdx] = useState<number>(0);
  const mobileThumbRef = useRef<HTMLDivElement>(null);
  const desktopThumbRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const [sectionVisible, setSectionVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const isModalOpen = !!selectedProduct || !!selectionProduct;
  const [modalPushed, setModalPushed] = useState(false);

  const selectedProductRef = useRef(selectedProduct);
  const selectionProductRef = useRef(selectionProduct);
  useEffect(() => {
    selectedProductRef.current = selectedProduct;
    selectionProductRef.current = selectionProduct;
  }, [selectedProduct, selectionProduct]);

  useEffect(() => {
    const handlePopState = () => {
      if (window.location.hash !== '#modal') {
        const sel = selectedProductRef.current;
        if (sel && sel.subCategories) {
          setSelectionProduct(sel);
          setSelectedProduct(null);
          setActiveSubCat(null);
          setTimeout(() => {
            if (window.location.hash !== '#modal') {
              window.history.pushState(null, '', '#modal');
            }
          }, 10);
        } else {
          setSelectedProduct(null);
          setSelectionProduct(null);
          setActiveSubCat(null);
        }
      }
    };

    const handleCloseModal = () => {
      setSelectedProduct(null);
      setSelectionProduct(null);
      setActiveSubCat(null);
      if (window.location.hash === '#modal') {
        window.history.back();
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    window.addEventListener('close-product-modal', handleCloseModal);

    if (window.location.hash === '#modal') {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
      window.removeEventListener('close-product-modal', handleCloseModal);
    };
  }, []);

  useEffect(() => {
    if (isModalOpen && window.location.hash !== '#modal') {
      window.history.pushState(null, '', '#modal');
      setModalPushed(true);
    } else if (!isModalOpen && window.location.hash === '#modal' && modalPushed) {
      window.history.back();
      setModalPushed(false);
    }
  }, [isModalOpen, modalPushed]);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setSectionVisible(true);
      }
    }, { threshold: 0.1 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const centerThumbnail = (ref: any) => {
      if (ref.current && ref.current.children[activeImgIdx]) {
        const activeThumb = ref.current.children[activeImgIdx] as HTMLElement;
        const parent = ref.current;
        const scrollLeft = activeThumb.offsetLeft - (parent.offsetWidth / 2) + (activeThumb.offsetWidth / 2);
        parent.scrollTo({ left: scrollLeft, behavior: 'smooth' });
      }
    };
    if (selectedProduct) {
      centerThumbnail(mobileThumbRef);
      centerThumbnail(desktopThumbRef);
    }
  }, [activeImgIdx, selectedProduct, activeSubCat]);

  const displayImages = useMemo(() => {
    if (!selectedProduct) return [];
    if (!activeSubCat) return selectedProduct.images;
    return selectedProduct.subCategories?.find((s: any) => s.name === activeSubCat)?.images || selectedProduct.images;
  }, [selectedProduct, activeSubCat]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isModalOpen || !displayImages.length) return;
      if (e.key === 'ArrowRight') {
        setActiveImgIdx((prev) => (prev < displayImages.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowLeft') {
        setActiveImgIdx((prev) => (prev > 0 ? prev - 1 : displayImages.length - 1));
      } else if (e.key === 'Escape') {
        const sel = selectedProductRef.current;
        if (sel && sel.subCategories) {
          setSelectionProduct(sel);
          setSelectedProduct(null);
          setActiveSubCat(null);
          // no hash change needed because they are both #modal
        } else {
          setSelectedProduct(null);
          setSelectionProduct(null);
          setActiveSubCat(null);
          if (window.location.hash === '#modal') window.history.back();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, displayImages.length]);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);

  const handleProductClick = (product: any) => {
    if (product.subCategories && [
      "Stainless Steel Gates",
      "Stainless Steel Compound Gates",
      "Stainless Steel Railing",
      "Stainless Steel Glass Railing",
      "Stainless Steel Box and Grills",
      "Stainless Steel Letters (Signboards)",
      "Stainless Steel Chairs & Tables"
    ].includes(product.name)) {
      setSelectionProduct(product);
    } else {
      setSelectedProduct(product);
      setActiveSubCat(null);
      setActiveImgIdx(0);
    }
  };

  useEffect(() => {
    const handleOpenProduct = (e: any) => {
      const productName = e.detail;
      const product = products.find(p => p.name === productName);
      if (product) {
        handleProductClick(product);
      }
    };
    window.addEventListener('openProduct', handleOpenProduct);
    return () => window.removeEventListener('openProduct', handleOpenProduct);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const distance = touchStartX.current - touchEndX;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      setActiveImgIdx((prev) => (prev < displayImages.length - 1 ? prev + 1 : 0));
    } else if (distance < -minSwipeDistance) {
      setActiveImgIdx((prev) => (prev > 0 ? prev - 1 : displayImages.length - 1));
    }
    touchStartX.current = null;
  };

  return (
    <section id="product" ref={sectionRef} className="py-24 bg-[#eef1f5] relative min-h-screen">
      <div className="container mx-auto px-4 md:px-10 max-w-[1200px]">
        <div className={`text-center mb-[56px] transition-all duration-1000 ${sectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <p className="text-[#c49a2a] font-semibold tracking-[0.38em] uppercase text-[10px] mb-[10px]">What We Offer</p>
          <h2 className="text-[56px] font-playfair font-bold text-[#8B1520] leading-none mb-[14px]">Products</h2>
          <p className="text-[#6b7280] text-[14px] font-light max-w-[360px] mx-auto leading-[1.6]">
            Comprehensive range of steel products catering to diverse industrial requirements.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-[22px]">
          {products.map((product, idx) => (
            <ProductCard
              key={idx}
              product={product}
              index={idx}
              isVisible={sectionVisible}
              onClick={() => handleProductClick(product)}
            />
          ))}
        </div>
      </div>

      {/* Selection Modal (Step 1) - Device Optimized */}
      {selectionProduct && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in duration-300"
          onClick={() => {
            setSelectionProduct(null);
            if (window.location.hash === '#modal') {
              setTimeout(() => window.history.back(), 0);
            }
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#fdfbf7] w-full max-w-[450px] overflow-hidden rounded-[12px] shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),_0_10px_10px_-5px_rgba(0,0,0,0.04)] border border-black/5 animate-in zoom-in-95 duration-300 relative flex flex-col"
          >

            {/* Header Section */}
            <div className="bg-[#064e3b] py-10 px-5 text-center shrink-0">
              <h1 className="font-playfair text-[#ecfdf5] text-[1.75rem] font-normal m-0 leading-tight">
                {selectionProduct.name}
              </h1>
            </div>

            {/* Selection Content */}
            <div className="p-8 overflow-y-auto max-h-[60vh] scrollbar-hide">
              <div className="flex flex-col gap-4">
                {selectionProduct.subCategories.map((sub: any) => {
                  let displayName = sub.name;
                  if (selectionProduct.name === "Stainless Steel Gates") {
                    displayName = sub.name.replace(' Stainless Steel Gates', '').replace('Stainless Steel ', '') + " Series";
                  }

                  return (
                    <button
                      key={sub.name}
                      onClick={() => {
                        setSelectedProduct(selectionProduct);
                        setActiveSubCat(sub.name);
                        setActiveImgIdx(0);
                        setSelectionProduct(null);
                      }}
                      className="group flex items-center justify-between w-full p-6 bg-white border-none border-l-[4px] border-l-[#064e3b] shadow-sm transition-all duration-300 hover:bg-[#f0fdf4] hover:translate-x-1 hover:shadow-md text-left"
                    >
                      <span className="font-bold text-[#064e3b] uppercase tracking-wider text-[15px]">
                        {displayName}
                      </span>
                      <span className="text-[#064e3b] opacity-60 group-hover:opacity-100 transition-opacity text-xl font-serif">
                        →
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer Section */}
            <div className="text-center pb-5 shrink-0">
              <p className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-[0.2em] italic">
                Quality Excellence Since 1998
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Full Screen Gallery (Step 2) */}
      {/* Gallery Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center animate-in fade-in duration-300">

          {/* Mobile Specific Modal (LOCKED FULL SCREEN - FINAL ICE-STEEL BLUE CHOICE) */}
          <div className={`${selectedProduct.name === "Stainless Steel Pipes & Tubes" || selectedProduct.name === "Stainless Steel Fitting Items" ? 'hidden' : 'md:hidden'} fixed inset-0 z-[120] bg-[#F1F5FF] flex flex-col items-center animate-in fade-in slide-in-from-bottom duration-300 overflow-hidden select-none`} onClick={(e) => e.stopPropagation()}>
            {/* Safe Area Spacer (Minimal) */}
            <div className="h-2 shrink-0" />

            {/* Top Navy Pill - Sleek Dynamic Header */}
            <div className="w-[90%] max-w-[400px] bg-gradient-to-r from-[#172554] via-[#1E3A8A] to-[#2563EB] min-h-[48px] py-3.5 rounded-full flex items-center justify-center shadow-[0_12px_28px_rgba(37,99,235,0.3)] mb-2 shrink-0 relative mt-4 border-2 border-white/20 px-10">
              <span className="text-white font-black text-[13px] tracking-[3px] uppercase text-center leading-tight">
                {products.indexOf(selectedProduct) + 1}. {selectedProduct.name}
              </span>
            </div>



            {/* Main Image Viewport Area (Perfectly Centered in middle gap) */}
            <div className="flex-1 w-full flex items-center justify-center px-12 relative overflow-hidden">
              {/* Navigation Arrows (Fixed to Viewport Edges) */}
              <button
                onClick={() => setActiveImgIdx((prev) => (prev > 0 ? prev - 1 : displayImages.length - 1))}
                className="absolute left-1 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center shadow-[0_10px_30px_rgba(30,58,138,0.4)] active:scale-90 transition-all border-2 border-white z-10"
              >
                <ChevronLeft size={20} strokeWidth={2.5} />
              </button>

              <div
                className="relative flex items-center justify-center w-full max-h-[96%] overflow-visible group"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                <img
                  src={displayImages[activeImgIdx]}
                  className="max-w-full max-h-full w-auto h-auto rounded-[32px] shadow-[0_20px_50px_rgba(15,23,42,0.15)] animate-in fade-in zoom-in-95 duration-500"
                  alt={`Kiran Steels - ${activeSubCat || selectedProduct.name} - Image ${activeImgIdx + 1}`}
                />
              </div>

              <button
                onClick={() => setActiveImgIdx((prev) => (prev < displayImages.length - 1 ? prev + 1 : 0))}
                className="absolute right-1 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center shadow-[0_10px_30px_rgba(30,58,138,0.4)] active:scale-90 transition-all border-2 border-white z-10"
              >
                <ChevronRight size={20} strokeWidth={2.5} />
              </button>
            </div>

            {/* Bottom Controls Area (Anchored & Fixed at bottom) */}
            <div className="w-full px-6 pt-2 pb-6 shrink-0 flex flex-col items-center">
              <div ref={mobileThumbRef} className="flex gap-4 overflow-x-auto w-full px-2 scrollbar-hide py-2">
                {displayImages.map((img: string, i: number) => (
                  <div
                    key={i}
                    onClick={() => setActiveImgIdx(i)}
                    className={`flex-shrink-0 w-[84px] h-[84px] rounded-[24px] overflow-hidden border-[4.5px] transition-all shadow-xl ${activeImgIdx === i ? 'border-[#1e3a8a] scale-115 z-10' : 'border-white opacity-50 grayscale-[0.3]'}`}
                  >
                    <img src={img} className="w-full h-full object-cover" alt={`Kiran Steels - ${activeSubCat || selectedProduct.name} - Thumbnail ${i + 1}`} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Desktop Specific Modal (Fullscreen) */}
          <div className={`${selectedProduct.name === "Stainless Steel Pipes & Tubes" || selectedProduct.name === "Stainless Steel Fitting Items" ? 'flex z-[120]' : 'hidden md:flex'} fixed inset-0 w-full h-[100dvh] flex-col relative bg-white overflow-y-auto md:overflow-hidden`}>

            {/* Header */}
            <div className="bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] px-8 py-5 flex items-center justify-between text-white border-b border-white/10">
              <div className="flex flex-col">
                <h2 className="text-[24px] font-black tracking-tight leading-none mb-1 uppercase">KIRAN STEELS</h2>
                <p className="text-[10px] uppercase font-bold tracking-[2px] opacity-80">PREMIUM STAINLESS STEEL SOLUTIONS</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-white/15 px-3 py-1.5 rounded-lg flex items-center gap-2 border border-white/20">
                  <div className="flex items-center gap-1 text-[#FCD34D]">
                    <span className="text-[14px] font-bold">★ 4.6</span>
                  </div>
                  <span className="text-[10px] font-medium opacity-80 border-l border-white/20 pl-2">35 Reviews</span>
                </div>
                <button
                  onClick={() => {
                    if (selectedProduct.subCategories) {
                      setSelectionProduct(selectedProduct);
                      setSelectedProduct(null);
                      setActiveSubCat(null);
                      setActiveImgIdx(0);
                    } else {
                      setSelectedProduct(null);
                      setActiveSubCat(null);
                      setActiveImgIdx(0);
                      if (window.location.hash === '#modal') window.history.back();
                    }
                  }}
                  className="hidden md:flex bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-col md:flex-row flex-1 md:overflow-hidden min-h-max md:min-h-0">

              {/* Left Column: Image Viewer */}
              {displayImages.length > 0 && (
                <div className="w-full md:w-[55%] p-4 md:p-8 flex flex-col gap-4 md:gap-6 bg-[#F8FAFC] h-[350px] shrink-0 md:h-auto md:flex-1">
                  <div
                    className="relative flex-1 min-h-0 w-full flex items-center justify-center group"
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                  >
                    <div className="absolute top-0 left-0 z-10 bg-[#1E3A8A] text-white px-3 py-1 rounded-[6px] text-[10px] font-bold uppercase tracking-wider shadow-lg">
                      Product {String(activeImgIdx + 1).padStart(2, '0')}
                    </div>

                    <img
                      src={displayImages[activeImgIdx]}
                      className="max-w-full max-h-full w-auto h-auto rounded-[16px] shadow-[0_10px_30px_rgba(0,0,0,0.15)] animate-in fade-in zoom-in-95 duration-500"
                      alt={`Kiran Steels - ${activeSubCat || selectedProduct.name} - Image ${activeImgIdx + 1}`}
                    />

                    {/* Navigation Arrows */}
                    <button
                      onClick={(e) => { e.stopPropagation(); setActiveImgIdx((prev) => (prev > 0 ? prev - 1 : displayImages.length - 1)); }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setActiveImgIdx((prev) => (prev < displayImages.length - 1 ? prev + 1 : 0)); }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>

                  {/* Thumbnails */}
                  <div ref={desktopThumbRef} className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {displayImages.map((img: string, i: number) => (
                      <div
                        key={i}
                        onClick={() => setActiveImgIdx(i)}
                        className={`relative min-w-[70px] h-[70px] rounded-[14px] overflow-hidden cursor-pointer border-2 transition-all ${activeImgIdx === i ? 'border-[#2563EB] scale-95 shadow-md' : 'border-transparent hover:border-[#2563EB]/30'}`}
                      >
                        <img src={img} className="w-full h-full object-cover" alt={`Kiran Steels - ${activeSubCat || selectedProduct.name} - Thumbnail ${i + 1}`} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Right Column: Details */}
              <div className={`w-full ${displayImages.length > 0 ? 'md:w-[45%] border-l border-slate-100' : 'md:w-full max-w-4xl mx-auto'} p-5 md:p-8 flex flex-col bg-white md:overflow-y-auto`}>
                <div className="flex flex-col gap-2 mb-4 md:mb-6 shrink-0">
                  <p className="text-[11px] font-bold text-[#2563EB] tracking-[3px] uppercase">Stainless Steel</p>
                  <h3 className="text-[32px] font-black text-[#1E293B] leading-none uppercase tracking-tight">{selectedProduct.name}</h3>
                  <div className="h-[3.5px] w-14 bg-[#2563EB] rounded-full mt-3"></div>
                </div>

                <div className="space-y-6 flex-1 md:overflow-y-auto pr-2 scrollbar-none">
                  {selectedProduct.name === "Stainless Steel Pipes & Tubes" ? (
                    <PipesDetails />
                  ) : selectedProduct.name === "Stainless Steel Fitting Items" ? (
                    <FittingsDetails />
                  ) : (
                    <>
                      {/* Description Section */}
                      <div className="space-y-4">
                        <p className="text-[#64748B] text-[14px] leading-relaxed font-medium">
                          Crafted with precision engineering, our {selectedProduct.name.toLowerCase()} combine industrial-grade durability with elegant design. Ideal for architectural, residential, and commercial projects.
                        </p>

                        {/* Subcategories (if available) */}
                        {selectedProduct.subCategories && (
                          <div className="pt-4 border-t border-slate-100">
                            <p className="text-[10px] font-black text-[#64748B] uppercase tracking-[2px] mb-3">Filter by Type:</p>
                            <div className="flex flex-wrap gap-2">
                              <button
                                onClick={() => { setActiveSubCat(null); setActiveImgIdx(0); }}
                                className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border ${!activeSubCat ? 'bg-[#1E3A8A] text-white border-[#1E3A8A] shadow-md' : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'}`}
                              >
                                All
                              </button>
                              {selectedProduct.subCategories.map((sub: any) => (
                                <button
                                  key={sub.name}
                                  onClick={() => { setActiveSubCat(sub.name); setActiveImgIdx(0); }}
                                  className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border ${activeSubCat === sub.name ? 'bg-[#1E3A8A] text-white border-[#1E3A8A] shadow-md' : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'}`}
                                >
                                  {sub.name.replace(' Stainless Steel Gates', '').replace('Stainless Steel ', '')}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Features List */}
                      <div className="pt-6 border-t border-slate-100">
                        <p className="text-[10px] font-black text-[#64748B] uppercase tracking-[2px] mb-4">Features & Specs:</p>
                        <ul className="grid grid-cols-1 gap-3">
                          {[
                            "Premium Grade 304/316 Steel",
                            "High Precision Laser Cutting",
                            "Weather-Resistant Coating",
                            "Custom Sizes & Designs",
                            "5-Year Structural Warranty"
                          ].map((item, i) => (
                            <li key={i} className="flex items-center gap-3 text-[#334155] font-bold text-[13px] group">
                              <div className="w-5 h-5 rounded-full bg-blue-50 text-[#2563EB] flex items-center justify-center text-[10px] group-hover:bg-[#2563EB] group-hover:text-white transition-colors">
                                ✓
                              </div>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  )}

                  <button
                    onClick={() => {
                      if (window.innerWidth > 768) {
                        window.dispatchEvent(new Event("close-product-modal"));
                        setTimeout(() => {
                          const element = document.getElementById("get-quote");
                          if (element) {
                            element.scrollIntoView({ behavior: "smooth" });
                            setTimeout(() => {
                              const input = element.querySelector("input");
                              if (input) input.focus();
                            }, 800);
                          }
                        }, 100);
                      } else {
                        window.open("https://wa.me/919618012403", "_blank");
                      }
                    }}
                    className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white py-4.5 rounded-[16px] font-bold text-[15px] uppercase tracking-[1.5px] shadow-[0_10px_20px_rgba(37,99,235,0.2)] hover:shadow-[0_15px_30px_rgba(37,99,235,0.3)] hover:-translate-y-0.5 active:scale-[0.98] transition-all mt-6 py-4"
                  >
                    <Phone size={18} />
                    Enquire via WhatsApp
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Bar: Contact Info */}
            <div className="bg-[#0F172A] px-8 py-4 flex items-center justify-between text-white/60 text-[11px] font-bold">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="bg-white/10 p-1.5 rounded-md">
                    <Phone size={12} className="text-white/80" />
                  </div>
                  <span>+91 96180 12403</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-white/10 p-1.5 rounded-md">
                    <MapPin size={12} className="text-white/80" />
                  </div>
                  <span>Gopalapatnam, Visakhapatnam</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="opacity-40 uppercase tracking-widest text-[9px]">Est.</span>
                <span className="text-white/90">2011</span>
              </div>
            </div>

          </div>
        </div>
      )}
    </section>
  );
};

export default ProductsSection;

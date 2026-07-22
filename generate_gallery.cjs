const fs = require('fs');
const path = require('path');

const assetsDir = 'c:/Users/KIRAN STEEL/.gemini/antigravity/scratch/steel-heart-clone/steel-heart-clone-main/src/assets';
const files = fs.readdirSync(assetsDir);

const categories = {
  plainGate: { prefix: 'plain-ss-gate-', skip: [], name: 'Plain Stainless Steel Gates' },
  modernGate: { prefix: 'modern-ss-gate-', skip: [], name: 'Modern Stainless Steel Gates' },
  packingGate: { prefix: 'packing-ss-gate-', skip: [], name: 'Stainless Steel Packing Gates' },
  compoundGate: { prefix: 'compound-ss-gate-', skip: [], name: 'Stainless Steel Compound Gates' },
  roundRailing: { prefix: 'round-railing-', skip: [], name: 'Round Stainless Steel Railing' },
  squareRailing: { prefix: 'square-railing-', skip: [], name: 'Square Stainless Steel Railing' },
  modernRailing: { prefix: 'modern-railing-', skip: [], name: 'Modern Stainless Steel Railing' },
  glassRailingDesign: { prefix: 'ss-glass-railing-', skip: [], name: 'Glass Railing Designs' },
  lettersEnglish: { prefix: 'ss-letters-english-', skip: [], name: 'English Signboards' },
  lettersTelugu: { prefix: 'ss-letters-telugu-', skip: [], name: 'Telugu Signboards' },
  lettersHindi: { prefix: 'ss-letters-hindi-', skip: [], name: 'Hindi Signboards' },
  goldLetters: { prefix: 'ss-gold-letters-', skip: [], name: 'Gold Letters' },
  boxGrill: { prefix: 'ss-box-grill-', skip: [], name: 'Box Grills' },
  grill: { prefix: 'ss-grill-', skip: [], name: 'Grills' }
};

const results = {};

files.forEach(file => {
  for (const key in categories) {
    if (file.startsWith(categories[key].prefix)) {
      if (!results[key]) results[key] = [];
      const varName = key + file.replace(categories[key].prefix, '').replace(/\.(png|jpg|jpeg|webp)$/, '').replace(/[^a-zA-Z0-9]/g, '_');
      // Fix potential numeric varNames starting with numbers
      const finalVarName = /^[0-9]/.test(varName.replace(key, '')) ? key + '_' + varName.replace(key, '') : varName;
      results[key].push({ varName: finalVarName, file });
    }
  }
});

let importStr = '';
let arrayStr = '';

for (const key in results) {
  results[key].sort((a, b) => {
    const numA = parseInt(a.varName.replace(/[^0-9]/g, '')) || 0;
    const numB = parseInt(b.varName.replace(/[^0-9]/g, '')) || 0;
    return numA - numB;
  });

  results[key].forEach(item => {
    importStr += `import ${item.varName} from "@/assets/${item.file}";\n`;
  });

  arrayStr += `const ${key}Images = [\n  ${results[key].map(i => i.varName).join(', ')}\n];\n\n`;
}

console.log(importStr);
console.log('\n---\n');
console.log(arrayStr);

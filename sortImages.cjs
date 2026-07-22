const fs = require('fs');
const path = require('path');
const sizeOf = require('image-size');

const fileContent = fs.readFileSync('src/components/ProductsSection.tsx', 'utf8');

const importRegex = /import\s+([a-zA-Z0-9_]+)\s+from\s+["']@\/assets\/([^"']+)["']/g;
const imports = {};
let match;
while ((match = importRegex.exec(fileContent)) !== null) {
  imports[match[1]] = match[2];
}

const getSortKeys = (vName) => {
  const file = imports[vName];
  if (!file) return { aspect: 0, w: 0, h: 0 };
  const fullPath = path.join('src/assets', file);
  try {
    const dims = sizeOf(fullPath);
    const aspect = Math.round((dims.width / dims.height) * 100) / 100;
    return { aspect, w: dims.width, h: dims.height };
  } catch(e) {
    return { aspect: 0, w: 0, h: 0 };
  }
}

const arraysToFix = [
  'plainGateImages',
  'packingGateImages',
  'modernGateImages',
  'compoundGateImages',
  'roundRailingImages',
  'squareRailingImages',
  'modernRailingImages',
  'ssGlassRailingDesignImages',
  'glassDesignImages'
];

for (const arrName of arraysToFix) {
  const regex = new RegExp(`const\\s+${arrName}\\s+=\\s+\\[([\\s\\S]*?)\\];`);
  const matchMatch = fileContent.match(regex);
  if (matchMatch) {
    const rawItems = matchMatch[1].split(',').map(s => s.trim()).filter(Boolean);
    
    rawItems.sort((a, b) => {
      const keysA = getSortKeys(a);
      const keysB = getSortKeys(b);
      const areaA = keysA.w * keysA.h;
      const areaB = keysB.w * keysB.h;
      
      if (areaA !== areaB) {
        return areaB - areaA; // Larger images first
      }
      // Finally tie-break with name
      // Try resolving numbers if plainGate1, plainGate12
      const numA = parseInt(a.replace(/[^0-9]/g, '')) || 0;
      const numB = parseInt(b.replace(/[^0-9]/g, '')) || 0;
      if(numA !== numB) return numA - numB;

      return a.localeCompare(b);
    });

    // Make text format, 5 per line
    let lines = [];
    for(let i = 0; i < rawItems.length; i += 5) {
       lines.push("  " + rawItems.slice(i, i+5).join(', '));
    }
    const newStr = `const ${arrName} = [\n${lines.join(',\n')},\n];`;
    console.log(`${arrName}_START`);
    console.log(newStr);
    console.log(`${arrName}_END\n\n`);
  }
}

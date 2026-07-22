const fs = require('fs');
const path = require('path');
const sizeOf = require('image-size');

const assetsDir = path.join(__dirname, 'src', 'assets');
const files = fs.readdirSync(assetsDir);

const dimensions = {};

files.forEach(file => {
  if (file.match(/\.(png|jpe?g|webp)$/i)) {
    try {
      const fullPath = path.join(assetsDir, file);
      const dims = sizeOf.imageSize ? sizeOf.imageSize(fullPath) : sizeOf(fullPath);
      dimensions[file] = { w: dims.width, h: dims.height };
    } catch (e) {
      console.error(`Error reading dimensions for ${file}`, e);
    }
  }
});

fs.writeFileSync(path.join(assetsDir, 'dimensions.json'), JSON.stringify(dimensions, null, 2));
console.log('Dimensions saved to src/assets/dimensions.json');

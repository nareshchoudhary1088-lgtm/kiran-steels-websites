const fs = require('fs');
const sharp = require('sharp');
const path = require('path');
const dir = 'public/images/fittings/';

async function fixImages() {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (!file.endsWith('.jpg') && !file.endsWith('.jpeg') && !file.endsWith('.png')) continue;
    if (file.startsWith('test_') || file.startsWith('temp_')) continue;
    
    const filePath = path.join(dir, file);
    const tempPath = path.join(dir, 'temp_' + file);
    
    try {
      const buffer = fs.readFileSync(filePath);
      const meta = await sharp(buffer).metadata();
      const w = meta.width;
      const h = meta.height;
      
      // Calculate watermark box size (approx 20% width and 15% height in bottom right)
      const rectW = Math.floor(w * 0.22);
      const rectH = Math.floor(h * 0.16);
      
      const svg = `<svg width="${w}" height="${h}"><rect x="${w - rectW}" y="${h - rectH}" width="${rectW}" height="${rectH}" fill="white" /></svg>`;
      
      const outBuffer = await sharp(buffer)
        .composite([{ input: Buffer.from(svg), blend: 'over' }])
        .toBuffer();
        
      fs.writeFileSync(filePath, outBuffer);
      console.log('Fixed ' + file);
    } catch (err) {
      console.error('Error processing ' + file, err.message);
    }
  }
}
fixImages();

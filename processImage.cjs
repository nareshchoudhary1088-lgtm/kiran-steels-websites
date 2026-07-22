const Jimp = require('jimp');

async function processImage() {
  try {
    const imagePath = 'src/assets/ks_logo.png';
    console.log('Loading image:', imagePath);
    const image = await Jimp.read(imagePath);
    
    const width = image.bitmap.width;
    const height = image.bitmap.height;
    
    const centerX = width / 2;
    const centerY = height / 2;
    // The logo circle almost touches the edges, we'll use slightly less than half width/height
    const radius = Math.min(centerX, centerY) - 2; 

    // Light Cherry Red color (0xFFB3C6FF)
    const cherryRed = Jimp.rgbaToInt(255, 179, 198, 255);

    // Loop through all pixels
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        // Calculate distance from center
        const dx = x - centerX;
        const dy = y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // If distance is greater than radius, it's outside the circle (in the corner)
        if (distance > radius) {
          // Replace with light cherry red
          image.setPixelColor(cherryRed, x, y);
        }
      }
    }

    // Save the processed image back
    await image.writeAsync('public/icon-192.png');
    
    // Create a 512x512 version for PWA
    const image512 = await image.clone().resize(512, 512);
    await image512.writeAsync('public/icon-512.png');
    
    console.log('Successfully processed and saved icons.');
  } catch (err) {
    console.error('Error processing image:', err);
  }
}

processImage();

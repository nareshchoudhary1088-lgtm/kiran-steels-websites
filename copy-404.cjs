const fs = require('fs');
const path = require('path');

const indexFile = path.join(__dirname, 'dist', 'index.html');
const notFoundFile = path.join(__dirname, 'dist', '404.html');

try {
  if (fs.existsSync(indexFile)) {
    fs.copyFileSync(indexFile, notFoundFile);
    console.log('✅ Successfully copied index.html to 404.html for GitHub Pages SPA routing.');
  } else {
    console.log('⚠️ dist/index.html not found. Build might have failed.');
  }
} catch (error) {
  console.error('Error copying 404.html:', error);
}

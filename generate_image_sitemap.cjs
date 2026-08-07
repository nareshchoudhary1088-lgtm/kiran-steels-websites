const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, 'dist', 'assets');
const sitemapPath = path.join(__dirname, 'dist', 'image-sitemap.xml');
const siteUrl = 'https://www.kiransteels.in/';

if (!fs.existsSync(distPath)) {
  console.log('Dist assets directory not found. Make sure to run this after build.');
  process.exit(0);
}

const files = fs.readdirSync(distPath);
const imageFiles = files.filter(file => /\.(jpg|jpeg|png|webp|gif)$/i.test(file));

if (imageFiles.length === 0) {
  console.log('No images found in dist/assets.');
  process.exit(0);
}

const sitemapHeader = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${siteUrl}</loc>`;

const imageNodes = imageFiles.map(img => {
  return `    <image:image>
      <image:loc>${siteUrl}assets/${img}</image:loc>
    </image:image>`;
}).join('\n');

const sitemapFooter = `
  </url>
</urlset>`;

const fullSitemap = sitemapHeader + '\n' + imageNodes + sitemapFooter;

fs.writeFileSync(sitemapPath, fullSitemap);
console.log(`Generated image-sitemap.xml with ${imageFiles.length} images.`);

const fs = require('fs');
const data = fs.readFileSync('src/assets/ks_logo.png').toString('base64');
const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" viewBox="0 0 192 192">
  <clipPath id="circleClip">
    <circle cx="96" cy="96" r="94" />
  </clipPath>
  <image href="data:image/png;base64,${data}" width="192" height="192" clip-path="url(#circleClip)" />
</svg>
`;
fs.writeFileSync('public/icon-192.svg', svg.trim());
console.log('SVG created successfully');

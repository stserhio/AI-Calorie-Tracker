import fs from 'fs';
import path from 'path';

const dist = path.join(process.cwd(), 'dist');
const publicDir = path.join(process.cwd(), 'public');

if (!fs.existsSync(dist)) {
  console.error('Run "vite build" first. dist/ not found.');
  process.exit(1);
}

// Copy index.html
const indexSrc = path.join(dist, 'index.html');
if (fs.existsSync(indexSrc)) {
  fs.copyFileSync(indexSrc, path.join(publicDir, 'index.html'));
  console.log('Copied index.html');
}

// Copy assets folder
const assetsSrc = path.join(dist, 'assets');
if (fs.existsSync(assetsSrc)) {
  const assetsDest = path.join(publicDir, 'assets');
  if (!fs.existsSync(assetsDest)) fs.mkdirSync(assetsDest, { recursive: true });
  for (const name of fs.readdirSync(assetsSrc)) {
    const src = path.join(assetsSrc, name);
    const dest = path.join(assetsDest, name);
    fs.copyFileSync(src, dest);
  }
  console.log('Copied assets/');
}

console.log('Vite build copied to public/');

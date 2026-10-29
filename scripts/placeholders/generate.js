// Generates the flat garment illustrations in public/images from data/products.json.
// Run: node scripts/placeholders/generate.js  (needs the "Archivo Expanded Black" font installed for prints;
// without it the prints fall back to a system font).
const sharp = require('sharp');
const fs = require('fs');
const { scene, PRINTS, BONE, INK } = require('./garments.js');
const path = require('path');
const ROOT = path.resolve(__dirname, '../..');
const OUT = path.join(ROOT, 'public/images');
const products = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/products.json'), 'utf8'));
const CONCRETE = '#8A8A8A';
fs.rmSync(OUT, { recursive: true, force: true }); fs.mkdirSync(OUT, { recursive: true });

const TYPES = {
  'heavyweight-oversized-hoodie': ['hoodie', {}],
  'boxy-hoodie': ['hoodie', { crop: true, print: PRINTS.est }],
  'logo-hoodie': ['hoodie', { print: PRINTS.logo }],
  'oversized-logo-tee': ['tee', { neckLogo: true }],
  'heavyweight-blank-tee-250gsm': ['tee', {}],
  'graphic-tee-drop-01': ['tee', { print: PRINTS.drop }],
  'boxy-tee': ['tee', { crop: true }],
  'washed-long-sleeve-tee': ['tee', { long: true }],
  'wide-leg-cargo-pants': ['pants', { kind: 'cargo' }],
  'baggy-sweatpants': ['pants', { kind: 'sweat' }],
  'baggy-jeans': ['pants', { kind: 'jeans' }],
  'knit-beanie': ['beanie', {}],
  'tote-bag': ['tote', {}],
};
const save = (svg, name) => sharp(Buffer.from(svg)).webp({ quality: 90 }).toFile(`${OUT}/${name}.webp`);

// Multi-garment composition.
function compose(width, height, bg, items) {
  const parts = items.map((it) => {
    const svg = scene({ ...it, width, height, bg: 'none' });
    return svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '').replace('<rect width="100%" height="100%" fill="none"/>', '');
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="100%" height="100%" fill="${bg}"/>${parts.join('')}</svg>`;
}

(async () => {
  const manifest = {};
  for (const p of products) {
    const [type, opts] = TYPES[p.handle];
    manifest[p.handle] = {};
    for (const c of p.colors) {
      const base = `g-${p.handle}-${c.slug}`;
      await save(scene({ type, opts, color: c.hex, scale: 0.86 }), `${base}-1`);
      await save(scene({ type, opts: { ...opts, back: true }, color: c.hex, scale: 0.86 }), `${base}-2`);
      manifest[p.handle][c.slug] = base;
    }
  }
  const hoodieLogo = { type: 'hoodie', opts: { print: PRINTS.logo } };
  // Hero: bone logo hoodie on ink.
  await save(scene({ ...hoodieLogo, color: BONE, bg: INK, width: 2000, height: 1125, scale: 0.74, cx: 0.7, cy: 0.54 }), 'hero');
  await save(scene({ ...hoodieLogo, color: BONE, bg: INK, width: 1080, height: 1742, scale: 0.68, cx: 0.5, cy: 0.33 }), 'hero-mobile');
  // Category tiles.
  await save(scene({ ...hoodieLogo, color: INK, scale: 0.86 }), 'cat-hoodies');
  await save(scene({ type: 'tee', opts: {}, color: '#FFFFFF', scale: 0.86 }), 'cat-tees');
  await save(scene({ type: 'pants', opts: { kind: 'cargo' }, color: '#7E7E7B', scale: 0.86 }), 'cat-pants');
  // Editorial + about.
  await save(scene({ type: 'tee', opts: { print: PRINTS.drop }, color: INK, bg: CONCRETE, width: 1400, height: 1750, scale: 0.8 }), 'editorial');
  await save(scene({ type: 'tee', opts: { long: true }, color: BONE, bg: INK, width: 1400, height: 1750, scale: 0.8 }), 'about-1');
  await save(scene({ type: 'hoodie', opts: { back: true }, color: INK, bg: BONE, width: 1400, height: 1750, scale: 0.8 }), 'about-2');
  await save(compose(2000, 1000, CONCRETE, [
    { type: 'hoodie', opts: { print: PRINTS.logo }, color: INK, scale: 0.86, cx: 0.2, cy: 0.5 },
    { type: 'tee', opts: { print: PRINTS.drop }, color: BONE, scale: 0.86, cx: 0.5, cy: 0.5 },
    { type: 'pants', opts: { kind: 'cargo' }, color: '#3A3A38', scale: 0.86, cx: 0.8, cy: 0.5 },
  ]), 'about-3');
  // Social grid.
  const social = [
    [{ ...hoodieLogo, color: BONE }, INK],
    [{ type: 'tee', opts: { print: PRINTS.drop }, color: INK }, BONE],
    [{ type: 'pants', opts: { kind: 'cargo' }, color: INK }, CONCRETE],
    [{ type: 'tee', opts: {}, color: '#FFFFFF' }, INK],
    [{ type: 'beanie', opts: {}, color: '#8A8A8A' }, BONE],
    [{ type: 'hoodie', opts: { crop: true, print: PRINTS.est }, color: '#2B2B2A' }, CONCRETE],
  ];
  for (let i = 0; i < social.length; i++) {
    const [g, bg] = social[i];
    await save(scene({ ...g, bg, width: 800, height: 800, scale: 0.92 }), `social-${i + 1}`);
  }
  void manifest;
  // OG image.
  const og = scene({ ...hoodieLogo, color: BONE, bg: INK, width: 1200, height: 630, scale: 0.95, cx: 0.76, cy: 0.52 })
    .replace('</svg>', `<text x="60" y="100" font-family="Archivo Expanded Black" font-size="48" fill="#fff">OSTREV</text><text x="56" y="520" font-family="Inter Display" font-weight="900" font-size="132" letter-spacing="-5" fill="#fff">DROP 01</text><text x="62" y="566" font-family="Inter" font-weight="600" font-size="19" letter-spacing="3" fill="#fff">BUILT HEAVY. WORN LOOSE.</text></svg>`);
  await sharp(Buffer.from(og)).jpeg({ quality: 88 }).toFile(path.join(ROOT, 'public/og.jpg'));
  console.log('generated', fs.readdirSync(OUT).length);
})();

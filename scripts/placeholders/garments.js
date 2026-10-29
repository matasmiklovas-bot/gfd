// Flat garment illustrations used as consistent placeholder imagery (1200x1500 canvas).
const BONE = '#F4F2EE', INK = '#0A0A0A';

function lum(hex) {
  const n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}
function style(fill, bg) {
  const L = lum(fill);
  const light = L > 0.8;
  return {
    fill: light && lum(bg) > 0.8 ? '#FFFFFF' : fill,
    stroke: light ? 'rgba(10,10,10,0.16)' : 'none',
    detail: L < 0.45 ? 'rgba(255,255,255,0.13)' : 'rgba(10,10,10,0.13)',
    shade: L < 0.45 ? 'rgba(255,255,255,0.06)' : 'rgba(10,10,10,0.07)',
    ink: L < 0.5 ? '#ECE8E1' : '#111111',
    // Inside of the hood: a step darker for light garments, a step lighter for black ones.
    inner: L < 0.2 ? 'rgba(255,255,255,0.10)' : 'rgba(10,10,10,0.16)',
  };
}
const line = (d, c, w = 4, extra = '') => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;

function tee({ back = false, long = false, crop = false, print, neckLogo }, s) {
  const hem = crop ? 1080 : 1180;
  const sleeve = long
    ? { l: 'L250,390 L110,1150 L230,1175 L300,640', r: 'L950,390 L1090,1150 L970,1175 L900,640' }
    : { l: 'L250,390 L120,620 L270,700 L300,600', r: 'L950,390 L1080,620 L930,700 L900,600' };
  const body = `M470,330 ${back ? 'Q600,352 730,330' : 'Q600,412 730,330'} ${sleeve.r.replace(/^L950,390 /, 'L950,390 ')} L900,${hem} L300,${hem} ${sleeve.l.split(' ').reverse().join(' ').replace('L250,390', '')} L250,390 Z`;
  // Build body explicitly for clarity.
  const d = long
    ? `M470,330 ${back ? 'Q600,352 730,330' : 'Q600,412 730,330'} L950,390 L1090,1150 L970,1175 L900,640 L900,${hem} L300,${hem} L300,640 L230,1175 L110,1150 L250,390 Z`
    : `M470,330 ${back ? 'Q600,352 730,330' : 'Q600,412 730,330'} L950,390 L1080,620 L930,700 L900,600 L900,${hem} L300,${hem} L300,600 L270,700 L120,620 L250,390 Z`;
  void body;
  let out = `<path d="${d}" fill="${s.fill}" stroke="${s.stroke}" stroke-width="3" stroke-linejoin="round"/>`;
  if (!back) out += `<path d="M470,330 Q600,412 730,330 Q600,362 470,330 Z" fill="${s.shade}"/>`;
  out += line(back ? 'M470,330 Q600,352 730,330' : 'M470,330 Q600,412 730,330', s.detail, 16);
  out += line(long ? 'M250,390 L300,640' : 'M250,390 L300,600', s.detail, 3) + line(long ? 'M950,390 L900,640' : 'M950,390 L900,600', s.detail, 3);
  out += line(`M305,${hem - 28} L895,${hem - 28}`, s.detail, 3, 'stroke-dasharray="10 9"');
  if (long) out += line('M116,1118 L236,1142', s.detail, 3) + line('M1084,1118 L964,1142', s.detail, 3);
  if (print && !back) out += print(s);
  if (neckLogo && back) out += `<text x="600" y="420" text-anchor="middle" font-family="Archivo Expanded Black" font-size="26" fill="${s.ink}" opacity="0.9">OSTREV</text>`;
  return out;
}

function hoodie({ back = false, crop = false, print }, s) {
  const hem = crop ? 1040 : 1130, band = hem + 70;
  let out = '';
  // Hood behind (front view) or lying on the back (back view).
  out += back
    ? ''
    : `<path d="M405,395 Q385,185 600,160 Q815,185 795,395 L752,402 Q735,262 600,248 Q465,262 448,402 Z" fill="${s.fill}" stroke="${s.stroke}" stroke-width="3" stroke-linejoin="round"/>`;
  // Sleeves
  out += `<path d="M250,420 L135,${band - 70} L245,${band - 52} L300,720 Z" fill="${s.fill}" stroke="${s.stroke}" stroke-width="3" stroke-linejoin="round"/>`;
  out += `<path d="M950,420 L1065,${band - 70} L955,${band - 52} L900,720 Z" fill="${s.fill}" stroke="${s.stroke}" stroke-width="3" stroke-linejoin="round"/>`;
  out += `<path d="M135,${band - 70} L245,${band - 52} L238,${band + 2} L128,${band - 14} Z" fill="${s.fill}" stroke="${s.stroke}" stroke-width="3"/>`;
  out += `<path d="M1065,${band - 70} L955,${band - 52} L962,${band + 2} L1072,${band - 14} Z" fill="${s.fill}" stroke="${s.stroke}" stroke-width="3"/>`;
  out += `<path d="M135,${band - 70} L245,${band - 52} L238,${band + 2} L128,${band - 14} Z M1065,${band - 70} L955,${band - 52} L962,${band + 2} L1072,${band - 14} Z" fill="${s.shade}"/>`;
  // Body + rib band
  out += `<path d="M250,420 L440,360 Q600,${back ? 380 : 440} 760,360 L950,420 L900,720 L900,${hem} L300,${hem} L300,720 Z" fill="${s.fill}" stroke="${s.stroke}" stroke-width="3" stroke-linejoin="round"/>`;
  out += `<rect x="300" y="${hem}" width="600" height="70" fill="${s.fill}" stroke="${s.stroke}" stroke-width="3"/><rect x="300" y="${hem}" width="600" height="70" fill="${s.shade}"/>`;
  out += line('M250,420 L300,720', s.detail, 3) + line('M950,420 L900,720', s.detail, 3);
  for (let x = 320; x < 900; x += 22) out += line(`M${x},${hem + 8} L${x},${hem + 62}`, s.detail, 2);
  if (back) {
    out += `<path d="M440,360 Q430,195 600,180 Q770,195 760,360 Q785,540 600,585 Q415,540 440,360 Z" fill="${s.fill}" stroke="${s.detail}" stroke-width="4"/>`;
    out += line('M600,182 L600,585', s.detail, 3);
  } else {
    out += `<path d="M448,402 Q465,262 600,248 Q735,262 752,402 Q690,452 600,470 Q510,452 448,402 Z" fill="${s.fill}" stroke="${s.detail}" stroke-width="4" stroke-linejoin="round"/>`;
    out += `<path d="M448,402 Q465,262 600,248 Q735,262 752,402 Q690,452 600,470 Q510,452 448,402 Z" fill="${s.inner}"/>`;
    out += `<path d="M415,${hem - 250} L785,${hem - 250} L845,${hem - 18} L355,${hem - 18} Z" fill="none" stroke="${s.detail}" stroke-width="4" stroke-linejoin="round"/>`;
    if (print) out += print(s, hem);
  }
  return out;
}

function pants({ back = false, kind = 'cargo' }, s) {
  let out = `<path d="M360,250 L840,250 L845,330 L355,330 Z" fill="${s.fill}" stroke="${s.stroke}" stroke-width="3"/><path d="M360,250 L840,250 L845,330 L355,330 Z" fill="${s.shade}"/>`;
  out += `<path d="M355,330 L845,330 L915,1310 L640,1310 L600,640 L560,1310 L285,1310 Z" fill="${s.fill}" stroke="${s.stroke}" stroke-width="3" stroke-linejoin="round"/>`;
  out += line('M600,330 L600,640', s.detail, 3);
  if (kind === 'sweat') {
    out += line('M560,262 Q600,300 640,262', s.detail, 4) + line('M585,290 L575,360', s.detail, 4) + line('M615,290 L625,360', s.detail, 4);
    for (let x = 370; x < 840; x += 20) out += line(`M${x},258 L${x},322`, s.detail, 2);
  }
  if (!back) {
    out += line('M380,345 Q410,470 345,520', s.detail, 4) + line('M820,345 Q790,470 855,520', s.detail, 4);
    if (kind === 'jeans') out += line('M600,330 Q640,420 600,520', s.detail, 3);
  } else {
    out += `<rect x="410" y="420" width="140" height="150" rx="6" fill="none" stroke="${s.detail}" stroke-width="4"/><rect x="650" y="420" width="140" height="150" rx="6" fill="none" stroke="${s.detail}" stroke-width="4"/>`;
  }
  if (kind === 'cargo' || kind === 'jeans') {
    out += `<rect x="345" y="700" width="130" height="190" rx="8" fill="${s.shade}" stroke="${s.detail}" stroke-width="4"/>` + line('M345,745 L475,745', s.detail, 4);
    out += `<rect x="725" y="700" width="130" height="190" rx="8" fill="${s.shade}" stroke="${s.detail}" stroke-width="4"/>` + line('M725,745 L855,745', s.detail, 4);
  }
  out += line('M292,1270 L568,1270', s.detail, 3, 'stroke-dasharray="10 9"') + line('M632,1270 L908,1270', s.detail, 3, 'stroke-dasharray="10 9"');
  return out;
}

function beanie({ back = false }, s) {
  let out = `<path d="M370,820 Q370,420 600,395 Q830,420 830,820 Z" fill="${s.fill}" stroke="${s.stroke}" stroke-width="3"/>`;
  for (let x = 400; x < 830; x += 36) out += line(`M${x},800 Q${600 + (x - 600) * 0.55},520 600,410`, s.detail, 3);
  out += `<rect x="345" y="780" width="510" height="200" rx="26" fill="${s.fill}" stroke="${s.stroke}" stroke-width="3"/><rect x="345" y="780" width="510" height="200" rx="26" fill="${s.shade}"/>`;
  for (let x = 370; x < 840; x += 24) out += line(`M${x},796 L${x},964`, s.detail, 3);
  if (!back) out += `<rect x="535" y="846" width="130" height="66" rx="3" fill="${BONE}"/><text x="600" y="888" text-anchor="middle" font-family="Archivo Expanded Black" font-size="19" fill="${INK}">OSTREV</text>`;
  return out;
}

function tote({ back = false }, s) {
  let out = line('M455,640 L455,450 Q455,330 600,330 Q745,330 745,450 L745,640', s.fill === '#FFFFFF' ? '#D9D5CE' : s.fill, 30);
  out += `<path d="M330,620 L870,620 L885,1250 L315,1250 Z" fill="${s.fill}" stroke="${s.stroke}" stroke-width="3" stroke-linejoin="round"/>`;
  out += line('M335,665 L865,665', s.detail, 3, 'stroke-dasharray="10 9"');
  if (!back) out += `<text x="600" y="1190" text-anchor="middle" font-family="Archivo Expanded Black" font-size="30" fill="${s.ink}" opacity="0.92">OSTREV</text>`;
  return out;
}

const PRINTS = {
  logo: (s, hem = 1130) => `<text x="600" y="${hem - 470}" text-anchor="middle" font-family="Archivo Expanded Black" font-size="84" fill="${s.ink}">OSTREV</text><text x="600" y="${hem - 428}" text-anchor="middle" font-family="Inter" font-weight="700" font-size="19" letter-spacing="5" fill="${s.ink}">DROP 01 — BUILT HEAVY</text>`,
  est: (s, hem = 1040) => `<text x="600" y="${hem - 420}" text-anchor="middle" font-family="Archivo Expanded Black" font-size="70" fill="${s.ink}">OSTREV</text><text x="600" y="${hem - 382}" text-anchor="middle" font-family="Inter" font-weight="700" font-size="20" letter-spacing="8" fill="${s.ink}">EST. 2026</text>`,
  drop: (s) => `<text x="600" y="520" text-anchor="middle" font-family="Inter" font-weight="700" font-size="14" letter-spacing="7" fill="${s.ink}">OSTREV</text><text x="600" y="594" text-anchor="middle" font-family="Inter Display" font-weight="900" font-size="72" letter-spacing="-3" fill="${s.ink}">DROP 01</text><text x="600" y="624" text-anchor="middle" font-family="Inter" font-weight="600" font-size="12" letter-spacing="4" fill="${s.ink}">24.10.2026 · NO RESTOCKS</text>`,
};

/** Render one garment into an SVG of width x height, garment scaled to fit `scale` of the canvas. */
function scene({ type, opts = {}, color, bg = BONE, width = 1200, height = 1500, scale = 1, cx = 0.5, cy = 0.5 }) {
  const s = style(color, bg);
  const fn = { tee, hoodie, pants, beanie, tote }[type];
  const inner = fn(opts, s);
  const k = Math.min(width / 1200, height / 1500) * scale;
  const tx = width * cx - 600 * k, ty = height * cy - 750 * k;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="100%" height="100%" fill="${bg}"/><g transform="translate(${tx} ${ty}) scale(${k})">${inner}</g></svg>`;
}

module.exports = { scene, PRINTS, BONE, INK };

// Untranslated-text check: every Lithuanian page is compared with its English twin, and any visible line, title,
// aria-label, placeholder or alt text that is identical in both is reported. Brand names, sizes, payment methods,
// language names and cookie names are allowed. Usage: BASE_URL=http://localhost:3000 node scripts/qa/untranslated.js
const { chromium } = require('playwright');
const BASE = process.env.BASE_URL || 'http://localhost:3000';
(async () => {
  const sm = await (await fetch(BASE + '/sitemap.xml')).text();
  const lt = [...new Set([...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(/^https?:\/\/[^/]+/, '')).filter((u) => u.startsWith('/lt')))];
  lt.push('/lt/checkout', '/lt/account', '/lt/wishlist', '/lt/search?q=paltas', '/lt/nera');
  const OK = /^(OSTREV|VISA|MASTERCARD|APPLE PAY|GOOGLE PAY|PAYPAL|KLARNA|EN|LT|EUR €|XXS|XS|S|M|L|XL|XXL|ONE SIZE|hello@ostrev\.com|Instagram|TikTok|Stripe|Apple Pay|Google Pay|PayPal|Klarna|Visa, Mastercard, Amex|@OSTREV|Card|OST-|WELCOME10|EN – English|LT – Lietuvių|support@ostrev\.com|ostrev:[a-z-]+|__stripe_mid, __stripe_sid|Malta)$/i;
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.addInitScript(() => { try { localStorage.setItem('ostrev:consent', JSON.stringify({ decided: true })); localStorage.setItem('ostrev:cart', JSON.stringify({ lines: [{ key: 'a', handle: 'mom-jeans', name: 'x', url: '/shop/trousers/mom-jeans', image: '/images/mom-jeans-1.webp', color: 'mid-blue', colorName: 'x', size: 'M', price: 2999, quantity: 1, maxQuantity: 5 }] })); } catch {} });
  const p = await ctx.newPage();
  const grab = async (u) => {
    await p.goto(BASE + u, { waitUntil: 'networkidle' });
    return p.evaluate(() => [document.body.innerText, document.title,
      ...[...document.querySelectorAll('[aria-label],[title],[placeholder],img[alt]')].map((e) => e.getAttribute('aria-label') || e.getAttribute('title') || e.getAttribute('placeholder') || e.alt)]
      .join('\n').split('\n').map((l) => l.trim()).filter((l) => /[A-Za-z]{2}/.test(l)));
  };
  const hits = {};
  for (const u of lt) {
    const en = u.replace(/^\/lt/, '') || '/';
    const [a, bb] = [new Set(await grab(u)), new Set(await grab(en.replace('paltas', 'coat').replace('/nera', '/nope')))];
    for (const l of a) if (bb.has(l) && !OK.test(l) && !/^[\d\s€.,:–\-×%/()+]+$/.test(l.replace(/[A-Z]{1,3}\b/g, ''))) (hits[l] ??= []).push(u);
  }
  const rows = Object.entries(hits).sort((x, y) => y[1].length - x[1].length);
  for (const [l, us] of rows) console.log(`${us.length}x  ${l.slice(0, 110)}   [${us[0]}]`);
  console.log(`checked ${lt.length} Lithuanian pages: ${rows.length ? rows.length + ' untranslated strings' : 'NO UNTRANSLATED TEXT'}`);
  await b.close();
  if (rows.length) process.exit(1);
})();

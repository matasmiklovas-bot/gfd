// Site-wide check: every sitemap page at desktop and phone width. Reports JS errors, failed requests,
// horizontal overflow, missing h1/alt text, unnamed controls, weak meta descriptions and broken internal links.
// Usage: npm run build && npm start, then BASE_URL=http://localhost:3000 node scripts/qa/crawl.js (needs playwright).
const { chromium } = require('playwright');
const BASE = process.env.BASE_URL || 'http://localhost:3000';
(async () => {
  const sitemap = await (await fetch(BASE + '/sitemap.xml')).text();
  const pages = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(/^https?:\/\/[^/]+/, '') || '/');
  const extra = ['/search?q=coat', '/wishlist', '/account', '/checkout', '/help', '/legal', '/does-not-exist'];
  pages.push(...extra, ...extra.map((u) => '/lt' + u.replace('coat', 'paltas')));
  // The 404 probe is expected to 404, and its language switch links to the other locale's 404.
  const probe = (u) => u.endsWith('/does-not-exist');
  const b = await chromium.launch();
  const issues = [];
  const links = new Set();
  for (const [w, h] of [[1440, 900], [390, 844]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h } });
    await ctx.addInitScript(() => { try { localStorage.setItem('ostrev:consent', JSON.stringify({ decided: true, analytics: false, marketing: false })); } catch {} });
    const p = await ctx.newPage();
    let cur = '';
    p.on('pageerror', (e) => issues.push(`[${w}] ${cur} pageerror: ${e.message}`));
    p.on('console', (m) => { if (m.type() === 'error' && !/404 \(Not Found\)/.test(m.text())) issues.push(`[${w}] ${cur} console: ${m.text().slice(0, 200)}`); });
    p.on('response', (r) => { if (r.status() >= 400 && !probe(r.url())) issues.push(`[${w}] ${cur} HTTP ${r.status()} ${r.url()}`); });
    for (const path of pages) {
      cur = path;
      await p.goto(BASE + path, { waitUntil: 'networkidle' });
      const r = await p.evaluate(() => {
        const out = {};
        out.overflow = document.documentElement.scrollWidth - window.innerWidth;
        out.h1 = document.querySelectorAll('h1').length;
        out.noAlt = [...document.querySelectorAll('img')].filter((i) => !i.hasAttribute('alt')).map((i) => i.src).slice(0, 3);
        const name = (el) => (el.getAttribute('aria-label') || el.getAttribute('title') || el.textContent || '').trim() || [...el.querySelectorAll('img')].map((i) => i.alt).join('').trim() || (el.getAttribute('aria-labelledby') ? 'lb' : '');
        out.unnamed = [...document.querySelectorAll('a[href], button')].filter((el) => el.offsetParent !== null && !el.closest('[aria-hidden="true"]') && !name(el)).map((el) => el.outerHTML.slice(0, 120)).slice(0, 3);
        out.links = [...document.querySelectorAll('a[href]')].map((a) => a.getAttribute('href')).filter((h) => h.startsWith('/'));
        out.title = document.title;
        out.desc = document.querySelector('meta[name="description"]')?.content || '';
        return out;
      });
      r.links.forEach((l) => links.add(l.split('#')[0]));
      if (r.overflow > 0) issues.push(`[${w}] ${path} horizontal overflow ${r.overflow}px`);
      if (r.h1 !== 1 && !probe(path)) issues.push(`[${w}] ${path} has ${r.h1} h1`);
      if (r.noAlt.length) issues.push(`[${w}] ${path} img without alt: ${r.noAlt}`);
      if (r.unnamed.length) issues.push(`[${w}] ${path} unnamed controls: ${r.unnamed.join(' | ')}`);
      if (w === 1440 && (!r.desc || r.desc.length < 50)) issues.push(`${path} weak meta description (${r.desc.length})`);
    }
    await ctx.close();
  }
  for (const l of links) {
    if (probe(l)) continue;
    const res = await fetch(BASE + l, { redirect: 'manual' });
    if (res.status >= 400) issues.push(`broken link ${l} -> ${res.status}`);
  }
  console.log(`checked ${pages.length} pages x2 widths, ${links.size} unique internal links`);
  console.log(issues.length ? [...new Set(issues)].join('\n') : 'NO ISSUES');
  await b.close();
})();

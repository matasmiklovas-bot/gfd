// End-to-end purchase in demo mode, desktop and phone: menu → product → size → bag → checkout validation →
// WELCOME10 → order confirmation. Usage: BASE_URL=http://localhost:3000 node scripts/qa/checkout.js (needs playwright).
const { chromium } = require('playwright');
const BASE = process.env.BASE_URL || 'http://localhost:3000';
const step = (s) => console.log('✓', s);
(async () => {
  const b = await chromium.launch();
  for (const [w, h, label] of [[1440, 900, 'desktop'], [390, 844, 'phone']]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h } });
    const p = await ctx.newPage();
    const errs = []; p.on('pageerror', (e) => errs.push(e.message));
    console.log(`--- ${label}`);
    await p.goto(BASE + '/', { waitUntil: 'networkidle' });
    // cookie banner
    const accept = p.getByRole('button', { name: 'Accept' });
    if (await accept.isVisible()) { await accept.click(); step('cookie banner accepted'); }
    // navigate via menu
    if (label === 'phone') {
      await p.click('[aria-controls="mobile-menu"]');
      await p.locator('#mobile-menu').getByRole('link', { name: 'Knitwear' }).first().click();
    } else {
      await p.hover('header nav a[href="/women"]');
      await p.locator('header').getByRole('link', { name: 'Knitwear' }).first().click();
    }
    await p.waitForURL('**/women/knitwear'); step('menu → /women/knitwear');
    await p.locator('main a[href^="/shop/knitwear/"]').first().click();
    await p.waitForURL('**/shop/knitwear/**'); step('opened product ' + p.url().split('/').pop());
    // add without size → error
    const addBtn = p.locator('button:visible', { hasText: /Add to bag/ }).first();
    await addBtn.click();
    const err = await p.getByText('Select a size').first().isVisible();
    if (!err) throw new Error('no size error shown'); step('size required message');
    await p.locator('button[aria-disabled="false"][aria-pressed]').filter({ hasText: /^(S|M|L)$/ }).first().click();
    await addBtn.click();
    await p.waitForSelector('#cart-drawer[role="dialog"]', { state: 'visible' }).catch(() => {});
    await p.locator('#cart-drawer').getByText(/Subtotal/i).waitFor({ timeout: 5000 }).catch(() => {});
    const drawerText = await p.locator('#cart-drawer').innerText();
    if (!/Subtotal|Tarpinė/i.test(drawerText)) { await p.screenshot({ path: 'qa-failure.png' }); console.log('DRAWER:', drawerText.slice(0, 300)); throw new Error('cart drawer missing subtotal'); } step('added to bag, drawer open');
    await p.locator('#cart-drawer').getByRole('link', { name: /Checkout/ }).click();
    await p.waitForURL('**/checkout'); step('checkout page');
    // submit empty to see validation
    await p.getByRole('button', { name: /Pay|Place order|Complete/ }).last().click();
    await p.waitForTimeout(300);
    const invalid = await p.locator('[aria-invalid="true"]').count();
    if (!invalid) throw new Error('no validation errors'); step(`validation shows ${invalid} errors`);
    await p.fill('[name="email"]', 'test@example.com');
    await p.selectOption('[name="country"]', 'LT');
    await p.fill('[name="firstName"]', 'Test');
    await p.fill('[name="lastName"]', 'Buyer');
    await p.fill('[name="line1"]', 'Gedimino pr. 1');
    await p.fill('[name="postalCode"]', 'LT-01103');
    await p.fill('[name="city"]', 'Vilnius');
    // discount code
    if (label === 'phone') await p.click('[aria-controls="mobile-summary"]');
    const code = p.locator('input[autocomplete="off"]:visible').first();
    await code.fill('WELCOME10');
    await p.locator('button:visible', { hasText: /Apply/ }).first().click();
    await p.waitForTimeout(800);
    const applied = /WELCOME10/.test(await p.locator('body').innerText()); step('discount code ' + (applied ? 'applied' : 'NOT applied'));
    await p.getByRole('button', { name: /Pay|Place order|Complete/ }).last().click();
    await p.waitForURL('**/checkout/success**', { timeout: 15000 }); step('demo order → success page');
    const successText = (await p.locator('main').innerText()).slice(0, 160).replace(/\s+/g, ' ');
    console.log('  success says:', successText);
    if (errs.length) console.log('  page errors:', errs);
    await ctx.close();
  }
  await b.close();
})().catch((e) => { console.error('✗ FAIL:', e.message); process.exit(1); });

# OSTREV — storefront

Women’s and men’s fashion store for [ostrev.com](https://ostrev.com), in the style of Bershka / Mango. Next.js 15 (App Router) + TypeScript + Tailwind CSS.
Mobile-first, statically generated, no UI or state libraries.

```bash
npm install
cp .env.example .env.local   # optional — everything runs without keys
npm run dev                  # http://localhost:3000
npm run build && npm start   # production
npm run lint && npm run typecheck
```

Node 20+ required.

---

## What is real and what is not

Read this before launch.

| Area | Status |
| --- | --- |
| Catalog, collections, filters, sorting, search, product pages | Done. Static pages generated from `data/products.json`. |
| Cart (persisted), wishlist, free-shipping bar, quantity limits | Done. Stored in the browser (`localStorage`). |
| Checkout validation | Done on the server: prices, stock, discount codes and addresses are re-checked in `/api/checkout`. The client is never trusted. |
| Payments | **Needs keys.** With `STRIPE_SECRET_KEY` set, checkout creates a Stripe Checkout session (card, Apple Pay, Google Pay, PayPal, Klarna). Without it, checkout runs in **demo mode**: the order "succeeds" and no money moves. |
| Order fulfilment | **Not built.** `/api/stripe/webhook` verifies payments and logs them. Creating the order in an OMS/Shopify, decrementing stock and sending confirmation emails are a `TODO` in that file. |
| Stock | **Static.** Stock comes from the JSON file at build time. Nothing decrements it after a sale, and there is no reservation during checkout. Two people can buy the last unit. Fix: Shopify inventory or a database. |
| Customer accounts | **Device-local.** "Sign in" stores name/email, addresses and order history in `localStorage`. There is no password, no server-side account, and nothing syncs across devices. Replace with Shopify Customer Accounts or real auth before you call it an account. |
| Newsletter / drop alerts / contact form | Validated server-side, then POSTed as JSON to `NEWSLETTER_WEBHOOK_URL` / `CONTACT_WEBHOOK_URL` (Klaviyo, Mailchimp, Zapier, Make…). Without a URL they are only logged. No double opt-in yet. |
| Discount codes | `WELCOME10` (10%) in `src/lib/discounts.ts`, server-only. Unlimited use, no per-customer limit. The newsletter success message shows the same code to everyone. |
| Baltic bank links (Swedbank, SEB, Luminor, Citadele) | **Not included.** Stripe does not offer them. You need Montonio, Paysera or MakeCommerce alongside Stripe. |
| Language | EN/LT switch translates interface strings only (nav, buttons, cart, cookie banner). Product copy, help and legal pages are English. Full LT needs `/lt/...` routes and translated content. |
| Currency | EUR only. The footer shows "EUR €" as a label, not a selector. |
| Analytics / pixels | None installed. The cookie banner stores consent (`consentStore`); check it before loading any tracking script. |
| Rate limiting | None on the API routes. The forms have a honeypot only. Add rate limiting (Vercel WAF, Upstash) before launch. |
| Images | **Stock placeholders — not your products.** Every product and lifestyle photo is a free Pexels stock photo (sources below), cropped to 4:5. The clothes in them belong to the photographers' shoots, not to OSTREV. Before launch, replace every product photo with your own photography of the real garment (4:5, at least 1600×2000 px). Selling a product with a photo of a different garment misleads customers and breaks EU consumer law. |
| Copy | Brand story, product descriptions, size tables, dispatch cut-off (14:00) and delivery times are realistic placeholders. Confirm each with operations. |
| Legal pages | Written to match how this code works, under EU/Lithuanian consumer law and GDPR. **They are templates. Have a lawyer review them**, and fill in company code and VAT number in `src/lib/site.ts`. |

---

## Structure

```
data/products.json          ← the catalog. Edit this to change products.
public/images/              ← optimised WebP masters (Next serves AVIF/WebP per device)
src/
  app/                      ← routes (App Router)
    shop/[category]/[slug]  ← clean URLs: /shop/coats/oversized-trench-coat
    api/checkout            ← server-side order validation + Stripe session
    api/stripe/webhook      ← payment confirmation (fulfilment TODO)
    api/subscribe, contact, discount
  components/
    layout/                 ← header, announcement bar, menu, search, cart drawer, footer, cookie banner
    product/                ← card, slider, gallery, detail, filters, size guide
    home/ checkout/ account/ forms/ content/ ui/
  lib/
    commerce/               ← catalog access layer (swap for Shopify here)
    store.ts                ← client state: cart, wishlist, account, consent, prefs
    pricing.ts              ← shipping + totals (shared by client and server)
    discounts.ts            ← discount codes (server only)
    site.ts                 ← brand config: announcements, nav, next drop date, company details
    sizeGuide.ts            ← size tables (cm)
    i18n.ts                 ← EN/LT interface strings
```

### Editing products

Each product in `data/products.json` has `handle` (URL slug), `gender` (`women | men`), `category` (`coats | knitwear | shirts | dresses | trousers | accessories`),
`price` in **cents** (`3999` = €39.99, VAT included), `colors`, `sizes`, `stock[colorSlug][size]`, `images` (4:5),
`isNew` and `related` handles for "Complete the look". A product with all stock at `0` shows as **Sold out**. Stock
under 5 shows "Only N left".

The catalog is validated at build time (`src/lib/commerce/local.ts`): a typo such as an unknown colour in `stock` or a
missing related handle fails the build with a readable message instead of breaking a page.

### Women / Men

`/women` and `/men` list products by `gender`. `/women/[category]` and `/men/[category]` (for example `/women/dresses`)
are generated for every category that has products for that gender, with a category nav above the grid. The header
dropdown and the mobile menu read their links from `MENU` in `src/lib/site.ts`; the build fails if `MENU` points at a
category with no products. `/shop/[category]` mixes both genders and offers a Women / Men filter. Product breadcrumbs
link to the gender category. Old streetwear URLs (`/drops`, `/shop/hoodies|tees|pants/...`) redirect in
`next.config.mjs`.

Product pages show "Complete the look" (`related` in the JSON), "You may also like" (same gender and category) and
"Recently viewed" (handles stored in this browser's `localStorage`). Search matches synonyms and common Lithuanian
words (`src/lib/search.ts`).

---

## Design system

Defined once in `tailwind.config.ts` and `src/app/globals.css`.

- **Colours:** `ink #0A0A0A`, `white`, `bone #F4F2EE`, `concrete #8A8A8A` (accent), `muted #5E5E5E`, `line #E2E0DB`.
  `concrete` is 3.4:1 on white, which fails WCAG AA for small text. It is used for borders, disabled states and large
  text only. Small secondary text uses `muted` (6.5:1).
- **Type:** Archivo variable (width + weight axes) for headings, uppercase with tight tracking; Inter for body. Both
  self-hosted via Fontsource, with no third-party font requests. Scale: `text-display` (48–140px), `text-h1`, `text-h2`,
  `label` (11px uppercase, 0.14em tracking).
- **Components:** `.btn-primary`, `.btn-secondary`, `.btn-inverse`, `.input`, `.field-label`, `.label`,
  `.heading-display/1/2`, `.container-site`, `.section`. Radius 0 (2px max), no shadows, no gradients.
- **Motion:** fade-up on scroll (`<Reveal>`), second-image swap on product hover (desktop), drawer slides. All disabled
  under `prefers-reduced-motion`.

## Accessibility

Skip link, visible focus outline everywhere, focus trapped in drawers/menus with Escape to close and focus returned to
the trigger, native `<dialog>` for the size guide, `<details>` accordions, labelled form fields with inline errors,
sold-out sizes announced as "M, sold out", 44px+ touch targets. Lighthouse accessibility: 100 on tested pages.

## Performance

Lighthouse 12, mobile, simulated throttling, against `next start` on a cloud container (October 2026): performance
**90–97** on home, women, men/coats, a product page, checkout and about; accessibility **100**; best practices **100**;
SEO **100** (checkout scores 63 on purpose: it is `noindex`). LCP is 1.7–3.1 s; the slower numbers come from Next
generating AVIF variants on the first request, which a CDN caches. Re-measure on your real host.

## Checks

```bash
npm run build && npm start               # in one terminal
BASE_URL=http://localhost:3000 npm run qa:crawl     # every sitemap page at 1440px and 390px
BASE_URL=http://localhost:3000 npm run qa:checkout  # demo purchase end to end, desktop and phone
```

Both need Playwright (`npm i -D playwright && npx playwright install chromium`). The crawl reports JavaScript errors,
failed requests, horizontal overflow, pages without exactly one `h1`, images without `alt`, unnamed buttons and links,
short meta descriptions and broken internal links. The checkout test goes menu → product → size → bag → checkout
validation → `WELCOME10` → confirmation. Last run: 73 pages, no issues; checkout passes on both widths.

## SEO

Per-page titles and descriptions, canonical URLs, Open Graph image (`public/og.jpg`, product images on product pages),
`sitemap.xml`, `robots.txt` (checkout/account/search excluded), JSON-LD: `Organization`, `WebSite` + `SearchAction`,
`BreadcrumbList`, `ProductGroup` with per-variant `Offer` (price, availability, shipping, return policy), `FAQPage`.

---

## Payments setup (Stripe)

1. Create a Stripe account for the Lithuanian entity. Add `STRIPE_SECRET_KEY` to the environment.
2. In Dashboard → Settings → Payment methods, enable Cards, Apple Pay, Google Pay, PayPal and Klarna. A method missing
   there makes checkout fail when a customer picks it.
3. Add a webhook to `https://ostrev.com/api/stripe/webhook` for `checkout.session.completed`,
   `checkout.session.async_payment_succeeded` and `checkout.session.async_payment_failed`; set `STRIPE_WEBHOOK_SECRET`.
4. Implement fulfilment in the webhook (see the `TODO`). Make it idempotent, because Stripe retries.
5. Prices are sent as VAT-inclusive. If you sell above the EU distance-selling threshold (€10,000/year cross-border),
   you owe destination-country VAT: configure Stripe Tax or OSS reporting.

## Moving to Shopify (headless)

All catalog reads go through `src/lib/commerce/index.ts`. To switch:

1. Write `src/lib/commerce/shopify.ts` exporting the same functions (`getAllProducts`, `getProductByHandle`,
   `getProductsByCategory`, `getStock`) using the Storefront API, mapping Shopify products/variants to the `Product` type
   (variants → `stock[color][size]`, collections → `category`).
2. Change the import in `index.ts`. Pages stay the same. Add `export const revalidate = 60` (or webhook-triggered
   revalidation) on shop and product routes so stock stays fresh.
3. Replace `/api/checkout` with a Storefront `cartCreate` + redirect to `checkoutUrl`, or keep Stripe and create orders
   via the Admin API from the webhook.
4. Replace the local account with Shopify Customer Accounts.

## Launch checklist

- [ ] Real product photography and copy; confirm fabric weights, size tables, dispatch cut-off.
- [ ] Company code and VAT number in `src/lib/site.ts`; lawyer review of privacy, terms, cookies, returns.
- [ ] Stripe keys, payment methods enabled, webhook + fulfilment implemented and tested end to end.
- [ ] Inventory source of truth (Shopify or DB) so stock decrements and the last unit can't be sold twice.
- [ ] Email provider connected; double opt-in for the newsletter; order confirmation emails.
- [ ] Real customer accounts, or remove the account page.
- [ ] Rate limiting on `/api/*`.
- [ ] Check that `@ostrev` exists on Instagram/TikTok and update the links in `src/lib/site.ts`.
- [ ] Re-run Lighthouse on the production domain.

## Images

Placeholder photography from Pexels ([Pexels License](https://www.pexels.com/license/): free for commercial use,
attribution not required; you may not imply that the people shown endorse OSTREV, and you may not resell the photos
unaltered). Cropped to 4:5 (products), 7:10 (hero), 16:10 (editorial) or square (social). No other edits.

**These are placeholders.** Replace every product photo with photography of your actual garments before launch.

| File (`public/images/`) | Source |
| --- | --- |
| `oversized-trench-coat-1.webp` | https://www.pexels.com/photo/7760016/ |
| `oversized-trench-coat-2.webp` | https://www.pexels.com/photo/7760024/ |
| `oversized-trench-coat-3.webp` | https://www.pexels.com/photo/7760027/ |
| `oversized-trench-coat-4.webp` | https://www.pexels.com/photo/7760019/ |
| `wool-blend-coat-1.webp` | https://www.pexels.com/photo/7760238/ |
| `wool-blend-coat-2.webp` | https://www.pexels.com/photo/7760241/ |
| `oversized-blazer-1.webp` | https://www.pexels.com/photo/7760002/ |
| `oversized-blazer-2.webp` | https://www.pexels.com/photo/7760003/ |
| `oversized-blazer-3.webp` | https://www.pexels.com/photo/7760001/ |
| `faux-leather-biker-jacket-1.webp` | https://www.pexels.com/photo/15161528/ |
| `faux-leather-biker-jacket-2.webp` | https://www.pexels.com/photo/15161530/ |
| `chunky-turtleneck-jumper-1.webp` | https://www.pexels.com/photo/7760008/ |
| `chunky-turtleneck-jumper-2.webp` | https://www.pexels.com/photo/7760011/ |
| `chunky-turtleneck-jumper-3.webp` | https://www.pexels.com/photo/7760010/ |
| `soft-knit-jumper-1.webp` | https://www.pexels.com/photo/7760234/ |
| `soft-knit-jumper-2.webp` | https://www.pexels.com/photo/7760239/ |
| `soft-knit-jumper-3.webp` | https://www.pexels.com/photo/7760229/ |
| `soft-knit-jumper-4.webp` | https://www.pexels.com/photo/7760231/ |
| `chunky-rib-jumper-1.webp` | https://www.pexels.com/photo/6630845/ |
| `chunky-rib-jumper-2.webp` | https://www.pexels.com/photo/6630851/ |
| `chunky-rib-jumper-3.webp` | https://www.pexels.com/photo/6630853/ |
| `satin-shirt-dress-1.webp` | https://www.pexels.com/photo/7760031/ |
| `satin-shirt-dress-2.webp` | https://www.pexels.com/photo/7760034/ |
| `satin-shirt-dress-3.webp` | https://www.pexels.com/photo/7760030/ |
| `oversized-poplin-shirt-1.webp` | https://www.pexels.com/photo/34977351/ |
| `oversized-poplin-shirt-2.webp` | https://www.pexels.com/photo/34977354/ |
| `oversized-poplin-shirt-3.webp` | https://www.pexels.com/photo/34977347/ |
| `wide-leg-jeans-1.webp` | https://www.pexels.com/photo/34977353/ |
| `wide-leg-jeans-2.webp` | https://www.pexels.com/photo/34977348/ |
| `wide-leg-jeans-3.webp` | https://www.pexels.com/photo/34977352/ |
| `mom-jeans-1.webp` | https://www.pexels.com/photo/6769359/ |
| `mom-jeans-2.webp` | https://www.pexels.com/photo/6769361/ |
| `mom-jeans-3.webp` | https://www.pexels.com/photo/6769360/ |
| `straight-white-jeans-1.webp` | https://www.pexels.com/photo/7760230/ |
| `straight-white-jeans-2.webp` | https://www.pexels.com/photo/7760232/ |
| `leather-shoulder-bag-1.webp` | https://www.pexels.com/photo/13055401/ |
| `faux-shearling-coat-1.webp` | https://www.pexels.com/photo/9327147/ |
| `faux-shearling-coat-2.webp` | https://www.pexels.com/photo/9327148/ |
| `printed-denim-jacket-1.webp` | https://www.pexels.com/photo/34977380/ |
| `printed-denim-jacket-2.webp` | https://www.pexels.com/photo/34977382/ |
| `printed-denim-jacket-3.webp` | https://www.pexels.com/photo/34977385/ |
| `poplin-midi-dress-1.webp` | https://www.pexels.com/photo/13816060/ |
| `poplin-midi-dress-2.webp` | https://www.pexels.com/photo/13816063/ |
| `poplin-midi-dress-3.webp` | https://www.pexels.com/photo/13816066/ |
| `cropped-shirt-1.webp` | https://www.pexels.com/photo/19456439/ |
| `cropped-shirt-2.webp` | https://www.pexels.com/photo/19456440/ |
| `cropped-shirt-3.webp` | https://www.pexels.com/photo/19456446/ |
| `open-back-bodysuit-1.webp` | https://www.pexels.com/photo/34977336/ |
| `open-back-bodysuit-2.webp` | https://www.pexels.com/photo/34977333/ |
| `open-back-bodysuit-3.webp` | https://www.pexels.com/photo/34977335/ |
| `flared-trousers-1.webp` | https://www.pexels.com/photo/34977323/ |
| `flared-trousers-2.webp` | https://www.pexels.com/photo/34977341/ |
| `flared-trousers-3.webp` | https://www.pexels.com/photo/34977332/ |
| `pleated-trousers-1.webp` | https://www.pexels.com/photo/19456444/ |
| `pleated-trousers-2.webp` | https://www.pexels.com/photo/19456438/ |
| `pleated-trousers-3.webp` | https://www.pexels.com/photo/19456441/ |
| `buckle-baguette-bag-1.webp` | https://www.pexels.com/photo/20591023/ |
| `quilted-chain-bag-1.webp` | https://www.pexels.com/photo/20591024/ |
| `quilted-chain-bag-2.webp` | https://www.pexels.com/photo/20591025/ |
| `oversized-denim-jacket-1.webp` | https://www.pexels.com/photo/6769357/ |
| `oversized-denim-jacket-2.webp` | https://www.pexels.com/photo/6769366/ |
| `oversized-denim-jacket-3.webp` | https://www.pexels.com/photo/6769363/ |
| `puffer-jacket-1.webp` | https://www.pexels.com/photo/6626747/ |
| `puffer-jacket-2.webp` | https://www.pexels.com/photo/6626753/ |
| `puffer-jacket-3.webp` | https://www.pexels.com/photo/6626749/ |
| `corduroy-overshirt-1.webp` | https://www.pexels.com/photo/6626752/ |
| `corduroy-overshirt-2.webp` | https://www.pexels.com/photo/6626750/ |
| `corduroy-overshirt-3.webp` | https://www.pexels.com/photo/6626756/ |
| `oversized-cotton-t-shirt-1.webp` | https://www.pexels.com/photo/9775480/ |
| `oversized-cotton-t-shirt-2.webp` | https://www.pexels.com/photo/9775493/ |
| `crew-neck-jumper-1.webp` | https://www.pexels.com/photo/13917251/ |
| `crew-neck-jumper-2.webp` | https://www.pexels.com/photo/13917246/ |
| `crew-neck-jumper-3.webp` | https://www.pexels.com/photo/13917255/ |
| `fine-knit-jumper-1.webp` | https://www.pexels.com/photo/28888095/ |
| `fine-knit-jumper-2.webp` | https://www.pexels.com/photo/28888097/ |
| `fine-knit-jumper-3.webp` | https://www.pexels.com/photo/28888096/ |
| `baggy-jeans-1.webp` | https://www.pexels.com/photo/24779116/ |
| `baggy-jeans-2.webp` | https://www.pexels.com/photo/24779113/ |
| `baggy-jeans-3.webp` | https://www.pexels.com/photo/24779115/ |
| `relaxed-straight-jeans-1.webp` | https://www.pexels.com/photo/9775494/ |
| `relaxed-straight-jeans-2.webp` | https://www.pexels.com/photo/9775484/ |
| `cord-trousers-1.webp` | https://www.pexels.com/photo/6626754/ |
| `cord-trousers-2.webp` | https://www.pexels.com/photo/6626745/ |
| `linen-blend-blazer-1.webp` | https://www.pexels.com/photo/16825859/ |
| `linen-blend-blazer-2.webp` | https://www.pexels.com/photo/16825852/ |
| `linen-blend-blazer-3.webp` | https://www.pexels.com/photo/16825860/ |
| `wool-blend-blazer-1.webp` | https://www.pexels.com/photo/16825857/ |
| `wool-blend-blazer-2.webp` | https://www.pexels.com/photo/16825858/ |
| `oxford-shirt-1.webp` | https://www.pexels.com/photo/16825854/ |
| `oxford-shirt-2.webp` | https://www.pexels.com/photo/16825851/ |
| `roll-neck-jumper-1.webp` | https://www.pexels.com/photo/20359830/ |
| `roll-neck-jumper-2.webp` | https://www.pexels.com/photo/20359839/ |
| `roll-neck-jumper-3.webp` | https://www.pexels.com/photo/20359831/ |
| `cotton-trench-coat-1.webp` | https://www.pexels.com/photo/10153584/ |
| `hero-women.webp` | https://www.pexels.com/photo/7760017/ |
| `hero-men.webp` | https://www.pexels.com/photo/6626747/ |
| `cat-coats.webp` | https://www.pexels.com/photo/7760014/ |
| `cat-knitwear.webp` | https://www.pexels.com/photo/7760009/ |
| `cat-tops.webp` | https://www.pexels.com/photo/34977355/ |
| `cat-jeans.webp` | https://www.pexels.com/photo/24779114/ |
| `editorial.webp` | https://www.pexels.com/photo/7760005/ |
| `lookbook.webp` | https://www.pexels.com/photo/6769355/ |
| `social-1.webp` | https://www.pexels.com/photo/7760018/ |
| `social-2.webp` | https://www.pexels.com/photo/7760026/ |
| `social-3.webp` | https://www.pexels.com/photo/6769362/ |
| `social-4.webp` | https://www.pexels.com/photo/34977350/ |
| `social-5.webp` | https://www.pexels.com/photo/6626756/ |
| `social-6.webp` | https://www.pexels.com/photo/13917244/ |
| `about-1.webp` | https://www.pexels.com/photo/7760028/ |
| `about-2.webp` | https://www.pexels.com/photo/6769353/ |
| `about-3.webp` | https://www.pexels.com/photo/7760240/ |
| `../og.jpg` | https://www.pexels.com/photo/7760005/ |

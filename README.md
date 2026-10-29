# OSTREV — storefront

Minimalist streetwear store for [ostrev.com](https://ostrev.com). Next.js 15 (App Router) + TypeScript + Tailwind CSS.
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
| Photos | **Stock placeholders.** Mostly one Pexels studio shoot (Monstera Production) with blank garments, so the catalog looks consistent. They are not OSTREV products: the Drop 01 print on the graphic tee is composited onto a blank tee, and several products were renamed to match the available photos (Boxy Hoodie, Relaxed Hoodie, Lounge Pants, Boxy Tee). Replace with your own shoot (4:5, at least 1600×2000 px) before launch. |
| Copy | Brand story, product descriptions, size tables, dispatch cut-off (14:00) and delivery times are realistic placeholders. Confirm each with operations. |
| Legal pages | Written to match how this code works, under EU/Lithuanian consumer law and GDPR. **They are templates. Have a lawyer review them**, and fill in company code and VAT number in `src/lib/site.ts`. |

---

## Structure

```
data/products.json          ← the catalog. Edit this to change products.
public/images/              ← optimised WebP masters (Next serves AVIF/WebP per device)
src/
  app/                      ← routes (App Router)
    shop/[category]/[slug]  ← clean URLs: /shop/hoodies/heavyweight-oversized-hoodie
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

Each product in `data/products.json` has `handle` (URL slug), `category` (`hoodies | tees | pants | accessories`),
`price` in **cents** (`3999` = €39.99, VAT included), `colors`, `sizes`, `stock[colorSlug][size]`, `images` (4:5),
`isNew` and `related` handles for "Complete the look". A product with all stock at `0` shows as **Sold out**. Stock
under 5 shows "Only N left".

The catalog is validated at build time (`src/lib/commerce/local.ts`): a typo such as an unknown colour in `stock` or a
missing related handle fails the build with a readable message instead of breaking a page.

### Next drop

Change `NEXT_DROP` in `src/lib/site.ts`. The countdown switches to "Drop 02 — out now." when the date passes.

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

Measured with Lighthouse 12 (mobile, simulated throttling) against `next start` on a cloud container: **95–99** on
home, shop, product and FAQ once warm. The very first cold hit scored 74, because Next generates AVIF variants on first
request. On Vercel the image CDN caches them after the first visit. Shared JS is ~103 kB gzipped (mostly React/Next).
Re-measure on your real host; container numbers are not production numbers.

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

## Image sources

Placeholder photography from Pexels ([Pexels License](https://www.pexels.com/license/): free to use, attribution not required), cropped and colour-graded. Most come from one studio shoot by Monstera Production. The graphic on `graphic-tee-1.webp` is composited. Replace before launch.

| File | Source |
| --- | --- |
| `about-1.webp` | https://www.pexels.com/photo/6311606/ |
| `about-2.webp` | https://www.pexels.com/photo/6311691/ |
| `about-3.webp` | https://www.pexels.com/photo/6311272/ |
| `beanie-1.webp` | https://www.pexels.com/photo/33091835/ |
| `blank-tee-1.webp` | https://www.pexels.com/photo/6311251/ |
| `blank-tee-2.webp` | https://www.pexels.com/photo/6311252/ |
| `blank-tee-grey-1.webp` | https://www.pexels.com/photo/6311588/ |
| `blank-tee-grey-2.webp` | https://www.pexels.com/photo/6311579/ |
| `boxy-1.webp` | https://www.pexels.com/photo/6311613/ |
| `boxy-2.webp` | https://www.pexels.com/photo/6311642/ |
| `boxy-black-1.webp` | https://www.pexels.com/photo/6311272/ |
| `boxy-tee-1.webp` | https://www.pexels.com/photo/6311577/ |
| `boxy-tee-2.webp` | https://www.pexels.com/photo/6311575/ |
| `boxy-tee-concrete-1.webp` | https://www.pexels.com/photo/6311583/ |
| `cargo-1.webp` | https://www.pexels.com/photo/19461549/ |
| `cargo-2.webp` | https://www.pexels.com/photo/19461553/ |
| `cat-hoodies.webp` | https://www.pexels.com/photo/6311503/ |
| `cat-pants.webp` | https://www.pexels.com/photo/19461549/ |
| `cat-tees.webp` | https://www.pexels.com/photo/6311588/ |
| `editorial.webp` | https://www.pexels.com/photo/6311678/ |
| `graphic-tee-1.webp` | https://www.pexels.com/photo/8532616/ |
| `hero-mobile.webp` | https://www.pexels.com/photo/6311606/ |
| `hoodie-1.webp` | https://www.pexels.com/photo/6311502/ |
| `hoodie-2.webp` | https://www.pexels.com/photo/6311506/ |
| `hoodie-grey-1.webp` | https://www.pexels.com/photo/6311719/ |
| `hoodie-offwhite-1.webp` | https://www.pexels.com/photo/6311503/ |
| `hoodie-offwhite-2.webp` | https://www.pexels.com/photo/6311449/ |
| `logo-tee-1.webp` | https://www.pexels.com/photo/9558707/ |
| `logo-tee-2.webp` | https://www.pexels.com/photo/9558898/ |
| `longsleeve-1.webp` | https://www.pexels.com/photo/6311446/ |
| `longsleeve-2.webp` | https://www.pexels.com/photo/6311442/ |
| `lounge-1.webp` | https://www.pexels.com/photo/6311480/ |
| `lounge-2.webp` | https://www.pexels.com/photo/6311605/ |
| `relaxed-1.webp` | https://www.pexels.com/photo/6311600/ |
| `relaxed-2.webp` | https://www.pexels.com/photo/6311670/ |
| `relaxed-offwhite-1.webp` | https://www.pexels.com/photo/6311586/ |
| `relaxed-offwhite-2.webp` | https://www.pexels.com/photo/6311691/ |
| `social-1.webp` | https://www.pexels.com/photo/6311721/ |
| `social-2.webp` | https://www.pexels.com/photo/6311691/ |
| `social-3.webp` | https://www.pexels.com/photo/6311332/ |
| `social-4.webp` | https://www.pexels.com/photo/6311586/ |
| `social-5.webp` | https://www.pexels.com/photo/6311605/ |
| `social-6.webp` | https://www.pexels.com/photo/6311272/ |
| `sweatpants-1.webp` | https://www.pexels.com/photo/6311511/ |
| `sweatpants-2.webp` | https://www.pexels.com/photo/6311663/ |
| `sweatpants-grey-2.webp` | https://www.pexels.com/photo/6311647/ |
| `sweatpants-offwhite-2.webp` | https://www.pexels.com/photo/6311503/ |
| `tote-1.webp` | https://www.pexels.com/photo/8148587/ |

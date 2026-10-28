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
| Photos | **Placeholders.** Unsplash photos graded to monochrome. They do not show the actual products (the "cargo pants" photo is chinos, the "tote" is a generic bag). Replace with real product shots (4:5, at least 1600×2000 px). |
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

Placeholder photography from Unsplash ([Unsplash License](https://unsplash.com/license)), converted to grayscale and
cropped. Replace before launch.

| File | Source |
| --- | --- |
| `hoodie-1.webp` | https://images.unsplash.com/photo-1556821840-3a63f95609a7 |
| `hoodie-2.webp` | https://images.unsplash.com/photo-1572495641004-28421ae52e52 |
| `zip-1.webp` | https://images.unsplash.com/photo-1517841905240-472988babdf9 |
| `zip-2.webp` | https://images.unsplash.com/photo-1548126032-079a0fb0099d |
| `logo-tee-1.webp` | https://images.unsplash.com/photo-1618354691373-d851c5c3a990 |
| `logo-tee-2.webp` | https://images.unsplash.com/photo-1618517351616-38fb9c5210c6 |
| `blank-tee-1.webp` | https://images.unsplash.com/photo-1581655353564-df123a1eb820 |
| `blank-tee-2.webp` | https://images.unsplash.com/photo-1521572163474-6864f9cf17ab |
| `graphic-tee-1.webp` | https://images.unsplash.com/photo-1503341504253-dff4815485f1 |
| `graphic-tee-2.webp` | https://images.unsplash.com/photo-1622519407650-3df9883f76a5 |
| `cargo-1.webp` | https://images.unsplash.com/photo-1544441893-675973e31985 |
| `cargo-2.webp` | https://images.unsplash.com/photo-1473966968600-fa801b869a1a |
| `sweatpants-1.webp` | https://images.unsplash.com/photo-1506629082955-511b1aa562c8 |
| `sweatpants-2.webp` | https://images.unsplash.com/photo-1515886657613-9f3515b0c78f |
| `beanie-1.webp` | https://images.unsplash.com/photo-1510598969022-c4c6c5d05769 |
| `beanie-2.webp` | https://images.unsplash.com/photo-1608063615781-e2ef8c73d114 |
| `tote-1.webp` | https://images.unsplash.com/photo-1544816155-12df9643f363 |
| `crewneck-1.webp` | https://images.unsplash.com/photo-1614975059251-992f11792b9f |
| `crewneck-2.webp` | https://images.unsplash.com/photo-1578587018452-892bacefd3f2 |
| `pocket-tee-1.webp` | https://images.unsplash.com/photo-1564584217132-2271feaeb3c5 |
| `pocket-tee-2.webp` | https://images.unsplash.com/photo-1622445275463-afa2ab738c34 |
| `longsleeve-1.webp` | https://images.unsplash.com/photo-1578681994506-b8f463449011 |
| `longsleeve-2.webp` | https://images.unsplash.com/photo-1531891437562-4301cf35b7e4 |
| `trackpants-1.webp` | https://images.unsplash.com/photo-1550246140-29f40b909e5a |
| `trackpants-2.webp` | https://images.unsplash.com/photo-1519058082700-08a0b56da9b4 |
| `hero.webp` | https://images.unsplash.com/photo-1509942774463-acf339cf87d5 |
| `hero-mobile.webp` | https://images.unsplash.com/photo-1509942774463-acf339cf87d5 |
| `cat-hoodies.webp` | https://images.unsplash.com/photo-1548126032-079a0fb0099d |
| `cat-tees.webp` | https://images.unsplash.com/photo-1586790170083-2f9ceadc732d |
| `cat-pants.webp` | https://images.unsplash.com/photo-1473966968600-fa801b869a1a |
| `editorial.webp` | https://images.unsplash.com/photo-1523398002811-999ca8dec234 |
| `social-1.webp` | https://images.unsplash.com/photo-1520975954732-35dd22299614 |
| `social-2.webp` | https://images.unsplash.com/photo-1529139574466-a303027c1d8b |
| `social-3.webp` | https://images.unsplash.com/photo-1488161628813-04466f872be2 |
| `social-4.webp` | https://images.unsplash.com/photo-1503342394128-c104d54dba01 |
| `social-5.webp` | https://images.unsplash.com/photo-1613852348851-df1739db8201 |
| `social-6.webp` | https://images.unsplash.com/photo-1607345366928-199ea26cfe3e |
| `about-1.webp` | https://images.unsplash.com/photo-1488161628813-04466f872be2 |
| `about-2.webp` | https://images.unsplash.com/photo-1520975954732-35dd22299614 |
| `about-3.webp` | https://images.unsplash.com/photo-1490481651871-ab68de25d43d |


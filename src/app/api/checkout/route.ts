import type Stripe from 'stripe';
import { getProductByHandle, productUrl } from '@/lib/commerce';
import { lookupDiscount } from '@/lib/discounts';
import { orderTotals } from '@/lib/pricing';
import { absoluteUrl, EU_COUNTRIES } from '@/lib/site';
import type { Size } from '@/lib/types';
import { getStripe } from '@/lib/server/stripe';
import { isEmail, json, str } from '@/lib/server/validate';
import { isLocale, lp, type Locale } from '@/lib/locale';

const METHODS: Record<string, Stripe.Checkout.SessionCreateParams.PaymentMethodType[]> = {
  // Apple Pay and Google Pay are shown by Stripe Checkout on supported devices when card is enabled.
  card: ['card'],
  'apple-pay': ['card'],
  'google-pay': ['card'],
  paypal: ['paypal'],
  klarna: ['klarna'],
};

const COUNTRY_CODES = new Set<string>(EU_COUNTRIES.map(([code]) => code));
const MAX_LINES = 20;
const MAX_QTY = 10;

function orderRef() {
  const rand = crypto.getRandomValues(new Uint32Array(1))[0].toString(36).toUpperCase().padStart(6, '0');
  return `OST-${rand.slice(0, 6)}`;
}

const MSG = {
  en: {
    invalid: 'Invalid request.',
    email: 'Enter a valid email address.',
    required: 'Required.',
    country: 'We ship to EU countries only.',
    check: 'Check the highlighted fields.',
    empty: 'Your bag is empty.',
    tooMany: 'Too many items in one order.',
    unavailable: 'One of the items in your bag is no longer available. Remove it and try again.',
    soldOut: (item: string) => `${item} just sold out.`,
    onlyLeft: (n: number, item: string) => `Only ${n} left of ${item}.`,
    payment: 'Could not start payment. Try again or choose another payment method.',
  },
  lt: {
    invalid: 'Neteisinga užklausa.',
    email: 'Įveskite teisingą el. pašto adresą.',
    required: 'Privaloma.',
    country: 'Siunčiame tik į ES šalis.',
    check: 'Patikrinkite pažymėtus laukus.',
    empty: 'Jūsų krepšelis tuščias.',
    tooMany: 'Per daug prekių viename užsakyme.',
    unavailable: 'Vienos iš krepšelio prekių nebėra. Pašalinkite ją ir bandykite dar kartą.',
    soldOut: (item: string) => `${item} ką tik išparduota.`,
    onlyLeft: (n: number, item: string) => `${item}: liko tik ${n}.`,
    payment: 'Nepavyko pradėti mokėjimo. Bandykite dar kartą arba pasirinkite kitą mokėjimo būdą.',
  },
};

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return json({ error: MSG.en.invalid }, 400);
  const locale: Locale = isLocale(body.locale) ? body.locale : 'en';
  const m = MSG[locale];

  /* ---- Contact & address ---- */
  const a = body.address ?? {};
  const address = {
    firstName: str(a.firstName, 60),
    lastName: str(a.lastName, 60),
    line1: str(a.line1, 120),
    line2: str(a.line2, 120),
    city: str(a.city, 80),
    postalCode: str(a.postalCode, 20),
    country: str(a.country, 2).toUpperCase(),
    phone: str(a.phone, 30),
  };
  const fields: Record<string, string> = {};
  if (!isEmail(body.email)) fields.email = m.email;
  if (!address.firstName) fields.firstName = m.required;
  if (!address.lastName) fields.lastName = m.required;
  if (!address.line1) fields.line1 = m.required;
  if (!address.city) fields.city = m.required;
  if (!address.postalCode) fields.postalCode = m.required;
  if (!COUNTRY_CODES.has(address.country)) fields.country = m.country;
  if (Object.keys(fields).length) return json({ error: m.check, fields }, 422);

  const methodKey = typeof body.paymentMethod === 'string' && body.paymentMethod in METHODS ? body.paymentMethod : 'card';

  /* ---- Items: re-price and re-check stock on the server, never trust the client ---- */
  if (!Array.isArray(body.items) || body.items.length === 0) return json({ error: m.empty }, 422);
  if (body.items.length > MAX_LINES) return json({ error: m.tooMany }, 422);

  const lines: { name: string; image: string; url: string; color: string; size: Size; price: number; quantity: number }[] = [];
  for (const item of body.items) {
    const product = await getProductByHandle(str(item?.handle, 120), locale);
    const color = product?.colors.find((c) => c.slug === item?.color);
    const size = product?.sizes.find((s) => s === item?.size);
    const quantity = Number(item?.quantity);
    if (!product || !color || !size || !Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QTY) {
      return json({ error: m.unavailable }, 409);
    }
    const stock = product.stock[color.slug]?.[size] ?? 0;
    if (stock < quantity) {
      return json(
        {
          error:
            stock === 0
              ? m.soldOut(`${product.name} (${color.name}, ${size})`)
              : m.onlyLeft(stock, `${product.name} (${color.name}, ${size})`),
        },
        409,
      );
    }
    lines.push({
      name: `${product.name} — ${color.name}, ${size}`,
      image: product.images[0].src,
      url: lp(locale, productUrl(product)),
      color: color.name,
      size,
      price: product.price,
      quantity,
    });
  }

  const subtotal = lines.reduce((n, l) => n + l.price * l.quantity, 0);
  const discount = lookupDiscount(body.discountCode);
  const totals = orderTotals(subtotal, discount?.percent ?? 0);
  const ref = orderRef();

  const stripe = getStripe();
  // Redirect back to whichever host started checkout (preview deploys, localhost).
  const origin = new URL(req.url).origin;

  /* ---- Demo mode: no payment provider configured ---- */
  if (!stripe) {
    return json({ mode: 'demo', url: lp(locale, `/checkout/success?order=${ref}&demo=1`), order: { id: ref, ...totals } });
  }

  /* ---- Stripe Checkout ---- */
  try {
    const discounts: Stripe.Checkout.SessionCreateParams.Discount[] = [];
    if (discount) {
      // One reusable coupon per code, created on first use.
      const coupon = await stripe.coupons.retrieve(discount.code).catch(() =>
        stripe.coupons.create({ id: discount.code, name: discount.code, percent_off: discount.percent, duration: 'once' }),
      );
      discounts.push({ coupon: coupon.id });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      locale: locale === 'lt' ? 'lt' : 'auto',
      customer_email: body.email.trim(),
      client_reference_id: ref,
      payment_method_types: METHODS[methodKey],
      line_items: lines.map((l) => ({
        quantity: l.quantity,
        price_data: {
          currency: 'eur',
          unit_amount: l.price,
          tax_behavior: 'inclusive',
          product_data: { name: l.name, images: [absoluteUrl(l.image)] },
        },
      })),
      discounts,
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            display_name: totals.shipping === 0 ? 'Free EU shipping' : 'EU standard',
            fixed_amount: { amount: totals.shipping, currency: 'eur' },
            tax_behavior: 'inclusive',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 2 },
              maximum: { unit: 'business_day', value: 5 },
            },
          },
        },
      ],
      payment_intent_data: {
        shipping: {
          name: `${address.firstName} ${address.lastName}`,
          phone: address.phone || undefined,
          address: {
            line1: address.line1,
            line2: address.line2 || undefined,
            city: address.city,
            postal_code: address.postalCode,
            country: address.country,
          },
        },
        metadata: { order_ref: ref },
      },
      metadata: { order_ref: ref, marketing_opt_in: body.marketing ? 'yes' : 'no' },
      success_url: `${origin}${lp(locale, '/checkout/success')}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}${lp(locale, '/checkout')}`,
    });

    return json({ mode: 'stripe', url: session.url, order: { id: ref, ...totals } });
  } catch (err) {
    console.error('[checkout] Stripe error', err);
    return json({ error: m.payment }, 502);
  }
}

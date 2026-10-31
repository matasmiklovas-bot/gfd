import { EU_COUNTRIES } from './site';
import type { Locale } from './locale';

// Shared by the checkout API and the static demo build (no server there), so both validate the same way and speak the
// same language. Prices and stock are re-checked only on the server.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const COUNTRY_CODES = new Set<string>(EU_COUNTRIES.map(([code]) => code));

const text = (value: unknown, max: number) => (typeof value === 'string' ? value.trim().slice(0, max) : '');

export const CHECKOUT_MSG = {
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

export function orderRef() {
  const rand = crypto.getRandomValues(new Uint32Array(1))[0].toString(36).toUpperCase().padStart(6, '0');
  return `OST-${rand.slice(0, 6)}`;
}

/** Normalised address plus a message per invalid field (empty when everything is valid). */
export function checkContact(body: { email?: unknown; address?: Record<string, unknown>; locale?: unknown }, locale: Locale = 'en') {
  const m = CHECKOUT_MSG[locale];
  const a = body.address ?? {};
  const address = {
    firstName: text(a.firstName, 60),
    lastName: text(a.lastName, 60),
    line1: text(a.line1, 120),
    line2: text(a.line2, 120),
    city: text(a.city, 80),
    postalCode: text(a.postalCode, 20),
    country: text(a.country, 2).toUpperCase(),
    phone: text(a.phone, 30),
  };
  const fields: Record<string, string> = {};
  const email = body.email;
  if (typeof email !== 'string' || email.length > 254 || !EMAIL_RE.test(email.trim())) fields.email = m.email;
  if (!address.firstName) fields.firstName = m.required;
  if (!address.lastName) fields.lastName = m.required;
  if (!address.line1) fields.line1 = m.required;
  if (!address.city) fields.city = m.required;
  if (!address.postalCode) fields.postalCode = m.required;
  if (!COUNTRY_CODES.has(address.country)) fields.country = m.country;
  return { address, fields };
}

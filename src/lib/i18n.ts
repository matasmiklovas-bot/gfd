'use client';

import { prefsStore, type Locale } from '@/lib/store';

/**
 * Interface strings only (navigation, buttons, cart, labels).
 * Long-form copy — product descriptions, help and legal pages — is English.
 * Full Lithuanian content needs locale routes (/lt/...) and translated copy.
 */
const DICT = {
  'nav.new': { en: 'New', lt: 'Nauja' },
  'nav.women': { en: 'Women', lt: 'Moterims' },
  'nav.men': { en: 'Men', lt: 'Vyrams' },
  'nav.about': { en: 'About', lt: 'Apie' },
  'nav.menu': { en: 'Menu', lt: 'Meniu' },
  'nav.search': { en: 'Search', lt: 'Paieška' },
  'nav.account': { en: 'Account', lt: 'Paskyra' },
  'nav.bag': { en: 'Bag', lt: 'Krepšelis' },
  'nav.wishlist': { en: 'Wishlist', lt: 'Norų sąrašas' },
  'nav.close': { en: 'Close', lt: 'Uždaryti' },
  'ann.0': { en: 'Free shipping over €60 · EU delivery 2–5 days', lt: 'Nemokamas pristatymas nuo 60 € · ES pristatymas per 2–5 d.' },
  'ann.1': { en: 'Autumn–Winter 2026 — new in', lt: 'Ruduo–žiema 2026 — naujiena' },
  'ann.2': { en: '14-day returns across the EU', lt: '14 dienų grąžinimas visoje ES' },
  'product.add': { en: 'Add to bag', lt: 'Į krepšelį' },
  'product.added': { en: 'Added', lt: 'Pridėta' },
  'product.selectSize': { en: 'Select a size', lt: 'Pasirinkite dydį' },
  'product.soldOut': { en: 'Sold out', lt: 'Išparduota' },
  'product.new': { en: 'New', lt: 'Nauja' },
  'product.onlyLeft': { en: 'Only {n} left', lt: 'Liko tik {n}' },
  'cart.title': { en: 'Bag', lt: 'Krepšelis' },
  'cart.empty': { en: 'Your bag is empty.', lt: 'Jūsų krepšelis tuščias.' },
  'cart.subtotal': { en: 'Subtotal', lt: 'Tarpinė suma' },
  'cart.checkout': { en: 'Checkout', lt: 'Apmokėti' },
  'cart.remove': { en: 'Remove', lt: 'Pašalinti' },
  'cart.away': { en: '{amount} away from free shipping', lt: 'Iki nemokamo pristatymo trūksta {amount}' },
  'cart.free': { en: 'Free shipping unlocked', lt: 'Pristatymas nemokamas' },
  'cart.taxes': { en: 'VAT included. Shipping and discounts at checkout.', lt: 'PVM įskaičiuotas. Pristatymas ir nuolaidos apmokant.' },
  'cart.continue': { en: 'Continue shopping', lt: 'Tęsti apsipirkimą' },
  'footer.shop': { en: 'Shop', lt: 'Parduotuvė' },
  'footer.help': { en: 'Help', lt: 'Pagalba' },
  'footer.legal': { en: 'Legal', lt: 'Teisinė info' },
  'footer.follow': { en: 'Follow', lt: 'Sekite' },
  'cookie.text': { en: 'We use cookies to run the store and, with your consent, to measure and improve it.', lt: 'Naudojame slapukus parduotuvės veikimui ir, jums sutikus, jos tobulinimui.' },
  'cookie.accept': { en: 'Accept', lt: 'Sutinku' },
  'cookie.reject': { en: 'Reject', lt: 'Atmesti' },
  'cookie.settings': { en: 'Settings', lt: 'Nustatymai' },
  'cookie.save': { en: 'Save choices', lt: 'Išsaugoti' },
} as const satisfies Record<string, Record<Locale, string>>;

export type TKey = keyof typeof DICT;

export function translate(locale: Locale, key: TKey, vars?: Record<string, string | number>) {
  let s: string = DICT[key][locale];
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.replace(`{${k}}`, String(v));
  return s;
}

export function useT() {
  const locale = prefsStore.useStore((s) => s.locale);
  return (key: TKey, vars?: Record<string, string | number>) => translate(locale, key, vars);
}

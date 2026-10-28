export const SITE = {
  name: 'OSTREV',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ostrev.com',
  description:
    'OSTREV is minimalist streetwear. Heavyweight hoodies, oversized tees and wide-leg pants in black, grey and white. EU delivery in 2–5 days.',
  email: 'hello@ostrev.com',
  supportEmail: 'support@ostrev.com',
  instagram: 'https://www.instagram.com/ostrev',
  tiktok: 'https://www.tiktok.com/@ostrev',
  handle: '@ostrev',
  // Replace with the registered company details before launch.
  company: {
    legalName: 'OSTREV UAB',
    address: 'Vilnius, Lithuania',
    registrationNumber: 'To be added',
    vatNumber: 'To be added',
  },
} as const;

export const ANNOUNCEMENTS = [
  'Free shipping over €60 · EU delivery 2–5 days',
  'Drop 01 — out now',
  '14-day returns across the EU',
] as const;

export const NAV = [
  { href: '/shop', label: 'Shop', key: 'nav.shop' },
  { href: '/new', label: 'New', key: 'nav.new' },
  { href: '/drops', label: 'Drops', key: 'nav.drops' },
  { href: '/about', label: 'About', key: 'nav.about' },
] as const;

export const NEXT_DROP = {
  name: 'Drop 02',
  // Europe/Vilnius, 18:00 local time.
  date: '2026-11-20T18:00:00+02:00',
  teaser: 'Outerwear. Heavier than anything we have made. 300 pieces per style.',
};

export const FOOTER_LINKS = {
  shop: [
    { href: '/shop/hoodies', label: 'Hoodies' },
    { href: '/shop/tees', label: 'Tees' },
    { href: '/shop/pants', label: 'Pants' },
    { href: '/shop/accessories', label: 'Accessories' },
    { href: '/new', label: 'New in' },
  ],
  help: [
    { href: '/help/shipping', label: 'Shipping' },
    { href: '/help/returns', label: 'Returns' },
    { href: '/help/size-guide', label: 'Size guide' },
    { href: '/help/faq', label: 'FAQ' },
    { href: '/help/contact', label: 'Contact' },
  ],
  legal: [
    { href: '/legal/privacy', label: 'Privacy policy' },
    { href: '/legal/terms', label: 'Terms & conditions' },
    { href: '/legal/cookies', label: 'Cookie policy' },
  ],
};

export const EU_COUNTRIES = [
  ['AT', 'Austria'], ['BE', 'Belgium'], ['BG', 'Bulgaria'], ['HR', 'Croatia'], ['CY', 'Cyprus'],
  ['CZ', 'Czechia'], ['DK', 'Denmark'], ['EE', 'Estonia'], ['FI', 'Finland'], ['FR', 'France'],
  ['DE', 'Germany'], ['GR', 'Greece'], ['HU', 'Hungary'], ['IE', 'Ireland'], ['IT', 'Italy'],
  ['LV', 'Latvia'], ['LT', 'Lithuania'], ['LU', 'Luxembourg'], ['MT', 'Malta'], ['NL', 'Netherlands'],
  ['PL', 'Poland'], ['PT', 'Portugal'], ['RO', 'Romania'], ['SK', 'Slovakia'], ['SI', 'Slovenia'],
  ['ES', 'Spain'], ['SE', 'Sweden'],
] as const;

export function absoluteUrl(path = '/') {
  return new URL(path, SITE.url).toString();
}

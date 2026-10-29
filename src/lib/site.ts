export const SITE = {
  name: 'OSTREV',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ostrev.com',
  description:
    'OSTREV is women’s and men’s fashion from Vilnius: trench coats, knitwear, shirts and denim at high-street prices. EU delivery in 2–5 days.',
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
  'Autumn–Winter 2026 — new in',
  '14-day returns across the EU',
] as const;

export const NAV = [
  { href: '/women', label: 'Women', key: 'nav.women' },
  { href: '/men', label: 'Men', key: 'nav.men' },
  { href: '/new', label: 'New', key: 'nav.new' },
  { href: '/about', label: 'About', key: 'nav.about' },
] as const;

/** Category links under Women and Men in the header and mobile menu. Checked against the catalog at build time. */
export const MENU: Record<'women' | 'men', { category: string; label: string }[]> = {
  women: [
    { category: 'coats', label: 'Coats & jackets' },
    { category: 'knitwear', label: 'Knitwear' },
    { category: 'shirts', label: 'Shirts & tops' },
    { category: 'dresses', label: 'Dresses' },
    { category: 'trousers', label: 'Jeans & trousers' },
    { category: 'accessories', label: 'Bags' },
  ],
  men: [
    { category: 'coats', label: 'Coats & jackets' },
    { category: 'knitwear', label: 'Knitwear' },
    { category: 'shirts', label: 'Shirts & T-shirts' },
    { category: 'trousers', label: 'Jeans & trousers' },
  ],
};

export const FOOTER_LINKS = {
  shop: [
    { href: '/women', label: 'Women' },
    { href: '/men', label: 'Men' },
    { href: '/shop/coats', label: 'Coats & jackets' },
    { href: '/shop/knitwear', label: 'Knitwear' },
    { href: '/shop/trousers', label: 'Jeans & trousers' },
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

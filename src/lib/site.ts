export const SITE = {
  name: 'OSTREV',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ostrev.com',
  description: {
    en: 'OSTREV is women’s and men’s fashion from Vilnius: trench coats, knitwear, shirts and denim at high-street prices. EU delivery in 2–5 days.',
    lt: 'OSTREV – moterų ir vyrų mada iš Vilniaus: tranšėjiniai paltai, megztiniai, marškiniai ir džinsai prieinamomis kainomis. Pristatymas ES per 2–5 d.',
  },
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

export const NAV = [
  { href: '/women', label: 'Women', key: 'nav.women' },
  { href: '/men', label: 'Men', key: 'nav.men' },
  { href: '/new', label: 'New', key: 'nav.new' },
  { href: '/about', label: 'About', key: 'nav.about' },
] as const;

/** Category links under Women and Men in the header and mobile menu. Checked against the catalog at build time. */
export const MENU: Record<'women' | 'men', { category: string; label: { en: string; lt: string } }[]> = {
  women: [
    { category: 'coats', label: { en: 'Coats & jackets', lt: 'Paltai ir striukės' } },
    { category: 'knitwear', label: { en: 'Knitwear', lt: 'Megztiniai' } },
    { category: 'shirts', label: { en: 'Shirts & tops', lt: 'Marškiniai ir palaidinės' } },
    { category: 'dresses', label: { en: 'Dresses', lt: 'Suknelės' } },
    { category: 'trousers', label: { en: 'Jeans & trousers', lt: 'Džinsai ir kelnės' } },
    { category: 'accessories', label: { en: 'Bags', lt: 'Rankinės' } },
  ],
  men: [
    { category: 'coats', label: { en: 'Coats & jackets', lt: 'Paltai ir striukės' } },
    { category: 'knitwear', label: { en: 'Knitwear', lt: 'Megztiniai' } },
    { category: 'shirts', label: { en: 'Shirts & T-shirts', lt: 'Marškiniai ir marškinėliai' } },
    { category: 'trousers', label: { en: 'Jeans & trousers', lt: 'Džinsai ir kelnės' } },
  ],
};

type FooterLink = { href: string; label: { en: string; lt: string } };

export const FOOTER_LINKS: Record<'shop' | 'help' | 'legal', FooterLink[]> = {
  shop: [
    { href: '/women', label: { en: 'Women', lt: 'Moterims' } },
    { href: '/men', label: { en: 'Men', lt: 'Vyrams' } },
    { href: '/shop/coats', label: { en: 'Coats & jackets', lt: 'Paltai ir striukės' } },
    { href: '/shop/knitwear', label: { en: 'Knitwear', lt: 'Megztiniai' } },
    { href: '/shop/trousers', label: { en: 'Jeans & trousers', lt: 'Džinsai ir kelnės' } },
    { href: '/new', label: { en: 'New in', lt: 'Naujienos' } },
  ],
  help: [
    { href: '/help/shipping', label: { en: 'Shipping', lt: 'Pristatymas' } },
    { href: '/help/returns', label: { en: 'Returns', lt: 'Grąžinimas' } },
    { href: '/help/size-guide', label: { en: 'Size guide', lt: 'Dydžių lentelė' } },
    { href: '/help/faq', label: { en: 'FAQ', lt: 'DUK' } },
    { href: '/help/contact', label: { en: 'Contact', lt: 'Kontaktai' } },
  ],
  legal: [
    { href: '/legal/privacy', label: { en: 'Privacy policy', lt: 'Privatumo politika' } },
    { href: '/legal/terms', label: { en: 'Terms & conditions', lt: 'Pirkimo taisyklės' } },
    { href: '/legal/cookies', label: { en: 'Cookie policy', lt: 'Slapukų politika' } },
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

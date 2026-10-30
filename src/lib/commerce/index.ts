import 'server-only';
import type { Category, Gender, Product, ProductSummary, Size } from '@/lib/types';
import { lp, type Locale } from '@/lib/locale';
import * as adapter from './local';

export const { getAllProducts, getProductByHandle, getProductsByCategory, getProductsByGender, getStock } = adapter;

type Text = Record<Locale, string>;

const CATEGORY_TEXT: { slug: Category; label: Text; description: Text }[] = [
  {
    slug: 'coats',
    label: { en: 'Coats & jackets', lt: 'Paltai ir striukės' },
    description: {
      en: 'Trench coats, wool coats, blazers, puffers and denim jackets for the cold half of the year.',
      lt: 'Tranšėjiniai ir vilnoniai paltai, švarkai, pūstos ir džinsinės striukės šaltajam metų laikui.',
    },
  },
  {
    slug: 'knitwear',
    label: { en: 'Knitwear', lt: 'Megztiniai' },
    description: {
      en: 'Chunky turtlenecks, soft brushed jumpers and fine-gauge crew necks.',
      lt: 'Stori golfai, minkšti pūkuoti megztiniai ir plono mezgimo megztiniai apvalia iškirpte.',
    },
  },
  {
    slug: 'shirts',
    label: { en: 'Shirts & tops', lt: 'Marškiniai ir palaidinės' },
    description: {
      en: 'Poplin and Oxford shirts, bodysuits, overshirts and heavyweight T-shirts.',
      lt: 'Poplino ir Oksfordo marškiniai, glaustinukės, marškiniai-striukės ir stori marškinėliai.',
    },
  },
  {
    slug: 'dresses',
    label: { en: 'Dresses', lt: 'Suknelės' },
    description: { en: 'Satin shirt dresses and cotton midi dresses.', lt: 'Satino suknelės-marškiniai ir medvilninės midi suknelės.' },
  },
  {
    slug: 'trousers',
    label: { en: 'Jeans & trousers', lt: 'Džinsai ir kelnės' },
    description: {
      en: 'Wide-leg, straight, mom and baggy jeans, flared and pleated trousers, corduroy.',
      lt: 'Platūs, tiesūs, „mom“ ir labai laisvi džinsai, platėjančios kelnės, kelnės su klostėmis, velvetinės.',
    },
  },
  {
    slug: 'accessories',
    label: { en: 'Bags', lt: 'Rankinės' },
    description: {
      en: 'Shoulder, baguette and chain bags to finish the look.',
      lt: 'Rankinės per petį, „baguette“ ir su grandinėle – derinio užbaigimui.',
    },
  },
];

const GENDER_TEXT: { slug: Gender; label: Text; description: Text }[] = [
  {
    slug: 'women',
    label: { en: 'Women', lt: 'Moterims' },
    description: {
      en: 'Coats, knitwear, shirts and denim for autumn–winter 2026.',
      lt: 'Paltai, megztiniai, marškiniai ir džinsai 2026 m. rudens–žiemos sezonui.',
    },
  },
  {
    slug: 'men',
    label: { en: 'Men', lt: 'Vyrams' },
    description: {
      en: 'Jackets, knitwear, overshirts and denim for autumn–winter 2026.',
      lt: 'Striukės, megztiniai, marškiniai-striukės ir džinsai 2026 m. rudens–žiemos sezonui.',
    },
  },
];

const pick = <T extends { label: Text; description: Text }>(list: T[], locale: Locale) =>
  list.map((x) => ({ ...x, label: x.label[locale], description: x.description[locale] }));

export function getCategories(locale: Locale = 'en'): { slug: Category; label: string; description: string }[] {
  return pick(CATEGORY_TEXT, locale);
}

export function getGenders(locale: Locale = 'en'): { slug: Gender; label: string; description: string }[] {
  return pick(GENDER_TEXT, locale);
}

/** English labels; use getCategories(locale) for anything shown to shoppers. */
export const CATEGORIES = getCategories('en');
export const GENDERS = getGenders('en');

export function isCategory(value: string): value is Category {
  return CATEGORIES.some((c) => c.slug === value);
}

export function categoriesFor(products: Pick<Product, 'category'>[], locale: Locale = 'en') {
  return getCategories(locale).filter((c) => products.some((p) => p.category === c.slug));
}

/** Locale-free path; wrap with lp(locale, …) for links. */
export function productUrl(p: Pick<Product, 'category' | 'handle'>) {
  return `/shop/${p.category}/${p.handle}`;
}

export function isSoldOut(p: Product) {
  return Object.values(p.stock).every((sizes) => Object.values(sizes).every((n) => !n));
}

export function totalStock(p: Product) {
  return Object.values(p.stock).reduce(
    (sum, sizes) => sum + Object.values(sizes).reduce((s, n) => s + (n ?? 0), 0),
    0,
  );
}

export function toSummary(p: Product, locale: Locale = 'en'): ProductSummary {
  const availableSizes = p.sizes.filter((size: Size) =>
    Object.values(p.stock).some((sizes) => (sizes[size] ?? 0) > 0),
  );
  return {
    handle: p.handle,
    name: p.name,
    gender: p.gender,
    category: p.category,
    price: p.price,
    drop: p.drop,
    isNew: p.isNew,
    soldOut: isSoldOut(p),
    releasedAt: p.releasedAt,
    url: lp(locale, productUrl(p)),
    colors: p.colors,
    sizes: p.sizes,
    availableSizes,
    images: p.images,
  };
}

export async function getAllSummaries(locale: Locale = 'en') {
  return (await getAllProducts(locale)).map((p) => toSummary(p, locale));
}

/** Newest first, sold-out items last. */
export function sortForListing<T extends { releasedAt: string; soldOut: boolean }>(list: T[]) {
  return [...list].sort(
    (a, b) => Number(a.soldOut) - Number(b.soldOut) || b.releasedAt.localeCompare(a.releasedAt),
  );
}

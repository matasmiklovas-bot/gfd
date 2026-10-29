import 'server-only';
import type { Category, Gender, Product, ProductSummary, Size } from '@/lib/types';
import * as adapter from './local';

export const { getAllProducts, getProductByHandle, getProductsByCategory, getProductsByGender, getStock } = adapter;

export const CATEGORIES: { slug: Category; label: string; description: string }[] = [
  { slug: 'coats', label: 'Coats & jackets', description: 'Trench coats, wool coats, blazers, puffers and denim jackets for the cold half of the year.' },
  { slug: 'knitwear', label: 'Knitwear', description: 'Chunky turtlenecks, soft brushed jumpers and fine-gauge crew necks.' },
  { slug: 'shirts', label: 'Shirts & tops', description: 'Poplin shirts, satin shirt dresses, overshirts and heavyweight T-shirts.' },
  { slug: 'trousers', label: 'Jeans & trousers', description: 'Wide-leg, straight, mom and baggy jeans, plus corduroy trousers.' },
  { slug: 'accessories', label: 'Bags', description: 'Leather bags to finish the look.' },
];

export const GENDERS: { slug: Gender; label: string; description: string }[] = [
  { slug: 'women', label: 'Women', description: 'Coats, knitwear, shirts and denim for autumn–winter 2026.' },
  { slug: 'men', label: 'Men', description: 'Jackets, knitwear, overshirts and denim for autumn–winter 2026.' },
];

export function isCategory(value: string): value is Category {
  return CATEGORIES.some((c) => c.slug === value);
}

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

export function toSummary(p: Product): ProductSummary {
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
    url: productUrl(p),
    colors: p.colors,
    sizes: p.sizes,
    availableSizes,
    images: p.images,
  };
}

export async function getAllSummaries() {
  return (await getAllProducts()).map(toSummary);
}

/** Newest first, sold-out items last. */
export function sortForListing<T extends { releasedAt: string; soldOut: boolean }>(list: T[]) {
  return [...list].sort(
    (a, b) => Number(a.soldOut) - Number(b.soldOut) || b.releasedAt.localeCompare(a.releasedAt),
  );
}

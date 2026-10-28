import 'server-only';
import type { Category, Product, ProductSummary, Size } from '@/lib/types';
import * as adapter from './local';

export const { getAllProducts, getProductByHandle, getProductsByCategory, getStock } = adapter;

export const CATEGORIES: { slug: Category; label: string; description: string }[] = [
  { slug: 'hoodies', label: 'Hoodies', description: 'Heavyweight hoodies and crewnecks in 380–400gsm cotton fleece. Oversized and boxy cuts.' },
  { slug: 'tees', label: 'Tees', description: 'Heavyweight tees from 220 to 250gsm. Blank, logo and graphic. Oversized fits.' },
  { slug: 'pants', label: 'Pants', description: 'Wide-leg cargos, baggy sweatpants and track pants. Built to stack.' },
  { slug: 'accessories', label: 'Accessories', description: 'Beanies and bags. The finishing layer.' },
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

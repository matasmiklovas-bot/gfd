import 'server-only';
import raw from '@data/products.json';
import rawLt from '@data/products.lt.json';
import type { Category, Gender, Product, Size } from '@/lib/types';
import type { Locale } from '@/lib/locale';
import { MENU } from '@/lib/site';

/**
 * Local JSON catalog. Edit data/products.json to change products.
 *
 * Every page reads products through src/lib/commerce/index.ts, never from this
 * file directly, so moving to Shopify means writing a second adapter with the
 * same function signatures (backed by the Storefront API) and switching the
 * export in index.ts.
 */
const products = validate(raw as unknown as Product[]);

interface Translation {
  colors: Record<string, string>;
  views: Record<string, string>;
  care: Record<string, string>;
  products: Record<string, Pick<Product, 'name' | 'summary' | 'description' | 'fit' | 'material'>>;
}
const lt = validateTranslation(rawLt as Translation, 'data/products.lt.json');
const byLocale: Record<Locale, Product[]> = { en: products, lt: products.map((p) => localize(p, lt)) };

/** Fails the build when a product, colour, care line or photo view has no translation. */
function validateTranslation(t: Translation, file: string) {
  for (const p of products) {
    const fail = (msg: string) => {
      throw new Error(`${file}: "${p.handle}": ${msg}`);
    };
    const tp = t.products[p.handle];
    if (!tp) fail('missing translation');
    for (const key of ['name', 'summary', 'description', 'fit', 'material'] as const) if (!tp[key]) fail(`missing ${key}`);
    for (const c of p.colors) if (!t.colors[c.slug]) fail(`missing colour "${c.slug}"`);
    for (const c of p.care) if (!t.care[c]) fail(`missing care line "${c}"`);
    for (const img of [...p.images, ...Object.values(p.colorImages ?? {}).flat()]) {
      const view = img.alt.split(', ').pop()!;
      if (!t.views[view]) fail(`missing photo view "${view}"`);
    }
  }
  return t;
}

function localize(p: Product, t: Translation): Product {
  const tp = t.products[p.handle];
  const alt = (a: string) => {
    const color = p.colors.find((c) => a.includes(` in ${c.name.toLowerCase()}`));
    const view = a.split(', ').pop()!;
    return [tp.name, color ? t.colors[color.slug].toLowerCase() : null, t.views[view]].filter(Boolean).join(', ');
  };
  const imgs = (list: Product['images']) => list.map((i) => ({ ...i, alt: alt(i.alt) }));
  return {
    ...p,
    ...tp,
    care: p.care.map((c) => t.care[c]),
    colors: p.colors.map((c) => ({ ...c, name: t.colors[c.slug] })),
    images: imgs(p.images),
    colorImages: p.colorImages
      ? Object.fromEntries(Object.entries(p.colorImages).map(([k, v]) => [k, imgs(v)]))
      : undefined,
  };
}

/** Fails the build with a readable message if products.json is edited into an invalid state. */
function validate(list: Product[]) {
  const handles = new Set<string>();
  const categories = ['coats', 'knitwear', 'shirts', 'dresses', 'trousers', 'accessories'];
  const genders = ['women', 'men'];
  for (const p of list) {
    const fail = (msg: string) => {
      throw new Error(`data/products.json: "${p.handle ?? p.id}": ${msg}`);
    };
    if (!p.handle || !/^[a-z0-9-]+$/.test(p.handle)) fail('handle must be lowercase-kebab-case');
    if (handles.has(p.handle)) fail('duplicate handle');
    handles.add(p.handle);
    if (!categories.includes(p.category)) fail(`unknown category "${p.category}"`);
    if (!genders.includes(p.gender)) fail(`gender must be "women" or "men", got "${p.gender}"`);
    if (!Number.isInteger(p.price) || p.price <= 0) fail('price must be a positive integer in cents');
    if (!p.images?.length) fail('needs at least one image');
    if (!p.colors?.length || !p.sizes?.length) fail('needs colors and sizes');
    for (const c of p.colors) {
      if (!p.stock[c.slug]) fail(`missing stock for colour "${c.slug}"`);
    }
    for (const [color, imgs] of Object.entries(p.colorImages ?? {})) {
      if (!p.colors.some((c) => c.slug === color)) fail(`colorImages for unknown colour "${color}"`);
      if (!imgs.length) fail(`colorImages["${color}"] is empty`);
    }
    for (const [color, sizes] of Object.entries(p.stock)) {
      if (!p.colors.some((c) => c.slug === color)) fail(`stock for unknown colour "${color}"`);
      for (const size of Object.keys(sizes)) {
        if (!p.sizes.includes(size as Size)) fail(`stock for unknown size "${size}"`);
      }
    }
  }
  for (const [gender, items] of Object.entries(MENU)) {
    for (const { category } of items) {
      if (!list.some((p) => p.gender === gender && p.category === category)) {
        throw new Error(`src/lib/site.ts: MENU.${gender} links to "${category}" but no ${gender} product is in that category`);
      }
    }
  }
  for (const p of list) {
    for (const r of p.related) {
      if (!handles.has(r)) throw new Error(`data/products.json: "${p.handle}": related handle "${r}" not found`);
    }
  }
  return list;
}

export async function getAllProducts(locale: Locale = 'en'): Promise<Product[]> {
  return byLocale[locale];
}

export async function getProductByHandle(handle: string, locale: Locale = 'en'): Promise<Product | undefined> {
  return byLocale[locale].find((p) => p.handle === handle);
}

export async function getProductsByCategory(category: Category, locale: Locale = 'en'): Promise<Product[]> {
  return byLocale[locale].filter((p) => p.category === category);
}

export async function getProductsByGender(gender: Gender, locale: Locale = 'en'): Promise<Product[]> {
  return byLocale[locale].filter((p) => p.gender === gender);
}

export async function getStock(handle: string, color: string, size: Size): Promise<number> {
  const product = await getProductByHandle(handle);
  return product?.stock[color]?.[size] ?? 0;
}

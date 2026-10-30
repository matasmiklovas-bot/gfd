import type { MetadataRoute } from 'next';
import { CATEGORIES, GENDERS, categoriesFor, getAllProducts, productUrl } from '@/lib/commerce';
import { absoluteUrl } from '@/lib/site';
import { LOCALES, lp } from '@/lib/locale';

/** Every page in both languages, each entry listing its hreflang alternates. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getAllProducts();
  const entry = (path: string, extra: Partial<MetadataRoute.Sitemap[number]> = {}) =>
    LOCALES.map((locale) => ({
      url: absoluteUrl(lp(locale, path)),
      alternates: { languages: Object.fromEntries(LOCALES.map((l) => [l, absoluteUrl(lp(l, path))])) },
      ...extra,
    }));

  const staticPaths = [
    '/', '/women', '/men', '/shop', '/new', '/about',
    '/help/shipping', '/help/returns', '/help/faq', '/help/size-guide', '/help/contact',
    '/legal/privacy', '/legal/terms', '/legal/cookies',
  ];
  return [
    ...staticPaths.flatMap((p) => entry(p, { changeFrequency: 'weekly', priority: p === '/' ? 1 : 0.5 })),
    ...CATEGORIES.flatMap((c) => entry(`/shop/${c.slug}`, { changeFrequency: 'weekly', priority: 0.8 })),
    ...GENDERS.flatMap((g) =>
      categoriesFor(products.filter((p) => p.gender === g.slug)).flatMap((c) =>
        entry(`/${g.slug}/${c.slug}`, { changeFrequency: 'weekly', priority: 0.8 }),
      ),
    ),
    ...products.flatMap((p) =>
      entry(productUrl(p), {
        lastModified: p.releasedAt,
        changeFrequency: 'daily',
        priority: 0.9,
        images: p.images.map((i) => absoluteUrl(i.src)),
      }),
    ),
  ];
}

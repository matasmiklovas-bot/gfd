import type { MetadataRoute } from 'next';
import { CATEGORIES, GENDERS, categoriesFor, getAllProducts, productUrl } from '@/lib/commerce';
import { absoluteUrl } from '@/lib/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getAllProducts();
  const staticPaths = [
    '/', '/women', '/men', '/shop', '/new', '/about',
    '/help/shipping', '/help/returns', '/help/faq', '/help/size-guide', '/help/contact',
    '/legal/privacy', '/legal/terms', '/legal/cookies',
  ];
  return [
    ...staticPaths.map((p) => ({ url: absoluteUrl(p), changeFrequency: 'weekly' as const, priority: p === '/' ? 1 : 0.5 })),
    ...CATEGORIES.map((c) => ({ url: absoluteUrl(`/shop/${c.slug}`), changeFrequency: 'weekly' as const, priority: 0.8 })),
    ...GENDERS.flatMap((g) =>
      categoriesFor(products.filter((p) => p.gender === g.slug)).map((c) => ({
        url: absoluteUrl(`/${g.slug}/${c.slug}`),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      })),
    ),
    ...products.map((p) => ({
      url: absoluteUrl(productUrl(p)),
      lastModified: p.releasedAt,
      changeFrequency: 'daily' as const,
      priority: 0.9,
      images: p.images.map((i) => absoluteUrl(i.src)),
    })),
  ];
}

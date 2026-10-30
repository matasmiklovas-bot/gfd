import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/', '/checkout', '/account', '/wishlist', '/search', '/lt/checkout', '/lt/account', '/lt/wishlist', '/lt/search'] }],
    sitemap: absoluteUrl('/sitemap.xml'),
  };
}

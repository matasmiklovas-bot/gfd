import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/site';

// Generated once at build time (also required by the static demo export).
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/', '/checkout', '/account', '/wishlist', '/search', '/lt/checkout', '/lt/account', '/lt/wishlist', '/lt/search'] }],
    sitemap: absoluteUrl('/sitemap.xml'),
  };
}

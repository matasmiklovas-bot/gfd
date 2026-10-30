import { NextResponse, type NextRequest } from 'next/server';

/**
 * English URLs have no prefix (/women); Lithuanian ones do (/lt/women). Pages live under
 * src/app/[locale], so un-prefixed requests are rewritten to /en/... and /en/... is redirected away.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === '/lt' || pathname.startsWith('/lt/')) return NextResponse.next();

  const url = request.nextUrl.clone();
  if (pathname === '/en' || pathname.startsWith('/en/')) {
    url.pathname = pathname.slice(3) || '/';
    return NextResponse.redirect(url, 308);
  }
  url.pathname = `/en${pathname === '/' ? '' : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Everything except API routes, Next internals and files with an extension (images, robots.txt, sitemap.xml…).
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};

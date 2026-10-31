/** @type {import('next').NextConfig} */
const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];

// STATIC_DEMO=1 builds a server-less demo (GitHub Pages): plain files, cart and demo checkout in the browser.
// See scripts/static/build.sh. BASE_PATH is the sub-path it is served from, e.g. /gfd.
const STATIC_DEMO = process.env.STATIC_DEMO === '1';
const BASE_PATH = STATIC_DEMO ? process.env.BASE_PATH ?? '' : '';

const nextConfig = {
  poweredByHeader: false,
  // Always defined, so `process.env.NEXT_PUBLIC_STATIC_DEMO === '1'` folds to a constant and demo-only code (and the
  // discount codes it imports) is dropped from the normal build.
  env: { NEXT_PUBLIC_STATIC_DEMO: STATIC_DEMO ? '1' : '', NEXT_PUBLIC_BASE_PATH: BASE_PATH },
  ...(STATIC_DEMO
    ? {
        output: 'export',
        basePath: BASE_PATH,
        trailingSlash: true,
        images: { loader: 'custom', loaderFile: './src/lib/imageLoader.ts' },
      }
    : {
        images: {
          formats: ['image/avif', 'image/webp'],
          deviceSizes: [390, 640, 828, 1080, 1440, 1920, 2400],
          imageSizes: [96, 160, 240, 320],
          minimumCacheTTL: 60 * 60 * 24 * 30,
        },
        redirects,
        headers,
      }),
};

async function redirects() {
  // Old streetwear URLs.
  return [
    { source: '/drops', destination: '/new', permanent: true },
    { source: '/shop/hoodies/:path*', destination: '/shop/knitwear', permanent: true },
    { source: '/shop/tees/:path*', destination: '/shop/shirts', permanent: true },
    { source: '/shop/pants/:path*', destination: '/shop/trousers', permanent: true },
  ];
}

async function headers() {
  return [{ source: '/:path*', headers: securityHeaders }];
}

export default nextConfig;

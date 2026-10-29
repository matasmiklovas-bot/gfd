/** @type {import('next').NextConfig} */
const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];

const nextConfig = {
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [390, 640, 828, 1080, 1440, 1920, 2400],
    imageSizes: [96, 160, 240, 320],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  async redirects() {
    // Old streetwear URLs.
    return [
      { source: '/drops', destination: '/new', permanent: true },
      { source: '/shop/hoodies/:path*', destination: '/shop/knitwear', permanent: true },
      { source: '/shop/tees/:path*', destination: '/shop/shirts', permanent: true },
      { source: '/shop/pants/:path*', destination: '/shop/trousers', permanent: true },
    ];
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};

export default nextConfig;

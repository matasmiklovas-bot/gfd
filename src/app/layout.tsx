import type { Metadata, Viewport } from 'next';
import './globals.css';
import { SITE } from '@/lib/site';
import { getAllSummaries } from '@/lib/commerce';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileMenu } from '@/components/layout/MobileMenu';
import { SearchOverlay } from '@/components/layout/SearchOverlay';
import { CartDrawer } from '@/components/layout/CartDrawer';
import { CookieBanner } from '@/components/layout/CookieBanner';
import { JsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: 'OSTREV — Minimalist streetwear. Built heavy. Worn loose.', template: '%s — OSTREV' },
  description: SITE.description,
  applicationName: SITE.name,
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    locale: 'en_GB',
    url: '/',
    images: [{ url: '/og.jpg', width: 1200, height: 630, alt: 'OSTREV — Drop 01' }],
  },
  twitter: { card: 'summary_large_image' },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: '#0A0A0A',
  width: 'device-width',
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const products = await getAllSummaries();

  return (
    <html lang="en">
      <head>
        {/* Enables scroll-reveal styles only when JS and IntersectionObserver are available. */}
        <script
          dangerouslySetInnerHTML={{
            __html: "if('IntersectionObserver' in window)document.documentElement.classList.add('js')",
          }}
        />
      </head>
      <body>
        <a
          href="#main"
          className="label sr-only z-banner bg-ink px-4 py-3 text-white focus:not-sr-only focus:fixed focus:left-3 focus:top-3"
        >
          Skip to content
        </a>
        <AnnouncementBar />
        <Header />
        <main id="main" tabIndex={-1} className="focus:outline-none">
          {children}
        </main>
        <Footer />
        <MobileMenu />
        <SearchOverlay products={products} />
        <CartDrawer />
        <CookieBanner />
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: SITE.name,
            url: SITE.url,
            logo: `${SITE.url}/icon.svg`,
            email: SITE.email,
            sameAs: [SITE.instagram, SITE.tiktok],
          }}
        />
      </body>
    </html>
  );
}

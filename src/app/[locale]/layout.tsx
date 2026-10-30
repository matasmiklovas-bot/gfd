import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import '../globals.css';
import { SITE } from '@/lib/site';
import { LOCALES, LOCALE_META, alternates, isLocale } from '@/lib/locale';
import { getT } from '@/lib/dictionary';
import { getAllSummaries } from '@/lib/commerce';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HideOnCheckout } from '@/components/layout/HideOnCheckout';
import { MobileMenu } from '@/components/layout/MobileMenu';
import { SearchOverlay } from '@/components/layout/SearchOverlay';
import { CartDrawer } from '@/components/layout/CartDrawer';
import { CookieBanner } from '@/components/layout/CookieBanner';
import { JsonLd } from '@/components/seo/JsonLd';

type Props = { children: React.ReactNode; params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getT(locale);
  return {
    metadataBase: new URL(SITE.url),
    title: { default: t('meta.title'), template: '%s — OSTREV' },
    description: SITE.description[locale],
    applicationName: SITE.name,
    alternates: alternates(locale, '/'),
    openGraph: {
      type: 'website',
      siteName: SITE.name,
      locale: LOCALE_META[locale].og,
      url: alternates(locale, '/').canonical,
      images: [{ url: '/og.jpg', width: 1200, height: 630, alt: t('meta.title') }],
    },
    twitter: { card: 'summary_large_image' },
    formatDetection: { telephone: false },
  };
}

export const viewport: Viewport = {
  themeColor: '#0A0A0A',
  width: 'device-width',
  initialScale: 1,
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getT(locale);
  const products = await getAllSummaries(locale);

  return (
    <html lang={LOCALE_META[locale].htmlLang}>
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
          {t('a11y.skip')}
        </a>
        <AnnouncementBar />
        <Header />
        <main id="main" tabIndex={-1} className="focus:outline-none">
          {children}
        </main>
        <HideOnCheckout>
          <Footer locale={locale} />
        </HideOnCheckout>
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

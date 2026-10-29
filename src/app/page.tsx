import type { Metadata } from 'next';
import { getAllSummaries, sortForListing } from '@/lib/commerce';
import { SITE } from '@/lib/site';
import { Hero } from '@/components/home/Hero';
import { CategoryTiles, Editorial, Lookbook, Newsletter, SocialGrid } from '@/components/home/Sections';
import { ProductSlider } from '@/components/product/ProductSlider';
import { JsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

export default async function HomePage() {
  const products = sortForListing(await getAllSummaries()).filter((p) => !p.soldOut);
  const women = products.filter((p) => p.gender === 'women').slice(0, 8);
  const men = products.filter((p) => p.gender === 'men').slice(0, 8);

  return (
    <>
      <Hero />
      <CategoryTiles />
      <ProductSlider title="New in — Women" products={women} href="/women" linkLabel="View all" />
      <Editorial />
      <ProductSlider title="New in — Men" products={men} href="/men" linkLabel="View all" />
      <Lookbook />
      <SocialGrid />
      <Newsletter />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: SITE.name,
          url: SITE.url,
          potentialAction: {
            '@type': 'SearchAction',
            target: `${SITE.url}/search?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
          },
        }}
      />
    </>
  );
}

import type { Metadata } from 'next';
import { getAllSummaries, sortForListing } from '@/lib/commerce';
import { SITE } from '@/lib/site';
import { Hero } from '@/components/home/Hero';
import { CategoryTiles, DropCountdown, Editorial, Newsletter, SocialGrid } from '@/components/home/Sections';
import { ProductSlider } from '@/components/product/ProductSlider';
import { JsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

export default async function HomePage() {
  const products = await getAllSummaries();
  const newIn = sortForListing(products).filter((p) => !p.soldOut).slice(0, 8);

  return (
    <>
      <Hero pieces={products.length} />
      <ProductSlider title="New in" products={newIn} href="/shop" linkLabel="Shop all" />
      <CategoryTiles />
      <Editorial />
      <DropCountdown />
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

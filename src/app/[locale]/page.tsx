import type { Metadata } from 'next';
import { getAllSummaries, sortForListing } from '@/lib/commerce';
import { SITE } from '@/lib/site';
import { alternates, lp } from '@/lib/locale';
import { getT } from '@/lib/dictionary';
import { pageLocale, type LocaleParams } from '@/lib/pageLocale';
import { Hero } from '@/components/home/Hero';
import { CategoryTiles, Editorial, Lookbook, Newsletter, SocialGrid } from '@/components/home/Sections';
import { ProductSlider } from '@/components/product/ProductSlider';
import { JsonLd } from '@/components/seo/JsonLd';

type Props = { params: LocaleParams };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { alternates: alternates(await pageLocale(params), '/') };
}

export default async function HomePage({ params }: Props) {
  const locale = await pageLocale(params);
  const t = getT(locale);
  const products = sortForListing(await getAllSummaries(locale)).filter((p) => !p.soldOut);
  const women = products.filter((p) => p.gender === 'women').slice(0, 8);
  const men = products.filter((p) => p.gender === 'men').slice(0, 8);

  return (
    <>
      <Hero locale={locale} />
      <CategoryTiles locale={locale} />
      <ProductSlider title={t('home.newWomen')} products={women} href={lp(locale, '/women')} />
      <Editorial locale={locale} />
      <ProductSlider title={t('home.newMen')} products={men} href={lp(locale, '/men')} />
      <Lookbook locale={locale} />
      <SocialGrid locale={locale} />
      <Newsletter locale={locale} />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: SITE.name,
          url: SITE.url,
          potentialAction: {
            '@type': 'SearchAction',
            target: `${SITE.url}${lp(locale, '/search')}?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
          },
        }}
      />
    </>
  );
}

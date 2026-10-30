import type { Metadata } from 'next';
import { getAllSummaries } from '@/lib/commerce';
import { alternates } from '@/lib/locale';
import { getT } from '@/lib/dictionary';
import { pageLocale, type LocaleParams } from '@/lib/pageLocale';
import { CollectionHeader } from '@/components/product/CollectionHeader';
import { CollectionView } from '@/components/product/CollectionView';

type Props = { params: LocaleParams };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await pageLocale(params);
  const t = getT(locale);
  return { title: t('shop.metaTitle'), description: t('shop.metaDescription'), alternates: alternates(locale, '/shop') };
}

export default async function ShopPage({ params }: Props) {
  const locale = await pageLocale(params);
  const products = await getAllSummaries(locale);
  return (
    <>
      <CollectionHeader title={getT(locale)('nav.shop')} />
      <CollectionView products={products} />
    </>
  );
}

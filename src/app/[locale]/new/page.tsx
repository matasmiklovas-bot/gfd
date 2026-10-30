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
  return { title: t('nav.newIn'), description: t('new.metaDescription'), alternates: alternates(locale, '/new') };
}

export default async function NewPage({ params }: Props) {
  const locale = await pageLocale(params);
  const t = getT(locale);
  const products = (await getAllSummaries(locale)).filter((p) => p.isNew);
  return (
    <>
      <CollectionHeader title={t('nav.newIn')} description={t('new.intro')} showNav={false} />
      <CollectionView products={products} quickCategories />
    </>
  );
}

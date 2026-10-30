import type { Metadata } from 'next';
import { getGenders, getProductsByGender, toSummary } from '@/lib/commerce';
import { alternates } from '@/lib/locale';
import { getT } from '@/lib/dictionary';
import { pageLocale, type LocaleParams } from '@/lib/pageLocale';
import { CollectionHeader } from '@/components/product/CollectionHeader';
import { CollectionView } from '@/components/product/CollectionView';
import { GenderNav } from '@/components/product/GenderNav';

type Props = { params: LocaleParams };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await pageLocale(params);
  const meta = getGenders(locale).find((g) => g.slug === 'men')!;
  return {
    title: meta.label,
    description: getT(locale)('meta.genderDescription', { description: meta.description, name: meta.label.toLowerCase() }),
    alternates: alternates(locale, '/men'),
  };
}

export default async function MenPage({ params }: Props) {
  const locale = await pageLocale(params);
  const meta = getGenders(locale).find((g) => g.slug === 'men')!;
  const products = (await getProductsByGender('men', locale)).map((p) => toSummary(p, locale));
  return (
    <>
      <CollectionHeader title={meta.label} description={meta.description} nav={<GenderNav gender="men" locale={locale} />} />
      <CollectionView products={products} showGenderFilter={false} />
    </>
  );
}

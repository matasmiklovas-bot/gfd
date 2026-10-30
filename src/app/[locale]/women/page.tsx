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
  const meta = getGenders(locale).find((g) => g.slug === 'women')!;
  return {
    title: meta.label,
    description: getT(locale)('meta.genderDescription', { description: meta.description, name: meta.label.toLowerCase() }),
    alternates: alternates(locale, '/women'),
  };
}

export default async function WomenPage({ params }: Props) {
  const locale = await pageLocale(params);
  const meta = getGenders(locale).find((g) => g.slug === 'women')!;
  const products = (await getProductsByGender('women', locale)).map((p) => toSummary(p, locale));
  return (
    <>
      <CollectionHeader title={meta.label} description={meta.description} nav={<GenderNav gender="women" locale={locale} />} />
      <CollectionView products={products} showGenderFilter={false} />
    </>
  );
}

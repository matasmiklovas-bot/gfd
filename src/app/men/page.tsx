import type { Metadata } from 'next';
import { GENDERS, getProductsByGender, toSummary } from '@/lib/commerce';
import { CollectionHeader } from '@/components/product/CollectionHeader';
import { CollectionView } from '@/components/product/CollectionView';
import { GenderNav } from '@/components/product/GenderNav';

const meta = GENDERS.find((g) => g.slug === 'men')!;

export const metadata: Metadata = {
  title: meta.label,
  description: `${meta.description} Shop OSTREV menswear with free EU shipping over €60.`,
  alternates: { canonical: '/men' },
};

export default async function MenPage() {
  const products = (await getProductsByGender('men')).map(toSummary);
  return (
    <>
      <CollectionHeader title={meta.label} description={meta.description} nav={<GenderNav gender="men" />} />
      <CollectionView products={products} showGenderFilter={false} />
    </>
  );
}

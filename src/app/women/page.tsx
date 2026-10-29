import type { Metadata } from 'next';
import { GENDERS, getProductsByGender, toSummary } from '@/lib/commerce';
import { CollectionHeader } from '@/components/product/CollectionHeader';
import { CollectionView } from '@/components/product/CollectionView';
import { GenderNav } from '@/components/product/GenderNav';

const meta = GENDERS.find((g) => g.slug === 'women')!;

export const metadata: Metadata = {
  title: meta.label,
  description: `${meta.description} Shop OSTREV womenswear with free EU shipping over €60.`,
  alternates: { canonical: '/women' },
};

export default async function WomenPage() {
  const products = (await getProductsByGender('women')).map(toSummary);
  return (
    <>
      <CollectionHeader title={meta.label} description={meta.description} nav={<GenderNav gender="women" />} />
      <CollectionView products={products} showGenderFilter={false} />
    </>
  );
}

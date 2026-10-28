import type { Metadata } from 'next';
import { getAllSummaries } from '@/lib/commerce';
import { CollectionHeader } from '@/components/product/CollectionHeader';
import { CollectionView } from '@/components/product/CollectionView';

export const metadata: Metadata = {
  title: 'Shop all',
  description: 'Shop all OSTREV streetwear: heavyweight hoodies, oversized tees, wide-leg cargos and sweatpants. Free EU shipping over €60.',
  alternates: { canonical: '/shop' },
};

export default async function ShopPage() {
  const products = await getAllSummaries();
  return (
    <>
      <CollectionHeader title="Shop" />
      <CollectionView products={products} />
    </>
  );
}

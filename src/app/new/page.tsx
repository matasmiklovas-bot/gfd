import type { Metadata } from 'next';
import { getAllSummaries } from '@/lib/commerce';
import { CollectionHeader } from '@/components/product/CollectionHeader';
import { CollectionView } from '@/components/product/CollectionView';

export const metadata: Metadata = {
  title: 'New in',
  description: 'New in at OSTREV: the latest coats, knitwear, shirts and denim for women and men.',
  alternates: { canonical: '/new' },
};

export default async function NewPage() {
  const products = (await getAllSummaries()).filter((p) => p.isNew);
  return (
    <>
      <CollectionHeader title="New in" description="The latest arrivals for Autumn–Winter 2026." showNav={false} />
      <CollectionView products={products} quickCategories />
    </>
  );
}

import type { Metadata } from 'next';
import { getAllSummaries } from '@/lib/commerce';
import { CollectionHeader } from '@/components/product/CollectionHeader';
import { CollectionView } from '@/components/product/CollectionView';

export const metadata: Metadata = {
  title: 'New in',
  description: 'The latest OSTREV pieces. Heavyweight basics and limited graphics, made in single runs.',
  alternates: { canonical: '/new' },
};

export default async function NewPage() {
  const products = (await getAllSummaries()).filter((p) => p.isNew);
  return (
    <>
      <CollectionHeader title="New" description="Latest additions to Drop 01. Single runs." showNav={false} />
      <CollectionView products={products} />
    </>
  );
}

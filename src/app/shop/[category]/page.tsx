import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CATEGORIES, getProductsByCategory, isCategory, toSummary } from '@/lib/commerce';
import { CollectionHeader } from '@/components/product/CollectionHeader';
import { CollectionView } from '@/components/product/CollectionView';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

type Props = { params: Promise<{ category: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const meta = CATEGORIES.find((c) => c.slug === category);
  if (!meta) return {};
  return {
    title: meta.label,
    description: `${meta.description} Shop OSTREV ${meta.label.toLowerCase()} with free EU shipping over €60.`,
    alternates: { canonical: `/shop/${meta.slug}` },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  if (!isCategory(category)) notFound();
  const meta = CATEGORIES.find((c) => c.slug === category)!;
  const products = (await getProductsByCategory(category)).map(toSummary);

  return (
    <>
      <div className="container-site pt-6">
        <Breadcrumbs items={[{ href: '/', label: 'Home' }, { href: '/shop', label: 'Shop' }, { href: `/shop/${category}`, label: meta.label }]} />
      </div>
      <CollectionHeader title={meta.label} description={meta.description} current={category} />
      <CollectionView products={products} showCategoryFilter={false} />
    </>
  );
}

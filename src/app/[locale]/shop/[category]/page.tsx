import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CATEGORIES, getCategories, getProductsByCategory, isCategory, toSummary } from '@/lib/commerce';
import { alternates, lp } from '@/lib/locale';
import { getT } from '@/lib/dictionary';
import { pageLocale } from '@/lib/pageLocale';
import { CollectionHeader } from '@/components/product/CollectionHeader';
import { CollectionView } from '@/components/product/CollectionView';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

type Props = { params: Promise<{ locale: string; category: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await pageLocale(params);
  const { category } = await params;
  const meta = getCategories(locale).find((c) => c.slug === category);
  if (!meta) return {};
  return {
    title: meta.label,
    description: getT(locale)('meta.categoryDescription', { description: meta.description, name: meta.label.toLowerCase() }),
    alternates: alternates(locale, `/shop/${meta.slug}`),
  };
}

export default async function CategoryPage({ params }: Props) {
  const locale = await pageLocale(params);
  const { category } = await params;
  if (!isCategory(category)) notFound();
  const t = getT(locale);
  const meta = getCategories(locale).find((c) => c.slug === category)!;
  const products = (await getProductsByCategory(category, locale)).map((p) => toSummary(p, locale));

  return (
    <>
      <div className="container-site pt-6">
        <Breadcrumbs
          label={t('a11y.breadcrumb')}
          items={[
            { href: lp(locale, '/'), label: t('common.home') },
            { href: lp(locale, '/shop'), label: t('nav.shop') },
            { href: lp(locale, `/shop/${category}`), label: meta.label },
          ]}
        />
      </div>
      <CollectionHeader title={meta.label} description={meta.description} current={category} />
      <CollectionView products={products} showCategoryFilter={false} />
    </>
  );
}

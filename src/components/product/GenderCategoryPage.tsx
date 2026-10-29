import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CATEGORIES, GENDERS, categoriesFor, getProductsByGender, toSummary } from '@/lib/commerce';
import { MENU } from '@/lib/site';
import type { Gender } from '@/lib/types';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { CollectionHeader } from './CollectionHeader';
import { CollectionView } from './CollectionView';
import { GenderNav } from './GenderNav';

/** Shared by /women/[category] and /men/[category]. */
export async function genderCategoryParams(gender: Gender) {
  return categoriesFor(await getProductsByGender(gender)).map((c) => ({ category: c.slug }));
}

function labels(gender: Gender, category: string) {
  const meta = CATEGORIES.find((c) => c.slug === category);
  const menu = MENU[gender].find((m) => m.category === category);
  const g = GENDERS.find((x) => x.slug === gender)!;
  return meta ? { meta, label: menu?.label ?? meta.label, g } : undefined;
}

export function genderCategoryMetadata(gender: Gender, category: string): Metadata {
  const l = labels(gender, category);
  if (!l) return {};
  return {
    title: `${l.g.label}’s ${l.label.toLowerCase()}`,
    description: `${l.meta.description} Shop OSTREV ${l.g.label.toLowerCase()}’s ${l.label.toLowerCase()} with free EU shipping over €60.`,
    alternates: { canonical: `/${gender}/${category}` },
  };
}

export async function GenderCategoryPage({ gender, category }: { gender: Gender; category: string }) {
  const l = labels(gender, category);
  const products = (await getProductsByGender(gender)).filter((p) => p.category === category).map(toSummary);
  if (!l || products.length === 0) notFound();

  return (
    <>
      <div className="container-site pt-6">
        <Breadcrumbs
          items={[
            { href: '/', label: 'Home' },
            { href: `/${gender}`, label: l.g.label },
            { href: `/${gender}/${category}`, label: l.label },
          ]}
        />
      </div>
      <CollectionHeader eyebrow={l.g.label} title={l.label} nav={<GenderNav gender={gender} current={category} />} />
      <CollectionView products={products} showCategoryFilter={false} showGenderFilter={false} />
    </>
  );
}

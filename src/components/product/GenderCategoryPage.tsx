import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { categoriesFor, getCategories, getGenders, getProductsByGender, toSummary } from '@/lib/commerce';
import { MENU } from '@/lib/site';
import { alternates, lp, type Locale } from '@/lib/locale';
import { getT } from '@/lib/dictionary';
import type { Gender } from '@/lib/types';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { CollectionHeader } from './CollectionHeader';
import { CollectionView } from './CollectionView';
import { GenderNav } from './GenderNav';

/** Shared by /women/[category] and /men/[category]; the layout supplies the locale. */
export async function genderCategoryParams(gender: Gender) {
  return categoriesFor(await getProductsByGender(gender)).map((c) => ({ category: c.slug }));
}

function labels(gender: Gender, category: string, locale: Locale) {
  const meta = getCategories(locale).find((c) => c.slug === category);
  const menu = MENU[gender].find((m) => m.category === category);
  const g = getGenders(locale).find((x) => x.slug === gender)!;
  return meta ? { meta, label: menu?.label[locale] ?? meta.label, g } : undefined;
}

export function genderCategoryMetadata(gender: Gender, category: string, locale: Locale): Metadata {
  const l = labels(gender, category, locale);
  if (!l) return {};
  const title = locale === 'lt' ? `${l.label} ${l.g.label.toLowerCase()}` : `${l.g.label}’s ${l.label.toLowerCase()}`;
  return {
    title,
    description: getT(locale)('meta.categoryDescription', { description: l.meta.description, name: title.toLowerCase() }),
    alternates: alternates(locale, `/${gender}/${category}`),
  };
}

export async function GenderCategoryPage({ gender, category, locale }: { gender: Gender; category: string; locale: Locale }) {
  const l = labels(gender, category, locale);
  const products = (await getProductsByGender(gender, locale)).filter((p) => p.category === category).map((p) => toSummary(p, locale));
  if (!l || products.length === 0) notFound();
  const t = getT(locale);

  return (
    <>
      <div className="container-site pt-6">
        <Breadcrumbs
          label={t('a11y.breadcrumb')}
          items={[
            { href: lp(locale, '/'), label: t('common.home') },
            { href: lp(locale, `/${gender}`), label: l.g.label },
            { href: lp(locale, `/${gender}/${category}`), label: l.label },
          ]}
        />
      </div>
      <CollectionHeader eyebrow={l.g.label} title={l.label} nav={<GenderNav gender={gender} current={category} locale={locale} />} />
      <CollectionView products={products} showCategoryFilter={false} showGenderFilter={false} />
    </>
  );
}

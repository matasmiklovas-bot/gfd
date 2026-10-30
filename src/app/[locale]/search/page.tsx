import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllSummaries } from '@/lib/commerce';
import { searchProducts } from '@/lib/search';
import { lp } from '@/lib/locale';
import { COUNT, getT, plural } from '@/lib/dictionary';
import { pageLocale } from '@/lib/pageLocale';
import { ProductCard } from '@/components/product/ProductCard';

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<{ q?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: getT(await pageLocale(params))('search.title'), robots: { index: false, follow: true } };
}

export default async function SearchPage({ params, searchParams }: Props) {
  const locale = await pageLocale(params);
  const t = getT(locale);
  const q = ((await searchParams).q ?? '').slice(0, 100);
  const results = searchProducts(await getAllSummaries(locale), q);

  return (
    <div className="container-site pb-24 pt-10 md:pt-16">
      <h1 className="sr-only">{q ? t('search.h1', { q }) : t('search.title')}</h1>
      <form action={lp(locale, '/search')} role="search" className="max-w-2xl border-b border-ink">
        <label htmlFor="search-page-q" className="sr-only">
          {t('search.label')}
        </label>
        <input
          id="search-page-q"
          name="q"
          type="search"
          defaultValue={q}
          placeholder={t('nav.search')}
          className="h-16 w-full bg-transparent font-display text-3xl font-extrabold uppercase tracking-tight placeholder:text-concrete md:text-5xl"
        />
      </form>
      <p className="label mb-8 mt-6 text-muted" aria-live="polite">
        {q ? t('search.resultsFor', { count: plural(locale, results.length, COUNT.results), q }) : t('search.type')}
      </p>
      {q && results.length === 0 && (
        <Link href={lp(locale, '/shop')} className="btn-primary">
          {t('search.browse')}
        </Link>
      )}
      {results.length > 0 && <h2 className="sr-only">{t('search.results')}</h2>}
      <ul className="grid grid-cols-2 gap-x-3 gap-y-10 md:gap-x-4 lg:grid-cols-4">
        {results.map((p) => (
          <li key={p.handle}>
            <ProductCard product={p} />
          </li>
        ))}
      </ul>
    </div>
  );
}

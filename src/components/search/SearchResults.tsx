'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useT } from '@/lib/i18n';
import { lp } from '@/lib/locale';
import { useLocale } from '@/lib/useLocale';
import { COUNT, plural } from '@/lib/dictionary';
import { searchProducts } from '@/lib/search';
import { useProductIndex } from '@/lib/productIndex';
import { withBase } from '@/lib/basePath';
import { ProductCard } from '@/components/product/ProductCard';

/** The search page body. Runs in the browser so the page can be a static file (the static demo has no server). */
export function SearchResults() {
  const t = useT();
  const locale = useLocale();
  const q = (useSearchParams().get('q') ?? '').slice(0, 100);
  const products = useProductIndex(locale, q.length > 0);
  const results = products ? searchProducts(products, q) : [];
  const loading = q.length > 0 && products === null;

  return (
    <>
      <h1 className="sr-only">{q ? t('search.h1', { q }) : t('search.title')}</h1>
      <form action={withBase(lp(locale, '/search'))} role="search" className="max-w-2xl border-b border-ink">
        <label htmlFor="search-page-q" className="sr-only">
          {t('search.label')}
        </label>
        <input
          key={q}
          id="search-page-q"
          name="q"
          type="search"
          defaultValue={q}
          placeholder={t('nav.search')}
          className="h-16 w-full bg-transparent font-display text-3xl font-extrabold uppercase tracking-tight placeholder:text-concrete md:text-5xl"
        />
      </form>
      <p className="label mb-8 mt-6 text-muted" aria-live="polite" aria-busy={loading}>
        {!q ? t('search.type') : loading ? '' : t('search.resultsFor', { count: plural(locale, results.length, COUNT.results), q })}
      </p>
      {q && !loading && results.length === 0 && (
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
    </>
  );
}

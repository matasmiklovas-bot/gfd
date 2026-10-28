import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllSummaries } from '@/lib/commerce';
import { searchProducts } from '@/lib/search';
import { ProductCard } from '@/components/product/ProductCard';

export const metadata: Metadata = { title: 'Search', robots: { index: false, follow: true } };

type Props = { searchParams: Promise<{ q?: string }> };

export default async function SearchPage({ searchParams }: Props) {
  const q = ((await searchParams).q ?? '').slice(0, 100);
  const results = searchProducts(await getAllSummaries(), q);

  return (
    <div className="container-site pb-24 pt-10 md:pt-16">
      <form action="/search" role="search" className="max-w-2xl border-b border-ink">
        <label htmlFor="search-page-q" className="sr-only">Search products</label>
        <input
          id="search-page-q"
          name="q"
          type="search"
          defaultValue={q}
          placeholder="Search"
          className="h-16 w-full bg-transparent font-display text-3xl font-extrabold uppercase tracking-tight placeholder:text-concrete md:text-5xl"
        />
      </form>
      <p className="label mb-8 mt-6 text-muted" aria-live="polite">
        {q ? `${results.length} ${results.length === 1 ? 'result' : 'results'} for “${q}”` : 'Type to search'}
      </p>
      {q && results.length === 0 && (
        <Link href="/shop" className="btn-primary">Browse all products</Link>
      )}
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

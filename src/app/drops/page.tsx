import type { Metadata } from 'next';
import { getAllSummaries, sortForListing } from '@/lib/commerce';
import { DropCountdown } from '@/components/home/Sections';
import { ProductCard } from '@/components/product/ProductCard';

export const metadata: Metadata = {
  title: 'Drops',
  description: 'OSTREV releases in limited drops. Drop 01 is out now. Sign up to be notified when Drop 02 goes live.',
  alternates: { canonical: '/drops' },
};

export default async function DropsPage() {
  const products = sortForListing((await getAllSummaries()).filter((p) => p.drop === 'drop-01'));
  const soldOut = products.filter((p) => p.soldOut).length;

  return (
    <>
      <div className="container-site pb-10 pt-10 md:pb-16 md:pt-16">
        <p className="label mb-4 text-muted">How we release</p>
        <h1 className="heading-display">Drops</h1>
        <p className="mt-6 max-w-xl text-[15px] leading-7 md:text-base">
          We release in drops. Each one is a single production run. No restocks, no reruns. Sign up and you hear about it first.
        </p>
      </div>

      <DropCountdown />

      <section aria-labelledby="drop-01" className="container-site section">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 md:mb-12">
          <div>
            <p className="label mb-3 text-muted">Live now</p>
            <h2 id="drop-01" className="heading-1">Drop 01</h2>
          </div>
          <p className="label text-muted">
            {products.length} pieces · {soldOut} sold out
          </p>
        </div>
        <ul className="grid grid-cols-2 gap-x-3 gap-y-10 md:gap-x-4 lg:grid-cols-4 lg:gap-y-14">
          {products.map((p) => (
            <li key={p.handle}>
              <ProductCard product={p} />
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

'use client';

import Link from 'next/link';
import type { ProductSummary } from '@/lib/types';
import { wishlistStore } from '@/lib/store';
import { useMounted } from '@/lib/hooks';
import { ProductCard } from '@/components/product/ProductCard';

export function WishlistView({ products }: { products: ProductSummary[] }) {
  const mounted = useMounted();
  const handles = wishlistStore.useStore((s) => s.handles);
  const saved = handles.map((h) => products.find((p) => p.handle === h)).filter((p): p is ProductSummary => Boolean(p));

  return (
    <div className="container-site pb-24 pt-10 md:pt-16">
      <h1 className="heading-display">Wishlist</h1>
      {!mounted ? null : saved.length === 0 ? (
        <div className="py-16">
          <p className="text-muted">Nothing saved yet. Tap the heart on any product to keep it here.</p>
          <Link href="/shop" className="btn-primary mt-8">Shop now</Link>
        </div>
      ) : (
        <>
          <p className="label mb-8 mt-4 text-muted">{saved.length} saved</p>
          <ul className="grid grid-cols-2 gap-x-3 gap-y-10 md:gap-x-4 lg:grid-cols-4">
            {saved.map((p) => (
              <li key={p.handle}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

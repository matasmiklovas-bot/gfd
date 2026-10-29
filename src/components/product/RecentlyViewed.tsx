'use client';

import { useEffect } from 'react';
import type { ProductSummary } from '@/lib/types';
import { recent, recentStore } from '@/lib/store';
import { ProductSlider } from './ProductSlider';

/** Records the current product and lists the others this visitor opened (stored in this browser only). */
export function RecentlyViewed({ current, products }: { current: string; products: ProductSummary[] }) {
  const handles = recentStore.useStore((s) => s.handles);

  useEffect(() => recent.add(current), [current]);

  const items = handles
    .filter((h) => h !== current)
    .map((h) => products.find((p) => p.handle === h))
    .filter((p): p is ProductSummary => Boolean(p));

  if (items.length === 0) return null;
  return <ProductSlider title="Recently viewed" products={items} compact />;
}

'use client';

import { useEffect } from 'react';
import type { ProductSummary } from '@/lib/types';
import { recent, recentStore } from '@/lib/store';
import { ProductSlider } from './ProductSlider';
import { useT } from '@/lib/i18n';
import { useLocale } from '@/lib/useLocale';
import { useProductIndex } from '@/lib/productIndex';

/** Records the current product and lists the others this visitor opened (stored in this browser only). */
export function RecentlyViewed({ current }: { current: string }) {
  const t = useT();
  const handles = recentStore.useStore((s) => s.handles);
  const others = handles.filter((h) => h !== current);
  // The catalog is only fetched for visitors who have actually viewed other products.
  const products = useProductIndex(useLocale(), others.length > 0) ?? [];

  useEffect(() => recent.add(current), [current]);

  const items = others
    .map((h) => products.find((p) => p.handle === h))
    .filter((p): p is ProductSummary => Boolean(p));

  if (items.length === 0) return null;
  return <ProductSlider title={t('product.recent')} products={items} compact />;
}

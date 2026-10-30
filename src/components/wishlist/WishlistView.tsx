'use client';

import Link from 'next/link';
import type { ProductSummary } from '@/lib/types';
import { wishlistStore } from '@/lib/store';
import { useMounted } from '@/lib/hooks';
import { ProductCard } from '@/components/product/ProductCard';
import { useT } from '@/lib/i18n';
import { COUNT, plural } from '@/lib/dictionary';
import { lp } from '@/lib/locale';
import { useLocale } from '@/lib/useLocale';

export function WishlistView({ products }: { products: ProductSummary[] }) {
  const mounted = useMounted();
  const handles = wishlistStore.useStore((s) => s.handles);
  const saved = handles.map((h) => products.find((p) => p.handle === h)).filter((p): p is ProductSummary => Boolean(p));

  const t = useT();
  const locale = useLocale();
  return (
    <div className="container-site pb-24 pt-10 md:pt-16">
      <h1 className="heading-1">{t('nav.wishlist')}</h1>
      {!mounted ? null : saved.length === 0 ? (
        <div className="py-16">
          <p className="text-muted">{t('wish.empty')}</p>
          <Link href={lp(locale, '/shop')} className="btn-primary mt-8">
            {t('wish.shop')}
          </Link>
        </div>
      ) : (
        <>
          <h2 className="label mb-8 mt-4 text-muted">{plural(locale, saved.length, COUNT.saved)}</h2>
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

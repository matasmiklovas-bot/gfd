'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { ProductSummary } from '@/lib/types';
import { ArrowLeftIcon, ArrowRightIcon } from '@/components/ui/Icons';
import { ProductCard } from './ProductCard';

export function ProductSlider({
  title,
  products,
  href,
  linkLabel = 'View all',
  compact = false,
}: {
  title: string;
  products: ProductSummary[];
  href?: string;
  linkLabel?: string;
  /** Tighter vertical spacing for stacked sliders under a product. */
  compact?: boolean;
}) {
  const track = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  const update = useCallback(() => {
    const el = track.current;
    if (!el) return;
    setEdges({ start: el.scrollLeft <= 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 });
  }, []);

  useEffect(() => {
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [update]);

  const scroll = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' });
  };

  const arrow =
    'inline-flex h-11 w-11 items-center justify-center border border-ink transition-colors hover:bg-ink hover:text-white disabled:border-line disabled:text-concrete disabled:hover:bg-transparent';

  return (
    <section aria-label={title} className={compact ? 'py-10 md:py-14' : 'section'}>
      <div className="container-site mb-6 flex items-end justify-between gap-4 md:mb-10">
        <h2 className="heading-2">{title}</h2>
        <div className="flex items-center gap-4">
          {href && (
            <Link href={href} className="label link-underline">
              {linkLabel}
            </Link>
          )}
          <div className="hidden gap-2 md:flex">
            <button type="button" className={arrow} onClick={() => scroll(-1)} disabled={edges.start} aria-label="Previous products">
              <ArrowLeftIcon size={18} />
            </button>
            <button type="button" className={arrow} onClick={() => scroll(1)} disabled={edges.end} aria-label="Next products">
              <ArrowRightIcon size={18} />
            </button>
          </div>
        </div>
      </div>
      <ul
        ref={track}
        onScroll={update}
        className="scroll-row scroll-px-4 px-4 md:scroll-px-8 md:px-8 [&>li:last-child]:mr-4 md:[&>li:last-child]:mr-8"
      >
        {products.map((p) => (
          <li key={p.handle} className="w-[68%] shrink-0 snap-start sm:w-[40%] lg:w-[calc((100%-3rem)/4)]">
            <ProductCard product={p} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 40vw, 68vw" />
          </li>
        ))}
      </ul>
    </section>
  );
}

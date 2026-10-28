'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import type { Product, Size } from '@/lib/types';
import type { SizeTable } from '@/lib/sizeGuide';
import { cart, ui } from '@/lib/store';
import { useT } from '@/lib/i18n';
import { formatPrice, formatPriceShort } from '@/lib/money';
import { FREE_SHIPPING_THRESHOLD, FLAT_SHIPPING } from '@/lib/pricing';
import { AccordionItem } from '@/components/ui/Accordion';
import { Price } from '@/components/ui/Price';
import { SizeGuideModal } from './SizeGuideModal';
import { WishlistButton } from './WishlistButton';

const LOW_STOCK = 5;

export function ProductDetail({ product, url, sizeTables }: { product: Product; url: string; sizeTables: SizeTable[] }) {
  const t = useT();
  const firstAvailableColor =
    product.colors.find((c) => Object.values(product.stock[c.slug] ?? {}).some((n) => (n ?? 0) > 0)) ?? product.colors[0];
  const [color, setColor] = useState(firstAvailableColor.slug);
  const oneSize = product.sizes.length === 1;
  const [size, setSize] = useState<Size | null>(oneSize ? product.sizes[0] : null);
  const [error, setError] = useState(false);
  const [added, setAdded] = useState(false);
  const sizeGroup = useRef<HTMLDivElement>(null);

  const stockFor = (s: Size) => product.stock[color]?.[s] ?? 0;
  const colorObj = product.colors.find((c) => c.slug === color)!;
  const soldOut = Object.values(product.stock).every((sizes) => Object.values(sizes).every((n) => !n));
  const colorSoldOut = product.sizes.every((s) => stockFor(s) === 0);
  const selectedStock = size ? stockFor(size) : 0;
  const unavailable = soldOut || colorSoldOut || (size !== null && selectedStock === 0);

  function addToBag() {
    if (unavailable) return;
    if (!size) {
      setError(true);
      sizeGroup.current?.querySelector<HTMLButtonElement>('button[aria-disabled="false"]')?.focus();
      return;
    }
    cart.add({
      key: `${product.handle}:${color}:${size}`,
      handle: product.handle,
      name: product.name,
      url,
      image: product.images[0].src,
      color,
      colorName: colorObj.name,
      size,
      price: product.price,
      maxQuantity: selectedStock,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
    ui.open('cart');
  }

  const buttonLabel = soldOut || colorSoldOut
    ? t('product.soldOut')
    : size && selectedStock === 0
      ? t('product.soldOut')
      : added
        ? t('product.added')
        : t('product.add');

  const addButton = (extra = '') => (
    <button
      type="button"
      onClick={addToBag}
      disabled={unavailable}
      className={`btn-primary h-14 w-full text-[12px] ${extra}`}
    >
      {buttonLabel}
      {!unavailable && !added && <span aria-hidden="true">· {formatPrice(product.price)}</span>}
    </button>
  );

  return (
    <div className="pb-28 md:pb-0">
      <div className="flex items-start justify-between gap-4">
        <h1 className="font-display text-[28px] font-extrabold uppercase leading-[1.02] tracking-[-0.02em] md:text-[36px]">
          {product.name}
        </h1>
        <WishlistButton handle={product.handle} name={product.name} className="-mr-3 -mt-2 shrink-0" />
      </div>
      <div className="mt-3 flex items-center gap-3">
        <Price cents={product.price} className="text-[17px]" />
        {product.isNew && !soldOut && <span className="label bg-ink px-2 py-1 text-[10px] text-white">{t('product.new')}</span>}
        {soldOut && <span className="label border border-ink px-2 py-1 text-[10px]">{t('product.soldOut')}</span>}
      </div>
      <p className="mt-1 text-[12px] text-muted">VAT included.</p>
      <p className="mt-6 text-[15px] leading-7">{product.summary}</p>

      {/* Colour */}
      <fieldset className="mt-8">
        <legend className="label mb-3">
          Colour: <span className="text-muted">{colorObj.name}</span>
        </legend>
        <div className="flex flex-wrap gap-2">
          {product.colors.map((c) => {
            const active = c.slug === color;
            const out = product.sizes.every((s) => (product.stock[c.slug]?.[s] ?? 0) === 0);
            return (
              <button
                key={c.slug}
                type="button"
                onClick={() => {
                  setColor(c.slug);
                  setError(false);
                }}
                aria-pressed={active}
                aria-label={`${c.name}${out ? ', sold out' : ''}`}
                title={c.name}
                className={`relative h-11 w-11 border p-1 transition-colors ${active ? 'border-ink' : 'border-line hover:border-concrete'}`}
              >
                <span className="block h-full w-full border border-black/10" style={{ backgroundColor: c.hex }} />
                {out && <span className="absolute left-1/2 top-1/2 h-px w-[130%] -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-concrete" aria-hidden="true" />}
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Size */}
      {!oneSize && (
        <fieldset className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <legend className="label">
              Size{size && <span className="text-muted">: {size}</span>}
            </legend>
            <SizeGuideModal tables={sizeTables} />
          </div>
          <div ref={sizeGroup} className="grid grid-cols-6 gap-1.5" aria-describedby={error ? 'size-error' : undefined}>
            {product.sizes.map((s) => {
              const stock = stockFor(s);
              const out = stock === 0;
              const active = s === size;
              return (
                <button
                  key={s}
                  type="button"
                  aria-pressed={active}
                  aria-disabled={out}
                  aria-label={out ? `${s}, sold out` : s}
                  onClick={() => {
                    if (out) return;
                    setSize(s);
                    setError(false);
                  }}
                  className={`label relative h-12 border text-[12px] transition-colors ${
                    out
                      ? 'cursor-not-allowed border-line text-concrete line-through decoration-1'
                      : active
                        ? 'border-ink bg-ink text-white'
                        : 'border-line hover:border-ink'
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
          {error && (
            <p id="size-error" role="alert" className="mt-3 text-[13px] text-danger">
              {t('product.selectSize')}
            </p>
          )}
        </fieldset>
      )}

      <div className="mt-4 min-h-6" aria-live="polite">
        {size && selectedStock > 0 && selectedStock < LOW_STOCK && (
          <p className="text-[13px] font-semibold">{t('product.onlyLeft', { n: selectedStock })}</p>
        )}
      </div>

      {/* Desktop add to bag */}
      <div className="mt-2 hidden md:block">{addButton()}</div>

      {/* Mobile: sticky bottom bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 md:hidden">
        {addButton()}
      </div>

      <p className="mt-4 text-[13px] text-muted">
        Free EU shipping over {formatPriceShort(FREE_SHIPPING_THRESHOLD)}. 14-day returns.
      </p>

      <div className="mt-10 border-t border-line">
        <AccordionItem title="Description" defaultOpen>
          <p>{product.description}</p>
        </AccordionItem>
        <AccordionItem title="Fit & sizing">
          <p>{product.fit}</p>
          {sizeTables.length > 0 && <p className="mt-3 text-muted">Exact measurements are in the size guide.</p>}
        </AccordionItem>
        <AccordionItem title="Material & care">
          <p>{product.material}</p>
          <ul className="mt-3 list-disc space-y-1 pl-5">
            {product.care.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </AccordionItem>
        <AccordionItem title="Shipping & returns">
          <p>
            EU delivery in 2–5 working days. {formatPrice(FLAT_SHIPPING)} flat rate, free over {formatPriceShort(FREE_SHIPPING_THRESHOLD)}.
            Orders placed before 14:00 (Vilnius time) on working days ship the same day.
          </p>
          <p className="mt-3">
            Return unworn items within 14 days of delivery for a full refund.{' '}
            <Link href="/help/returns" className="link-underline">Returns policy</Link>
          </p>
        </AccordionItem>
      </div>
    </div>
  );
}

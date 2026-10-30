'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useRef } from 'react';
import { useT } from '@/lib/i18n';
import { cart, cartStore, cartSubtotal, ui, uiStore } from '@/lib/store';
import { amountToFreeShipping, FREE_SHIPPING_THRESHOLD } from '@/lib/pricing';
import { formatPrice } from '@/lib/money';
import { lp, splitLocale } from '@/lib/locale';
import { useLocale } from '@/lib/useLocale';
import { useDialogBehavior, useScrollLock } from '@/lib/hooks';
import { CloseIcon } from '@/components/ui/Icons';
import { Price } from '@/components/ui/Price';
import { QuantityStepper } from '@/components/ui/QuantityStepper';

export function CartDrawer() {
  const t = useT();
  const locale = useLocale();
  // Lines keep the URL from when they were added; point them at the current language.
  const href = (url: string) => lp(locale, splitLocale(url).path);
  const open = uiStore.useStore((s) => s.panel === 'cart');
  const lines = cartStore.useStore((s) => s.lines);
  const subtotal = cartStore.useStore(cartSubtotal);
  const ref = useRef<HTMLDivElement>(null);
  const close = useCallback(() => ui.close(), []);
  useScrollLock(open);
  useDialogBehavior(ref, open, close);

  const away = amountToFreeShipping(subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <div className={`fixed inset-0 z-drawer ${open ? 'visible' : 'invisible transition-[visibility] duration-300'}`} inert={!open}>
      <button
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        onClick={close}
        className={`absolute inset-0 bg-ink/40 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}
      />
      <div
        id="cart-drawer"
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        className={`absolute inset-y-0 right-0 flex w-full max-w-[440px] flex-col bg-white transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex h-header items-center justify-between border-b border-line px-5">
          <h2 id="cart-title" className="label">
            {t('cart.title')} {lines.length > 0 && <span className="text-muted">({lines.reduce((n, l) => n + l.quantity, 0)})</span>}
          </h2>
          <button
            type="button"
            onClick={close}
            className="-mr-3 inline-flex h-11 w-11 items-center justify-center"
            aria-label={t('nav.close')}
          >
            <CloseIcon />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-6 px-5 text-center">
            <p className="text-muted">{t('cart.empty')}</p>
            <Link href={lp(locale, '/shop')} onClick={close} className="btn-primary">
              {t('cart.continue')}
            </Link>
          </div>
        ) : (
          <>
            <div className="border-b border-line px-5 py-4">
              <p className="mb-3 text-[13px]" aria-live="polite">
                {away > 0 ? t('cart.away', { amount: formatPrice(away, locale) }) : t('cart.free')}
              </p>
              <div
                className="h-[2px] w-full bg-line"
                role="progressbar"
                aria-label={t('cart.progress')}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(progress)}
              >
                <div className="h-full bg-ink transition-[width] duration-500 ease-out" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <ul className="flex-1 divide-y divide-line overflow-y-auto px-5">
              {lines.map((line) => (
                <li key={line.key} className="flex gap-4 py-5">
                  <Link href={href(line.url)} onClick={close} className="relative aspect-[4/5] w-24 shrink-0 bg-bone">
                    <Image src={line.image} alt="" fill sizes="96px" className="object-cover" />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <Link href={href(line.url)} onClick={close} className="text-[14px] leading-snug hover:underline">
                        {line.name}
                      </Link>
                      <Price cents={line.price * line.quantity} className="shrink-0 text-[14px]" />
                    </div>
                    <p className="mt-1 text-[13px] text-muted">
                      {line.colorName} · {line.size}
                    </p>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <QuantityStepper
                        value={line.quantity}
                        max={line.maxQuantity}
                        label={line.name}
                        onChange={(q) => cart.setQuantity(line.key, q)}
                      />
                      <button
                        type="button"
                        onClick={() => cart.remove(line.key)}
                        className="label text-muted underline-offset-4 hover:text-ink hover:underline"
                      >
                        {t('cart.remove')}
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-line px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-5">
              <div className="mb-1 flex items-center justify-between">
                <span className="label">{t('cart.subtotal')}</span>
                <Price cents={subtotal} className="text-[15px] font-semibold" />
              </div>
              <p className="mb-4 text-[12px] text-muted">{t('cart.taxes')}</p>
              <Link href={lp(locale, '/checkout')} onClick={close} className="btn-primary w-full">
                {t('cart.checkout')}
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

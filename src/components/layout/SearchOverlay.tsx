'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import { useProductIndex } from '@/lib/productIndex';
import { searchProducts } from '@/lib/search';
import { useT } from '@/lib/i18n';
import { COUNT, plural } from '@/lib/dictionary';
import { lp } from '@/lib/locale';
import { useLocale } from '@/lib/useLocale';
import { ui, uiStore } from '@/lib/store';
import { useDialogBehavior, useScrollLock } from '@/lib/hooks';
import { CloseIcon, SearchIcon } from '@/components/ui/Icons';
import { Price } from '@/components/ui/Price';

const SUGGESTIONS = {
  en: ['Trench coat', 'Knit jumper', 'Wide leg jeans', 'Blazer', 'Dress'],
  lt: ['Paltas', 'Megztinis', 'Džinsai', 'Švarkas', 'Suknelė'],
};

export function SearchOverlay() {
  const t = useT();
  const locale = useLocale();
  const router = useRouter();
  const open = uiStore.useStore((s) => s.panel === 'search');
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const products = useProductIndex(locale, open);
  const deferred = useDeferredValue(query);
  const close = useCallback(() => ui.close(), []);
  useScrollLock(open);
  useDialogBehavior(ref, open, close);

  useEffect(() => {
    if (!open) setQuery('');
  }, [open]);

  const results = useMemo(() => (products ? searchProducts(products, deferred).slice(0, 8) : []), [products, deferred]);
  // Results wait for the index; the full results page (Enter) works without it.
  const hasQuery = deferred.trim().length > 0 && products !== null;

  return (
    <div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label={t('nav.search')}
      inert={!open}
      className={`fixed inset-0 z-overlay ${open ? 'visible' : 'invisible transition-[visibility] duration-300'}`}
    >
      <button
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        onClick={close}
        className={`absolute inset-0 bg-ink/40 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}
      />
      <div
        className={`relative max-h-[100dvh] overflow-y-auto bg-white transition-transform duration-300 ease-out ${
          open ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <form
          role="search"
          className="container-site flex h-16 items-center gap-3 border-b border-line md:h-20"
          onSubmit={(e) => {
            e.preventDefault();
            if (!query.trim()) return;
            close();
            router.push(lp(locale, `/search?q=${encodeURIComponent(query.trim())}`));
          }}
        >
          <SearchIcon className="shrink-0" />
          <label htmlFor="site-search" className="sr-only">{t('search.label')}</label>
          <input
            id="site-search"
            ref={inputRef}
            data-autofocus
            type="search"
            autoComplete="off"
            enterKeyHint="search"
            placeholder={t('nav.search')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-full flex-1 bg-transparent font-display text-xl font-bold uppercase tracking-tight placeholder:text-concrete md:text-3xl"
            aria-controls="search-results"
          />
          <button
            type="button"
            onClick={close}
            className="-mr-3 inline-flex h-11 w-11 items-center justify-center"
            aria-label={t('nav.close')}
          >
            <CloseIcon />
          </button>
        </form>

        <div className="container-site py-6 md:py-10" id="search-results" aria-live="polite">
          {!hasQuery && (
            <div>
              <p className="label mb-4 text-muted">{t('search.popular')}</p>
              <ul className="flex flex-wrap gap-2">
                {SUGGESTIONS[locale].map((s) => (
                  <li key={s}>
                    <button
                      type="button"
                      onClick={() => {
                        setQuery(s);
                        inputRef.current?.focus();
                      }}
                      className="label h-10 border border-line px-4 transition-colors hover:border-ink"
                    >
                      {s}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {hasQuery && results.length === 0 && (
            <p className="text-muted">{t('search.none', { q: deferred })}</p>
          )}

          {hasQuery && results.length > 0 && (
            <>
              <p className="label mb-4 text-muted">
                {plural(locale, results.length, COUNT.results)}
              </p>
              <ul className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-4 lg:grid-cols-8">
                {results.map((p) => (
                  <li key={p.handle}>
                    <Link href={p.url} onClick={close} className="group block">
                      <div className="relative aspect-[4/5] overflow-hidden bg-bone">
                        <Image
                          src={p.images[0].src}
                          alt={p.images[0].alt}
                          fill
                          sizes="(min-width: 1024px) 12vw, (min-width: 640px) 25vw, 50vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      </div>
                      <p className="mt-2 text-[13px] leading-snug">{p.name}</p>
                      <Price cents={p.price} className="text-[13px] text-muted" />
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

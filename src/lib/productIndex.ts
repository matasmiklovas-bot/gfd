'use client';

import { useEffect, useState } from 'react';
import type { ProductSummary } from './types';
import type { Locale } from './locale';
import { withBase } from './basePath';

// Every product as a summary, served statically by /api/search-index/[locale]. Fetched once per language per visit
// and only by the features that need the whole catalog (search, recently viewed), so it stays out of page HTML.
const indexes: Partial<Record<Locale, Promise<ProductSummary[]>>> = {};

function loadIndex(locale: Locale) {
  indexes[locale] ??= fetch(withBase(`/api/search-index/${locale}`, { page: false }))
    .then((r) => (r.ok ? (r.json() as Promise<ProductSummary[]>) : Promise.reject(new Error(String(r.status)))))
    .catch((e) => {
      delete indexes[locale];
      throw e;
    });
  return indexes[locale];
}

/** The catalog index for `locale` once `enabled`; null while loading, [] if it failed. */
export function useProductIndex(locale: Locale, enabled: boolean) {
  const [index, setIndex] = useState<{ locale: Locale; list: ProductSummary[] } | null>(null);
  useEffect(() => {
    if (!enabled) return;
    let live = true;
    loadIndex(locale)
      .then((list) => live && setIndex({ locale, list }))
      .catch(() => live && setIndex({ locale, list: [] }));
    return () => {
      live = false;
    };
  }, [locale, enabled]);
  return index?.locale === locale ? index.list : null;
}

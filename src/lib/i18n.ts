'use client';

import { translate, type TKey } from './dictionary';
import { useLocale } from './useLocale';

export type { TKey } from './dictionary';

/** Translator for client components; the language comes from the URL. */
export function useT() {
  const locale = useLocale();
  return (key: TKey, vars?: Record<string, string | number>) => translate(locale, key, vars);
}

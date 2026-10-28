'use client';

import { useT, type TKey } from '@/lib/i18n';

/** Translated interface string, usable from server components. */
export function T({ k, vars }: { k: TKey; vars?: Record<string, string | number> }) {
  const t = useT();
  return <>{t(k, vars)}</>;
}

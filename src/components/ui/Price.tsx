'use client';

import { formatPrice } from '@/lib/money';
import { useLocale } from '@/lib/useLocale';

export function Price({ cents, className = '' }: { cents: number; className?: string }) {
  const locale = useLocale();
  return <span className={`tabular-nums ${className}`}>{formatPrice(cents, locale)}</span>;
}

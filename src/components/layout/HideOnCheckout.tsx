'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { splitLocale } from '@/lib/locale';

/** Checkout keeps only what helps finish the order: no shop footer to wander off into. */
export function HideOnCheckout({ children }: { children: ReactNode }) {
  return splitLocale(usePathname() ?? '/').path === '/checkout' ? null : children;
}

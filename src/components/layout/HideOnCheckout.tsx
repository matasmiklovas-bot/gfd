'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

/** Checkout keeps only what helps finish the order: no shop footer to wander off into. */
export function HideOnCheckout({ children }: { children: ReactNode }) {
  return usePathname() === '/checkout' ? null : children;
}

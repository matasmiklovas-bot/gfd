'use client';

import { usePathname } from 'next/navigation';
import { splitLocale, type Locale } from './locale';

/** Current storefront language, read from the URL (/lt/... is Lithuanian). */
export function useLocale(): Locale {
  return splitLocale(usePathname() ?? '/').locale;
}

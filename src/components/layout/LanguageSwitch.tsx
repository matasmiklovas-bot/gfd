'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LOCALES, LOCALE_META, lp, splitLocale } from '@/lib/locale';

/** Links to the same page in the other language (/women ↔ /lt/women). */
export function LanguageSwitch() {
  const { locale, path } = splitLocale(usePathname() ?? '/');

  return (
    <nav aria-label="Language" className="flex items-center gap-1">
      {LOCALES.map((l, i) => (
        <span key={l} className="flex items-center gap-1">
          {i > 0 && <span aria-hidden="true" className="label text-concrete">/</span>}
          <Link
            href={lp(l, path)}
            hrefLang={LOCALE_META[l].htmlLang}
            lang={LOCALE_META[l].htmlLang}
            // Starts with the visible code so speech users can say what they see.
            aria-label={`${LOCALE_META[l].label} – ${LOCALE_META[l].name}`}
            aria-current={locale === l ? 'true' : undefined}
            className={`label inline-flex h-9 min-w-9 items-center justify-center px-1 transition-colors ${
              locale === l ? 'text-current underline underline-offset-4' : 'opacity-60 hover:opacity-100'
            }`}
          >
            {LOCALE_META[l].label}
          </Link>
        </span>
      ))}
    </nav>
  );
}

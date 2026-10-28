'use client';

import { useEffect } from 'react';
import { prefsStore, type Locale } from '@/lib/store';

const LOCALES: { code: Locale; label: string; name: string }[] = [
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'lt', label: 'LT', name: 'Lietuvių' },
];

export function LanguageSwitch() {
  const locale = prefsStore.useStore((s) => s.locale);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <div role="group" aria-label="Language" className="flex items-center gap-1">
      {LOCALES.map((l, i) => (
        <span key={l.code} className="flex items-center gap-1">
          {i > 0 && <span aria-hidden="true" className="label text-concrete">/</span>}
          <button
            type="button"
            lang={l.code}
            aria-label={l.name}
            aria-pressed={locale === l.code}
            onClick={() => prefsStore.set({ locale: l.code })}
            className={`label inline-flex h-9 min-w-9 items-center justify-center px-1 transition-colors ${
              locale === l.code ? 'text-current underline underline-offset-4' : 'opacity-60 hover:opacity-100'
            }`}
          >
            {l.label}
          </button>
        </span>
      ))}
    </div>
  );
}

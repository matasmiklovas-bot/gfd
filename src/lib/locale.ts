/**
 * Two storefront languages. English lives at the root (/women), Lithuanian under /lt (/lt/women).
 * src/middleware.ts rewrites un-prefixed URLs to the [locale]=en route internally.
 */
export const LOCALES = ['en', 'lt'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';

export const LOCALE_META: Record<Locale, { label: string; name: string; htmlLang: string; og: string; intl: string }> = {
  en: { label: 'EN', name: 'English', htmlLang: 'en', og: 'en_GB', intl: 'en-IE' },
  lt: { label: 'LT', name: 'Lietuvių', htmlLang: 'lt', og: 'lt_LT', intl: 'lt-LT' },
};

export function isLocale(value: string | undefined): value is Locale {
  return LOCALES.includes(value as Locale);
}

/** Localised path: lp('lt', '/women') -> '/lt/women'; English paths are unchanged. */
export function lp(locale: Locale, path: string) {
  if (locale === DEFAULT_LOCALE) return path;
  return path === '/' ? `/${locale}` : `/${locale}${path}`;
}

/** Splits '/lt/women' into { locale: 'lt', path: '/women' }. */
export function splitLocale(pathname: string): { locale: Locale; path: string } {
  // The default locale is un-prefixed in the browser, but during server rendering usePathname() returns the
  // middleware's rewritten path (/en/...), so strip that prefix too or server and client markup disagree.
  for (const l of LOCALES) {
    if (pathname === `/${l}`) return { locale: l, path: '/' };
    if (pathname.startsWith(`/${l}/`)) return { locale: l, path: pathname.slice(l.length + 1) };
  }
  return { locale: DEFAULT_LOCALE, path: pathname };
}

/** Canonical URL for this locale plus hreflang alternates for every locale. */
export function alternates(locale: Locale, path: string) {
  return {
    canonical: lp(locale, path),
    languages: { ...Object.fromEntries(LOCALES.map((l) => [l, lp(l, path)])), 'x-default': path },
  };
}

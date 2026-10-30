import { LOCALE_META, type Locale } from './locale';

const formatters = new Map<string, Intl.NumberFormat>();
function fmt(locale: Locale, whole: boolean) {
  const key = `${locale}:${whole}`;
  if (!formatters.has(key)) {
    formatters.set(
      key,
      new Intl.NumberFormat(LOCALE_META[locale].intl, {
        style: 'currency',
        currency: 'EUR',
        ...(whole ? { maximumFractionDigits: 0 } : {}),
      }),
    );
  }
  return formatters.get(key)!;
}

/** Format euro cents: 3999 -> "€39.99" (en) or "39,99 €" (lt). */
export function formatPrice(cents: number, locale: Locale = 'en') {
  return fmt(locale, false).format(cents / 100);
}

export function centsToDecimal(cents: number) {
  return (cents / 100).toFixed(2);
}

/** Whole euros without decimals for copy ("free over €60"); falls back to formatPrice otherwise. */
export function formatPriceShort(cents: number, locale: Locale = 'en') {
  return cents % 100 === 0 ? fmt(locale, true).format(cents / 100) : formatPrice(cents, locale);
}

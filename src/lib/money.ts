const formatter = new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' });

/** Format euro cents, e.g. 3999 -> "€39.99". */
export function formatPrice(cents: number) {
  return formatter.format(cents / 100);
}

export function centsToDecimal(cents: number) {
  return (cents / 100).toFixed(2);
}

const short = new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });

/** Whole euros without decimals for copy ("free over €60"); falls back to formatPrice otherwise. */
export function formatPriceShort(cents: number) {
  return cents % 100 === 0 ? short.format(cents / 100) : formatPrice(cents);
}

/**
 * Discount codes. Imported through `discounts.ts` (server only) so codes never reach the client bundle; the static demo
 * build, which has no server, is the one exception and imports this file directly.
 * Move to Stripe promotion codes or Shopify discounts when connected.
 */
const CODES: Record<string, { percent: number }> = {
  WELCOME10: { percent: 10 },
};

export function lookupDiscount(code: string | undefined | null) {
  if (!code) return null;
  const normalized = code.trim().toUpperCase();
  const match = CODES[normalized];
  return match ? { code: normalized, percent: match.percent } : null;
}

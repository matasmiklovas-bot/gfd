import 'server-only';

/**
 * Server-side only so codes are never shipped in the client bundle.
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

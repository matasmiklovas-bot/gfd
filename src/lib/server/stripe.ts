import 'server-only';
import Stripe from 'stripe';

let client: Stripe | null = null;

/** Null when STRIPE_SECRET_KEY is not set: the store then runs checkout in demo mode. */
export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  client ??= new Stripe(key, { appInfo: { name: 'OSTREV storefront' } });
  return client;
}

import type Stripe from 'stripe';
import { getStripe } from '@/lib/server/stripe';

/**
 * Configure in Stripe → Developers → Webhooks:
 *   endpoint  https://ostrev.com/api/stripe/webhook
 *   events    checkout.session.completed, checkout.session.async_payment_succeeded,
 *             checkout.session.async_payment_failed
 */
export async function POST(req: Request) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) return new Response('Stripe not configured', { status: 501 });

  const signature = req.headers.get('stripe-signature');
  if (!signature) return new Response('Missing signature', { status: 400 });

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(await req.text(), signature, secret);
  } catch {
    return new Response('Invalid signature', { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed':
    case 'checkout.session.async_payment_succeeded': {
      const session = event.data.object;
      if (session.payment_status !== 'paid') break; // Klarna/bank methods confirm later.
      // TODO before launch: create the order in your OMS / Shopify, decrement stock,
      // send the confirmation email. This handler must be idempotent (Stripe retries).
      console.info('[order paid]', session.client_reference_id, session.id, session.amount_total);
      break;
    }
    case 'checkout.session.async_payment_failed':
      console.warn('[payment failed]', event.data.object.client_reference_id);
      break;
  }

  return new Response('ok');
}

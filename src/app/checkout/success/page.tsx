import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getStripe } from '@/lib/server/stripe';
import { formatPrice } from '@/lib/money';
import { OrderConfirmation } from '@/components/checkout/OrderConfirmation';

export const metadata: Metadata = {
  title: 'Order confirmed',
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ session_id?: string; order?: string; demo?: string }> };

export default async function SuccessPage({ searchParams }: Props) {
  const { session_id, order, demo } = await searchParams;

  let orderId: string | undefined;
  let email: string | undefined;
  let total: number | undefined;
  let pending = false;
  const isDemo = demo === '1' && !process.env.STRIPE_SECRET_KEY;

  if (session_id) {
    const stripe = getStripe();
    const session = await stripe?.checkout.sessions.retrieve(session_id).catch(() => null);
    if (!session) redirect('/');
    orderId = session.client_reference_id ?? session.id;
    email = session.customer_details?.email ?? session.customer_email ?? undefined;
    total = session.amount_total ?? undefined;
    pending = session.payment_status !== 'paid';
  } else if (isDemo && order && /^OST-[A-Z0-9]{1,8}$/.test(order)) {
    orderId = order;
  } else {
    redirect('/');
  }

  return (
    <div className="container-site flex min-h-[70vh] flex-col justify-center py-20">
      <OrderConfirmation orderId={orderId!} status={isDemo ? 'demo' : 'paid'} />
      <p className="label mb-4 text-muted">Order {orderId}</p>
      <h1 className="heading-display">{pending ? 'Almost there' : 'Thank you'}</h1>
      <div className="mt-8 max-w-lg space-y-3 text-[15px] leading-7">
        {pending ? (
          <p>Your payment is being confirmed by the provider. We will email you as soon as it clears.</p>
        ) : (
          <p>
            Your order is confirmed{email ? <> and a receipt is on its way to <strong>{email}</strong></> : null}. You will get
            a tracking link when it ships, usually within one working day.
          </p>
        )}
        {total !== undefined && <p>Total paid: {formatPrice(total)}</p>}
        {isDemo && (
          <p className="border border-ink px-4 py-3 text-[13px]">
            Demo mode: no payment provider is configured, so no money was taken. Set STRIPE_SECRET_KEY to accept real payments.
          </p>
        )}
      </div>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/shop" className="btn-primary">Continue shopping</Link>
        <Link href="/account" className="btn-secondary">Order history</Link>
      </div>
    </div>
  );
}

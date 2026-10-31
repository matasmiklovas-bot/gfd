import type { Metadata } from 'next';
import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getStripe } from '@/lib/server/stripe';
import { DemoSuccess, SuccessView } from '@/components/checkout/SuccessView';
import { SUCCESS_COPY as COPY } from '@/components/checkout/successCopy';
import { lp } from '@/lib/locale';
import { pageLocale } from '@/lib/pageLocale';

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ session_id?: string; order?: string; demo?: string }>;
};

export async function generateMetadata({ params }: Pick<Props, 'params'>): Promise<Metadata> {
  return { title: COPY[await pageLocale(params)].meta, robots: { index: false, follow: false } };
}

export default async function SuccessPage({ params, searchParams }: Props) {
  const locale = await pageLocale(params);
  const c = COPY[locale];
  // The static demo is plain files: the order number is read from the URL in the browser.
  if (process.env.NEXT_PUBLIC_STATIC_DEMO === '1') {
    return (
      <Suspense>
        <DemoSuccess locale={locale} copy={c} />
      </Suspense>
    );
  }
  const { session_id, order, demo } = await searchParams;

  let orderId: string | undefined;
  let email: string | undefined;
  let total: number | undefined;
  let pending = false;
  const isDemo = demo === '1' && !process.env.STRIPE_SECRET_KEY;

  if (session_id) {
    const stripe = getStripe();
    const session = await stripe?.checkout.sessions.retrieve(session_id).catch(() => null);
    if (!session) redirect(lp(locale, '/'));
    orderId = session.client_reference_id ?? session.id;
    email = session.customer_details?.email ?? session.customer_email ?? undefined;
    total = session.amount_total ?? undefined;
    pending = session.payment_status !== 'paid';
  } else if (isDemo && order && /^OST-[A-Z0-9]{1,8}$/.test(order)) {
    orderId = order;
  } else {
    redirect(lp(locale, '/'));
  }

  return <SuccessView locale={locale} copy={c} orderId={orderId!} email={email} total={total} pending={pending} isDemo={isDemo} />;
}

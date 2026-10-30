import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getStripe } from '@/lib/server/stripe';
import { formatPrice } from '@/lib/money';
import { OrderConfirmation } from '@/components/checkout/OrderConfirmation';
import { lp } from '@/lib/locale';
import { pageLocale } from '@/lib/pageLocale';

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ session_id?: string; order?: string; demo?: string }>;
};

const COPY = {
  en: {
    meta: 'Order confirmed',
    order: 'Order',
    pendingTitle: 'Almost there',
    title: 'Thank you',
    pending: 'Your payment is being confirmed by the provider. We will email you as soon as it clears.',
    confirmed: 'Your order is confirmed',
    receipt: 'and a receipt is on its way to',
    tracking: 'You will get a tracking link when it ships, usually within one working day.',
    total: 'Total paid',
    demo: 'Demo mode: no payment provider is configured, so no money was taken. Set STRIPE_SECRET_KEY to accept real payments.',
    continue: 'Continue shopping',
    history: 'Order history',
  },
  lt: {
    meta: 'Užsakymas patvirtintas',
    order: 'Užsakymas',
    pendingTitle: 'Beveik viskas',
    title: 'Ačiū',
    pending: 'Mokėjimo tarpininkas tvirtina jūsų mokėjimą. Kai tik jis bus patvirtintas, parašysime el. laišką.',
    confirmed: 'Jūsų užsakymas patvirtintas',
    receipt: ', o kvitą išsiuntėme adresu',
    tracking: 'Kai išsiųsime, gausite sekimo nuorodą – paprastai per vieną darbo dieną.',
    total: 'Sumokėta',
    demo: 'Demonstracinis režimas: mokėjimų tarpininkas nesukonfigūruotas, todėl pinigai nenuskaičiuoti. Tikriems mokėjimams nustatykite STRIPE_SECRET_KEY.',
    continue: 'Tęsti apsipirkimą',
    history: 'Užsakymų istorija',
  },
};

export async function generateMetadata({ params }: Pick<Props, 'params'>): Promise<Metadata> {
  return { title: COPY[await pageLocale(params)].meta, robots: { index: false, follow: false } };
}

export default async function SuccessPage({ params, searchParams }: Props) {
  const locale = await pageLocale(params);
  const c = COPY[locale];
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

  return (
    <div className="container-site flex min-h-[70vh] flex-col justify-center py-20">
      <OrderConfirmation orderId={orderId!} status={isDemo ? 'demo' : 'paid'} />
      <p className="label mb-4 text-muted">
        {c.order} {orderId}
      </p>
      <h1 className="heading-display">{pending ? c.pendingTitle : c.title}</h1>
      <div className="mt-8 max-w-lg space-y-3 text-[15px] leading-7">
        {pending ? (
          <p>{c.pending}</p>
        ) : (
          <p>
            {c.confirmed}
            {email ? (
              <>
                {locale === 'lt' ? '' : ' '}
                {c.receipt} <strong>{email}</strong>
              </>
            ) : null}
            . {c.tracking}
          </p>
        )}
        {total !== undefined && (
          <p>
            {c.total}: {formatPrice(total, locale)}
          </p>
        )}
        {isDemo && (
          <p className="border border-ink px-4 py-3 text-[13px]">
            {c.demo}
          </p>
        )}
      </div>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link href={lp(locale, '/shop')} className="btn-primary">
          {c.continue}
        </Link>
        <Link href={lp(locale, '/account')} className="btn-secondary">
          {c.history}
        </Link>
      </div>
    </div>
  );
}

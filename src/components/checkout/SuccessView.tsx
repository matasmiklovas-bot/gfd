'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { formatPrice } from '@/lib/money';
import { lp, type Locale } from '@/lib/locale';
import { OrderConfirmation } from './OrderConfirmation';
import type { SUCCESS_COPY } from './successCopy';

type Copy = (typeof SUCCESS_COPY)['en'];

export function SuccessView({
  locale,
  copy,
  orderId,
  email,
  total,
  pending,
  isDemo,
}: {
  locale: Locale;
  copy: Copy;
  orderId: string;
  email?: string;
  total?: number;
  pending: boolean;
  isDemo: boolean;
}) {
  return (
    <div className="container-site flex min-h-[70vh] flex-col justify-center py-20">
      <OrderConfirmation orderId={orderId} status={isDemo ? 'demo' : 'paid'} />
      <p className="label mb-4 text-muted">
        {copy.order} {orderId}
      </p>
      <h1 className="heading-display">{pending ? copy.pendingTitle : copy.title}</h1>
      <div className="mt-8 max-w-lg space-y-3 text-[15px] leading-7">
        {pending ? (
          <p>{copy.pending}</p>
        ) : (
          <p>
            {copy.confirmed}
            {email ? (
              <>
                {locale === 'lt' ? '' : ' '}
                {copy.receipt} <strong>{email}</strong>
              </>
            ) : null}
            . {copy.tracking}
          </p>
        )}
        {total !== undefined && (
          <p>
            {copy.total}: {formatPrice(total, locale)}
          </p>
        )}
        {isDemo && (
          <p className="border border-ink px-4 py-3 text-[13px]">
            {copy.demo}
          </p>
        )}
      </div>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link href={lp(locale, '/shop')} className="btn-primary">
          {copy.continue}
        </Link>
        <Link href={lp(locale, '/account')} className="btn-secondary">
          {copy.history}
        </Link>
      </div>
    </div>
  );
}

/** Static demo build: reads ?order= in the browser, since there is no server to render it. */
export function DemoSuccess({ locale, copy }: { locale: Locale; copy: Copy }) {
  const router = useRouter();
  const order = useSearchParams().get('order') ?? '';
  const valid = /^OST-[A-Z0-9]{1,8}$/.test(order);
  useEffect(() => {
    if (!valid) router.replace(lp(locale, '/'));
  }, [valid, router, locale]);
  if (!valid) return <div className="min-h-[70vh]" aria-busy="true" />;
  return <SuccessView locale={locale} copy={copy} orderId={order} pending={false} isDemo />;
}

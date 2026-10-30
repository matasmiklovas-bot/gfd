'use client';

import Link from 'next/link';
import { lp } from '@/lib/locale';
import { useLocale } from '@/lib/useLocale';

const COPY = {
  en: { title: 'Not here', body: 'This page does not exist, or it sold out and went with it.', shop: 'Shop', home: 'Home' },
  lt: { title: 'Puslapio nėra', body: 'Tokio puslapio nėra – gal prekė buvo išparduota ir puslapis dingo kartu su ja.', shop: 'Parduotuvė', home: 'Pradžia' },
};

export default function NotFound() {
  const locale = useLocale();
  const c = COPY[locale];
  return (
    <div className="container-site flex min-h-[70vh] flex-col justify-center py-20">
      <p className="label mb-4 text-muted">404</p>
      <h1 className="heading-display">{c.title}</h1>
      <p className="mt-6 max-w-sm text-[15px] text-muted">{c.body}</p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link href={lp(locale, '/shop')} className="btn-primary">
          {c.shop}
        </Link>
        <Link href={lp(locale, '/')} className="btn-secondary">
          {c.home}
        </Link>
      </div>
    </div>
  );
}

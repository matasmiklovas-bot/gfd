'use client';

import Link from 'next/link';
import { lp } from '@/lib/locale';
import { useLocale } from '@/lib/useLocale';

export function Logo({ className = '', onClick }: { className?: string; onClick?: () => void }) {
  const locale = useLocale();
  return (
    <Link
      href={lp(locale, '/')}
      onClick={onClick}
      aria-label={locale === 'lt' ? 'OSTREV — pradžia' : 'OSTREV — home'}
      className={`font-display text-[22px] font-black uppercase leading-none tracking-[-0.02em] md:text-[26px] ${className}`}
      style={{ fontStretch: '125%' }}
    >
      OSTREV
    </Link>
  );
}

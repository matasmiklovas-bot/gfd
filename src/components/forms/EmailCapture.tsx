'use client';

import Link from 'next/link';
import { useId, useState } from 'react';
import { useT } from '@/lib/i18n';
import { lp } from '@/lib/locale';
import { useLocale } from '@/lib/useLocale';

type Status = 'idle' | 'loading' | 'success' | 'error';

export function EmailCapture({
  source,
  cta,
  successMessage,
  dark = false,
}: {
  source: 'newsletter';
  cta: string;
  successMessage: React.ReactNode;
  dark?: boolean;
}) {
  const id = useId();
  const t = useT();
  const locale = useLocale();
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setStatus('loading');
    setError('');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.get('email'), source, company: form.get('company') }),
      });
      // The API answers in English; show our own message in the shopper's language.
      if (!res.ok) throw new Error(t(res.status === 422 ? 'form.invalidEmail' : 'form.failed'));
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : t('form.failed'));
    }
  }

  if (status === 'success') {
    return (
      <div role="status" className={`border px-4 py-4 text-[14px] ${dark ? 'border-white/30' : 'border-ink'}`}>
        {successMessage}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate={false} className="w-full">
      <div className="flex flex-col gap-2 sm:flex-row sm:gap-0">
        <label htmlFor={`${id}-email`} className="sr-only">{t('form.email')}</label>
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          placeholder={t('form.email')}
          aria-invalid={status === 'error'}
          aria-describedby={`${id}-help`}
          className={`input sm:flex-1 ${dark ? 'border-white/30 bg-transparent text-white placeholder:text-white/60 focus:border-white' : ''}`}
        />
        {/* Honeypot: hidden from people, filled by bots. */}
        <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
        <button type="submit" disabled={status === 'loading'} className={dark ? 'btn-inverse sm:w-auto' : 'btn-primary sm:w-auto'}>
          {status === 'loading' ? t('form.sending') : cta}
        </button>
      </div>
      <p id={`${id}-help`} className={`mt-3 text-[12px] leading-snug ${dark ? 'text-white/70' : 'text-muted'}`}>
        {status === 'error' ? (
          <span role="alert" className={dark ? 'text-white' : 'text-danger'}>{error}</span>
        ) : (
          <>
            {t('form.consent')}{' '}
            <Link href={lp(locale, '/legal/privacy')} className="underline underline-offset-2">{t('form.privacy')}</Link>.
          </>
        )}
      </p>
    </form>
  );
}

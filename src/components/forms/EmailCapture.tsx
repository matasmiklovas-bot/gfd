'use client';

import Link from 'next/link';
import { useId, useState } from 'react';

type Status = 'idle' | 'loading' | 'success' | 'error';

export function EmailCapture({
  source,
  cta,
  successMessage,
  dark = false,
}: {
  source: 'newsletter' | 'drop-notify';
  cta: string;
  successMessage: React.ReactNode;
  dark?: boolean;
}) {
  const id = useId();
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
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? 'Something went wrong. Try again.');
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Something went wrong. Try again.');
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
        <label htmlFor={`${id}-email`} className="sr-only">Email address</label>
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          placeholder="Email address"
          aria-invalid={status === 'error'}
          aria-describedby={`${id}-help`}
          className={`input sm:flex-1 ${dark ? 'border-white/30 bg-transparent text-white placeholder:text-white/60 focus:border-white' : ''}`}
        />
        {/* Honeypot: hidden from people, filled by bots. */}
        <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
        <button type="submit" disabled={status === 'loading'} className={dark ? 'btn-inverse sm:w-auto' : 'btn-primary sm:w-auto'}>
          {status === 'loading' ? 'Sending' : cta}
        </button>
      </div>
      <p id={`${id}-help`} className={`mt-3 text-[12px] leading-snug ${dark ? 'text-white/70' : 'text-muted'}`}>
        {status === 'error' ? (
          <span role="alert" className={dark ? 'text-white' : 'text-danger'}>{error}</span>
        ) : (
          <>
            By signing up you agree to receive emails from OSTREV. Unsubscribe any time. See our{' '}
            <Link href="/legal/privacy" className="underline underline-offset-2">privacy policy</Link>.
          </>
        )}
      </p>
    </form>
  );
}

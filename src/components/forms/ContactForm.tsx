'use client';

import { useState } from 'react';

const TOPICS = [
  { value: 'order', label: 'An order' },
  { value: 'returns', label: 'Returns' },
  { value: 'sizing', label: 'Sizing' },
  { value: 'wholesale', label: 'Wholesale' },
  { value: 'press', label: 'Press & collabs' },
  { value: 'other', label: 'Something else' },
];

export function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');
  const [fields, setFields] = useState<Record<string, string>>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    setStatus('loading');
    setError('');
    setFields({});
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setFields(body.fields ?? {});
        throw new Error(body.error ?? 'Message not sent.');
      }
      setStatus('sent');
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Message not sent.');
    }
  }

  if (status === 'sent') {
    return (
      <div role="status" className="border border-ink p-6">
        <p className="label mb-2">Message sent</p>
        <p className="text-[15px]">We reply within one working day.</p>
      </div>
    );
  }

  const err = (k: string) =>
    fields[k] ? (
      <p id={`c-${k}-e`} className="mt-1.5 text-[13px] text-danger">
        {fields[k]}
      </p>
    ) : null;

  return (
    <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2" noValidate>
      <div>
        <label htmlFor="c-name" className="field-label">Name</label>
        <input id="c-name" name="name" required autoComplete="name" className="input" aria-invalid={Boolean(fields.name)} aria-describedby={fields.name ? 'c-name-e' : undefined} />
        {err('name')}
      </div>
      <div>
        <label htmlFor="c-email" className="field-label">Email</label>
        <input id="c-email" name="email" type="email" required autoComplete="email" className="input" aria-invalid={Boolean(fields.email)} aria-describedby={fields.email ? 'c-email-e' : undefined} />
        {err('email')}
      </div>
      <div>
        <label htmlFor="c-topic" className="field-label">Topic</label>
        <select id="c-topic" name="topic" className="input cursor-pointer" defaultValue="order">
          {TOPICS.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="c-order" className="field-label">
          Order number <span className="normal-case tracking-normal">(optional)</span>
        </label>
        <input id="c-order" name="orderNumber" placeholder="OST-" className="input" />
      </div>
      <div className="md:col-span-2">
        <label htmlFor="c-message" className="field-label">Message</label>
        <textarea
          id="c-message"
          name="message"
          required
          rows={6}
          className="input h-auto py-3"
          aria-invalid={Boolean(fields.message)}
          aria-describedby={fields.message ? 'c-message-e' : undefined}
        />
        {err('message')}
      </div>
      <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
      {status === 'error' && (
        <p role="alert" className="text-[14px] text-danger md:col-span-2">{error}</p>
      )}
      <div className="md:col-span-2">
        <button type="submit" className="btn-primary w-full md:w-auto" disabled={status === 'loading'}>
          {status === 'loading' ? 'Sending' : 'Send message'}
        </button>
      </div>
    </form>
  );
}

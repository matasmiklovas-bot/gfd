'use client';

import { useState } from 'react';
import { useLocale } from '@/lib/useLocale';
import { useT } from '@/lib/i18n';

const COPY = {
  en: {
    topics: [
      ['order', 'An order'],
      ['returns', 'Returns'],
      ['sizing', 'Sizing'],
      ['wholesale', 'Wholesale'],
      ['press', 'Press & collabs'],
      ['other', 'Something else'],
    ],
    name: 'Name',
    email: 'Email',
    topic: 'Topic',
    order: 'Order number',
    optional: '(optional)',
    message: 'Message',
    send: 'Send message',
    sending: 'Sending',
    sent: 'Message sent',
    reply: 'We reply within one working day.',
    failed: 'Message not sent. Email us directly instead.',
    fields: { name: 'Enter your name.', email: 'Enter a valid email address.', message: 'Write at least a sentence.' },
  },
  lt: {
    topics: [
      ['order', 'Užsakymas'],
      ['returns', 'Grąžinimas'],
      ['sizing', 'Dydžiai'],
      ['wholesale', 'Didmeninė prekyba'],
      ['press', 'Spauda ir bendradarbiavimas'],
      ['other', 'Kita'],
    ],
    name: 'Vardas',
    email: 'El. paštas',
    topic: 'Tema',
    order: 'Užsakymo numeris',
    optional: '(neprivaloma)',
    message: 'Žinutė',
    send: 'Siųsti žinutę',
    sending: 'Siunčiama',
    sent: 'Žinutė išsiųsta',
    reply: 'Atsakysime per vieną darbo dieną.',
    failed: 'Žinutės išsiųsti nepavyko. Parašykite mums el. paštu.',
    fields: { name: 'Įveskite vardą.', email: 'Įveskite teisingą el. pašto adresą.', message: 'Parašykite bent vieną sakinį.' },
  },
};

type FieldKey = keyof (typeof COPY)['en']['fields'];

export function ContactForm() {
  const c = COPY[useLocale()];
  const t = useT();
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'error' | 'demo'>('idle');
  const [fields, setFields] = useState<FieldKey[]>([]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    setStatus('loading');
    setFields([]);
    if (process.env.NEXT_PUBLIC_STATIC_DEMO === '1') {
      setStatus('demo');
      return;
    }
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        // The API answers in English; show our own message for each field it flags.
        setFields(Object.keys(body.fields ?? {}).filter((k): k is FieldKey => k in c.fields));
        setStatus('error');
        return;
      }
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'sent') {
    return (
      <div role="status" className="border border-ink p-6">
        <p className="label mb-2">{c.sent}</p>
        <p className="text-[15px]">{c.reply}</p>
      </div>
    );
  }

  const invalid = (k: FieldKey) => fields.includes(k);
  const err = (k: FieldKey) =>
    invalid(k) ? (
      <p id={`c-${k}-e`} className="mt-1.5 text-[13px] text-danger">
        {c.fields[k]}
      </p>
    ) : null;

  return (
    <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2" noValidate>
      <div>
        <label htmlFor="c-name" className="field-label">
          {c.name}
        </label>
        <input id="c-name" name="name" required autoComplete="name" className="input" aria-invalid={invalid('name')} aria-describedby={invalid('name') ? 'c-name-e' : undefined} />
        {err('name')}
      </div>
      <div>
        <label htmlFor="c-email" className="field-label">
          {c.email}
        </label>
        <input id="c-email" name="email" type="email" required autoComplete="email" className="input" aria-invalid={invalid('email')} aria-describedby={invalid('email') ? 'c-email-e' : undefined} />
        {err('email')}
      </div>
      <div>
        <label htmlFor="c-topic" className="field-label">
          {c.topic}
        </label>
        <select id="c-topic" name="topic" className="input cursor-pointer" defaultValue="order">
          {c.topics.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="c-order" className="field-label">
          {c.order} <span className="normal-case tracking-normal">{c.optional}</span>
        </label>
        <input id="c-order" name="orderNumber" placeholder="OST-" className="input" />
      </div>
      <div className="md:col-span-2">
        <label htmlFor="c-message" className="field-label">
          {c.message}
        </label>
        <textarea
          id="c-message"
          name="message"
          required
          rows={6}
          className="input h-auto py-3"
          aria-invalid={invalid('message')}
          aria-describedby={invalid('message') ? 'c-message-e' : undefined}
        />
        {err('message')}
      </div>
      <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
      {(status === 'error' || status === 'demo') && fields.length === 0 && (
        <p role="alert" className="text-[14px] text-danger md:col-span-2">
          {status === 'demo' ? t('form.demoOff') : c.failed}
        </p>
      )}
      <div className="md:col-span-2">
        <button type="submit" className="btn-primary w-full md:w-auto" disabled={status === 'loading'}>
          {status === 'loading' ? c.sending : c.send}
        </button>
      </div>
    </form>
  );
}

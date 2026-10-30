'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useId, useState } from 'react';
import { accountStore, cartStore, cartSubtotal, PENDING_ORDER_KEY, type OrderRecord } from '@/lib/store';
import { orderTotals, FREE_SHIPPING_THRESHOLD } from '@/lib/pricing';
import { formatPrice } from '@/lib/money';
import { EU_COUNTRIES } from '@/lib/site';
import { LOCALE_META, lp, type Locale } from '@/lib/locale';
import { useLocale } from '@/lib/useLocale';
import { useMounted } from '@/lib/hooks';
import { ChevronDownIcon } from '@/components/ui/Icons';
import { Price } from '@/components/ui/Price';

const PAYMENT_METHODS = [
  { value: 'card', label: { en: 'Card', lt: 'Mokėjimo kortelė' }, note: { en: 'Visa, Mastercard, Amex', lt: 'Visa, Mastercard, Amex' } },
  { value: 'apple-pay', label: { en: 'Apple Pay', lt: 'Apple Pay' }, note: { en: 'Safari on Apple devices', lt: 'Safari Apple įrenginiuose' } },
  { value: 'google-pay', label: { en: 'Google Pay', lt: 'Google Pay' }, note: { en: 'Chrome and Android', lt: 'Chrome ir Android' } },
  { value: 'paypal', label: { en: 'PayPal', lt: 'PayPal' }, note: { en: 'Pay with your PayPal account', lt: 'Mokėkite PayPal paskyra' } },
  { value: 'klarna', label: { en: 'Klarna', lt: 'Klarna' }, note: { en: 'Pay later or in 3 instalments', lt: 'Mokėkite vėliau arba 3 dalimis' } },
] as const;

type FieldErrors = Partial<Record<string, string>>;

const COPY = {
  en: {
    optional: '(optional)',
    codeInvalid: 'This code is not valid.',
    failed: 'Something went wrong.',
    network: 'Network error. Check your connection and try again.',
    empty: 'Your bag is empty',
    shopNow: 'Shop now',
    discountCode: 'Discount code',
    apply: 'Apply',
    applied: (code: string, pct: number) => `${code} applied — ${pct}% off.`,
    remove: 'Remove',
    subtotal: 'Subtotal',
    discount: 'Discount',
    shipping: 'Shipping',
    free: 'Free',
    total: 'Total',
    vat: 'VAT included.',
    show: 'Show order summary',
    hide: 'Hide order summary',
    title: 'Checkout',
    contact: 'Contact',
    signIn: 'Sign in',
    email: 'Email',
    marketing: 'Email me about new collections and offers. Unsubscribe any time.',
    delivery: 'Delivery',
    country: 'Country',
    firstName: 'First name',
    lastName: 'Last name',
    address: 'Address',
    line2: 'Apartment, suite',
    postalCode: 'Postal code',
    city: 'City',
    phone: 'Phone',
    standard: 'EU standard',
    days: '2–5 working days',
    addMore: (amount: string) => `Add ${amount} more for free shipping.`,
    payment: 'Payment',
    stripe: 'You complete payment on Stripe’s secure page. We never see or store your card details.',
    processing: 'Processing',
    pay: (amount: string) => `Pay ${amount}`,
    agree: ['By placing your order you agree to our', 'Terms', 'and confirm you have read our', 'Privacy policy', '. You have 14 days to withdraw from the purchase after delivery.'],
    summary: 'Order summary',
  },
  lt: {
    optional: '(neprivaloma)',
    codeInvalid: 'Šis kodas negalioja.',
    failed: 'Kažkas nepavyko.',
    network: 'Ryšio klaida. Patikrinkite interneto ryšį ir bandykite dar kartą.',
    empty: 'Jūsų krepšelis tuščias',
    shopNow: 'Apsipirkti',
    discountCode: 'Nuolaidos kodas',
    apply: 'Pritaikyti',
    applied: (code: string, pct: number) => `${code} pritaikytas – ${pct} % nuolaida.`,
    remove: 'Pašalinti',
    subtotal: 'Tarpinė suma',
    discount: 'Nuolaida',
    shipping: 'Pristatymas',
    free: 'Nemokamai',
    total: 'Iš viso',
    vat: 'Su PVM.',
    show: 'Rodyti užsakymo santrauką',
    hide: 'Slėpti užsakymo santrauką',
    title: 'Apmokėjimas',
    contact: 'Kontaktai',
    signIn: 'Prisijungti',
    email: 'El. paštas',
    marketing: 'Siųskite man laiškus apie naujas kolekcijas ir pasiūlymus. Atsisakyti galiu bet kada.',
    delivery: 'Pristatymas',
    country: 'Šalis',
    firstName: 'Vardas',
    lastName: 'Pavardė',
    address: 'Adresas',
    line2: 'Butas, korpusas',
    postalCode: 'Pašto kodas',
    city: 'Miestas',
    phone: 'Telefonas',
    standard: 'Standartinis pristatymas ES',
    days: '2–5 darbo dienos',
    addMore: (amount: string) => `Pridėkite prekių už ${amount} ir pristatymas bus nemokamas.`,
    payment: 'Mokėjimas',
    stripe: 'Mokėjimą užbaigsite saugiame Stripe puslapyje. Mes niekada nematome ir nesaugome jūsų kortelės duomenų.',
    processing: 'Vykdoma',
    pay: (amount: string) => `Mokėti ${amount}`,
    agree: ['Pateikdami užsakymą sutinkate su mūsų', 'pirkimo taisyklėmis', 'ir patvirtinate, kad susipažinote su', 'privatumo politika', '. Per 14 dienų nuo pristatymo galite atsisakyti pirkimo.'],
    summary: 'Užsakymo santrauka',
  },
};

/** EU countries named and sorted in the shopper's language. */
function countries(locale: Locale) {
  const names = new Intl.DisplayNames([LOCALE_META[locale].intl], { type: 'region' });
  return EU_COUNTRIES.map(([code, name]) => [code, names.of(code) ?? name] as const).sort((a, b) =>
    a[1].localeCompare(b[1], LOCALE_META[locale].intl),
  );
}

function Field({
  name,
  label,
  error,
  className = '',
  optionalLabel,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { name: string; label: string; error?: string; optionalLabel?: string }) {
  const id = useId();
  return (
    <div className={className}>
      <label htmlFor={id} className="field-label">
        {label}
        {!props.required && optionalLabel && <span className="normal-case tracking-normal"> {optionalLabel}</span>}
      </label>
      <input
        id={id}
        name={name}
        className="input"
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-e` : undefined}
        {...props}
      />
      {error && (
        <p id={`${id}-e`} className="mt-1.5 text-[13px] text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

export function CheckoutForm() {
  const locale = useLocale();
  const c = COPY[locale];
  const L = (path: string) => lp(locale, path);
  const router = useRouter();
  const mounted = useMounted();
  const lines = cartStore.useStore((s) => s.lines);
  const subtotal = cartStore.useStore(cartSubtotal);
  const account = accountStore.useStore();
  const saved = account.addresses[0];

  const [payment, setPayment] = useState<(typeof PAYMENT_METHODS)[number]['value']>('card');
  const [code, setCode] = useState('');
  const [discount, setDiscount] = useState<{ code: string; percent: number } | null>(null);
  const [codeError, setCodeError] = useState('');
  const [codeLoading, setCodeLoading] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);

  const totals = orderTotals(subtotal, discount?.percent ?? 0);

  useEffect(() => {
    // Pre-fill a code captured from the newsletter success message (?code=WELCOME10).
    const fromUrl = new URLSearchParams(window.location.search).get('code');
    if (fromUrl) setCode(fromUrl);
  }, []);

  async function applyCode(e?: React.FormEvent) {
    e?.preventDefault();
    if (!code.trim()) return;
    setCodeLoading(true);
    setCodeError('');
    try {
      const res = await fetch('/api/discount', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setDiscount(data);
    } catch {
      setDiscount(null);
      // The API answers in English; any failure means the code was not accepted.
      setCodeError(c.codeInvalid);
    } finally {
      setCodeLoading(false);
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const get = (k: string) => String(f.get(k) ?? '');
    setSubmitting(true);
    setErrors({});
    setFormError('');

    const payload = {
      email: get('email'),
      marketing: f.get('marketing') === 'on',
      address: {
        firstName: get('firstName'),
        lastName: get('lastName'),
        line1: get('line1'),
        line2: get('line2'),
        city: get('city'),
        postalCode: get('postalCode'),
        country: get('country'),
        phone: get('phone'),
      },
      items: lines.map((l) => ({ handle: l.handle, color: l.color, size: l.size, quantity: l.quantity })),
      discountCode: discount?.code,
      paymentMethod: payment,
      locale,
    };

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors(data.fields ?? {});
        setFormError(data.error ?? c.failed);
        setSubmitting(false);
        const firstInvalid = data.fields ? Object.keys(data.fields)[0] : null;
        if (firstInvalid) document.querySelector<HTMLInputElement>(`[name="${firstInvalid}"]`)?.focus();
        return;
      }

      // Kept until the success page confirms, then moved into order history.
      const pending: OrderRecord = {
        id: data.order.id,
        createdAt: new Date().toISOString(),
        email: payload.email,
        lines: lines.map(({ name, colorName, size, quantity, price, image, url }) => ({ name, colorName, size, quantity, price, image, url })),
        subtotal: data.order.subtotal,
        discount: data.order.discount,
        shipping: data.order.shipping,
        total: data.order.total,
        status: data.mode === 'demo' ? 'demo' : 'paid',
      };
      try {
        sessionStorage.setItem(PENDING_ORDER_KEY, JSON.stringify(pending));
      } catch {
        /* storage blocked: order history just won't show this order */
      }

      if (data.mode === 'stripe') window.location.assign(data.url);
      else router.push(data.url);
    } catch {
      setFormError(c.network);
      setSubmitting(false);
    }
  }

  if (!mounted) return <div className="min-h-[60vh]" aria-busy="true" />;

  if (lines.length === 0) {
    return (
      <div className="container-site flex min-h-[60vh] flex-col items-center justify-center gap-6 py-24 text-center">
        <h1 className="heading-1">{c.empty}</h1>
        <Link href={L('/shop')} className="btn-primary">
          {c.shopNow}
        </Link>
      </div>
    );
  }

  const renderSummary = (prefix: string) => (
    <div>
      <ul className="divide-y divide-line">
        {lines.map((l) => (
          <li key={l.key} className="flex gap-4 py-4">
            <div className="relative aspect-[4/5] w-16 shrink-0 bg-bone">
              <Image src={l.image} alt="" fill sizes="64px" className="object-cover" />
              <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center bg-ink px-1 text-[11px] font-semibold text-white">
                {l.quantity}
              </span>
            </div>
            <div className="flex flex-1 justify-between gap-3 text-[14px]">
              <div>
                <p className="leading-snug">{l.name}</p>
                <p className="text-[13px] text-muted">
                  {l.colorName} · {l.size}
                </p>
              </div>
              <Price cents={l.price * l.quantity} />
            </div>
          </li>
        ))}
      </ul>

      <form onSubmit={applyCode} className="mt-4 border-t border-line pt-6">
        <label htmlFor={`${prefix}-discount-code`} className="field-label">
          {c.discountCode}
        </label>
        <div className="flex gap-2">
          <input
            id={`${prefix}-discount-code`}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="input uppercase"
            autoComplete="off"
            aria-invalid={Boolean(codeError)}
            aria-describedby={`${prefix}-discount-msg`}
          />
          <button type="submit" className="btn-secondary shrink-0" disabled={codeLoading || !code.trim()}>
            {c.apply}
          </button>
        </div>
        <p id={`${prefix}-discount-msg`} className="mt-2 min-h-5 text-[13px]" aria-live="polite">
          {codeError && <span className="text-danger">{codeError}</span>}
          {discount && !codeError && (
            <span>
              {c.applied(discount.code, discount.percent)}{' '}
              <button type="button" className="underline underline-offset-2" onClick={() => { setDiscount(null); setCode(''); }}>
                {c.remove}
              </button>
            </span>
          )}
        </p>
      </form>

      <dl className="mt-4 space-y-2 border-t border-line pt-6 text-[14px]">
        <div className="flex justify-between">
          <dt>{c.subtotal}</dt>
          <dd><Price cents={totals.subtotal} /></dd>
        </div>
        {totals.discount > 0 && (
          <div className="flex justify-between">
            <dt>{c.discount}</dt>
            <dd className="tabular-nums">−{formatPrice(totals.discount, locale)}</dd>
          </div>
        )}
        <div className="flex justify-between">
          <dt>{c.shipping}</dt>
          <dd>{totals.shipping === 0 ? c.free : <Price cents={totals.shipping} />}</dd>
        </div>
        <div className="flex justify-between border-t border-line pt-4 text-[16px] font-semibold">
          <dt>{c.total}</dt>
          <dd><Price cents={totals.total} /></dd>
        </div>
        <p className="text-[12px] text-muted">{c.vat}</p>
      </dl>
    </div>
  );

  return (
    <div className="lg:grid lg:min-h-screen lg:grid-cols-[1fr_440px] xl:grid-cols-[1fr_520px]">
      {/* Mobile summary toggle */}
      <div className="border-b border-line bg-bone lg:hidden">
        <button
          type="button"
          onClick={() => setSummaryOpen((o) => !o)}
          aria-expanded={summaryOpen}
          aria-controls="mobile-summary"
          className="container-site flex h-14 w-full items-center justify-between"
        >
          <span className="label flex items-center gap-2">
            {summaryOpen ? c.hide : c.show}
            <ChevronDownIcon size={16} className={`transition-transform ${summaryOpen ? 'rotate-180' : ''}`} />
          </span>
          <Price cents={totals.total} className="font-semibold" />
        </button>
        <div id="mobile-summary" hidden={!summaryOpen} className="container-site pb-6">
          {renderSummary('m')}
        </div>
      </div>

      <form onSubmit={onSubmit} noValidate className="container-site max-w-2xl py-10 lg:ml-auto lg:mr-0 lg:px-12 lg:py-14 xl:px-20">
        <h1 className="heading-1 mb-10">{c.title}</h1>

        <section aria-labelledby="contact-h" className="space-y-4">
          <div className="flex items-baseline justify-between">
            <h2 id="contact-h" className="label">
              {c.contact}
            </h2>
            {!account.user && (
              <Link href={L(`/account?next=${L('/checkout')}`)} className="text-[13px] text-muted underline underline-offset-2">
                {c.signIn}
              </Link>
            )}
          </div>
          <Field
            name="email"
            label={c.email}
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            defaultValue={account.user?.email}
            error={errors.email}
          />
          <label className="flex cursor-pointer items-start gap-3 text-[14px]">
            <input type="checkbox" name="marketing" className="mt-0.5 h-5 w-5 shrink-0 accent-ink" />
            <span>{c.marketing}</span>
          </label>
        </section>

        <section aria-labelledby="delivery-h" className="mt-12 space-y-4">
          <h2 id="delivery-h" className="label">
            {c.delivery}
          </h2>
          <div>
            <label htmlFor="country" className="field-label">
              {c.country}
            </label>
            <select
              id="country"
              name="country"
              required
              defaultValue={saved?.country ?? 'LT'}
              autoComplete="country"
              className="input cursor-pointer"
              aria-invalid={Boolean(errors.country)}
            >
              {countries(locale).map(([code, name]) => (
                <option key={code} value={code}>{name}</option>
              ))}
            </select>
            {errors.country && <p className="mt-1.5 text-[13px] text-danger">{errors.country}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field name="firstName" label={c.firstName} required autoComplete="given-name" defaultValue={saved?.name.split(' ')[0]} error={errors.firstName} />
            <Field name="lastName" label={c.lastName} required autoComplete="family-name" defaultValue={saved?.name.split(' ').slice(1).join(' ')} error={errors.lastName} />
          </div>
          <Field name="line1" label={c.address} required autoComplete="address-line1" defaultValue={saved?.line1} error={errors.line1} />
          <Field name="line2" label={c.line2} optionalLabel={c.optional} autoComplete="address-line2" defaultValue={saved?.line2} />
          <div className="grid grid-cols-2 gap-3">
            <Field name="postalCode" label={c.postalCode} required autoComplete="postal-code" defaultValue={saved?.postalCode} error={errors.postalCode} />
            <Field name="city" label={c.city} required autoComplete="address-level2" defaultValue={saved?.city} error={errors.city} />
          </div>
          <Field name="phone" label={c.phone} optionalLabel={c.optional} type="tel" autoComplete="tel" inputMode="tel" defaultValue={saved?.phone} />
        </section>

        <section aria-labelledby="shipping-h" className="mt-12">
          <h2 id="shipping-h" className="label mb-4">
            {c.shipping}
          </h2>
          <div className="flex items-center justify-between border border-ink px-4 py-4 text-[14px]">
            <div>
              <p className="font-semibold">{c.standard}</p>
              <p className="text-[13px] text-muted">{c.days}</p>
            </div>
            <span>{totals.shipping === 0 ? c.free : formatPrice(totals.shipping, locale)}</span>
          </div>
          {totals.shipping > 0 && (
            <p className="mt-2 text-[13px] text-muted">
              {c.addMore(formatPrice(FREE_SHIPPING_THRESHOLD - subtotal, locale))}
            </p>
          )}
        </section>

        <fieldset className="mt-12">
          <legend className="label mb-4">{c.payment}</legend>
          <div className="divide-y divide-line border border-line">
            {PAYMENT_METHODS.map((m) => (
              <label
                key={m.value}
                className={`flex min-h-14 cursor-pointer items-center gap-4 px-4 py-3 transition-colors ${
                  payment === m.value ? 'bg-bone' : 'hover:bg-bone/60'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value={m.value}
                  checked={payment === m.value}
                  onChange={() => setPayment(m.value)}
                  className="h-5 w-5 shrink-0 accent-ink"
                />
                <span className="flex-1">
                  <span className="block text-[14px] font-semibold">{m.label[locale]}</span>
                  <span className="block text-[13px] text-muted">{m.note[locale]}</span>
                </span>
              </label>
            ))}
          </div>
          <p className="mt-3 text-[13px] text-muted">
            {c.stripe}
          </p>
        </fieldset>

        {formError && (
          <p role="alert" className="mt-8 border border-danger px-4 py-3 text-[14px] text-danger">
            {formError}
          </p>
        )}

        <button type="submit" disabled={submitting} className="btn-primary mt-8 h-14 w-full text-[12px]">
          {submitting ? c.processing : c.pay(formatPrice(totals.total, locale))}
        </button>
        <p className="mt-4 text-[12px] leading-relaxed text-muted">
          {c.agree[0]}{' '}
          <Link href={L('/legal/terms')} className="underline underline-offset-2">
            {c.agree[1]}
          </Link>{' '}
          {c.agree[2]}{' '}
          <Link href={L('/legal/privacy')} className="underline underline-offset-2">
            {c.agree[3]}
          </Link>
          {c.agree[4]}
        </p>
      </form>

      <aside aria-label={c.summary} className="hidden border-l border-line bg-bone lg:block">
        <div className="sticky top-header px-10 py-14 xl:px-14">{renderSummary('d')}</div>
      </aside>
    </div>
  );
}

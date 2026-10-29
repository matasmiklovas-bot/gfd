'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useId, useState } from 'react';
import { accountStore, cartStore, cartSubtotal, PENDING_ORDER_KEY, type OrderRecord } from '@/lib/store';
import { orderTotals, FREE_SHIPPING_THRESHOLD } from '@/lib/pricing';
import { formatPrice } from '@/lib/money';
import { EU_COUNTRIES } from '@/lib/site';
import { useMounted } from '@/lib/hooks';
import { ChevronDownIcon } from '@/components/ui/Icons';
import { Price } from '@/components/ui/Price';

const PAYMENT_METHODS = [
  { value: 'card', label: 'Card', note: 'Visa, Mastercard, Amex' },
  { value: 'apple-pay', label: 'Apple Pay', note: 'Safari on Apple devices' },
  { value: 'google-pay', label: 'Google Pay', note: 'Chrome and Android' },
  { value: 'paypal', label: 'PayPal', note: 'Pay with your PayPal account' },
  { value: 'klarna', label: 'Klarna', note: 'Pay later or in 3 instalments' },
] as const;

type FieldErrors = Partial<Record<string, string>>;



function Field({
  name,
  label,
  error,
  className = '',
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { name: string; label: string; error?: string }) {
  const id = useId();
  return (
    <div className={className}>
      <label htmlFor={id} className="field-label">
        {label}
        {!props.required && <span className="normal-case tracking-normal"> (optional)</span>}
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
    } catch (err) {
      setDiscount(null);
      setCodeError(err instanceof Error ? err.message : 'This code is not valid.');
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
        setFormError(data.error ?? 'Something went wrong.');
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
      setFormError('Network error. Check your connection and try again.');
      setSubmitting(false);
    }
  }

  if (!mounted) return <div className="min-h-[60vh]" aria-busy="true" />;

  if (lines.length === 0) {
    return (
      <div className="container-site flex min-h-[60vh] flex-col items-center justify-center gap-6 py-24 text-center">
        <h1 className="heading-1">Your bag is empty</h1>
        <Link href="/shop" className="btn-primary">
          Shop now
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
        <label htmlFor={`${prefix}-discount-code`} className="field-label">Discount code</label>
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
            Apply
          </button>
        </div>
        <p id={`${prefix}-discount-msg`} className="mt-2 min-h-5 text-[13px]" aria-live="polite">
          {codeError && <span className="text-danger">{codeError}</span>}
          {discount && !codeError && (
            <span>
              {discount.code} applied — {discount.percent}% off.{' '}
              <button type="button" className="underline underline-offset-2" onClick={() => { setDiscount(null); setCode(''); }}>
                Remove
              </button>
            </span>
          )}
        </p>
      </form>

      <dl className="mt-4 space-y-2 border-t border-line pt-6 text-[14px]">
        <div className="flex justify-between">
          <dt>Subtotal</dt>
          <dd><Price cents={totals.subtotal} /></dd>
        </div>
        {totals.discount > 0 && (
          <div className="flex justify-between">
            <dt>Discount</dt>
            <dd className="tabular-nums">−{formatPrice(totals.discount)}</dd>
          </div>
        )}
        <div className="flex justify-between">
          <dt>Shipping</dt>
          <dd>{totals.shipping === 0 ? 'Free' : <Price cents={totals.shipping} />}</dd>
        </div>
        <div className="flex justify-between border-t border-line pt-4 text-[16px] font-semibold">
          <dt>Total</dt>
          <dd><Price cents={totals.total} /></dd>
        </div>
        <p className="text-[12px] text-muted">VAT included.</p>
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
            {summaryOpen ? 'Hide' : 'Show'} order summary
            <ChevronDownIcon size={16} className={`transition-transform ${summaryOpen ? 'rotate-180' : ''}`} />
          </span>
          <Price cents={totals.total} className="font-semibold" />
        </button>
        <div id="mobile-summary" hidden={!summaryOpen} className="container-site pb-6">
          {renderSummary('m')}
        </div>
      </div>

      <form onSubmit={onSubmit} noValidate className="container-site max-w-2xl py-10 lg:ml-auto lg:mr-0 lg:px-12 lg:py-14 xl:px-20">
        <h1 className="heading-1 mb-10">Checkout</h1>

        <section aria-labelledby="contact-h" className="space-y-4">
          <div className="flex items-baseline justify-between">
            <h2 id="contact-h" className="label">Contact</h2>
            {!account.user && (
              <Link href="/account?next=/checkout" className="text-[13px] text-muted underline underline-offset-2">
                Sign in
              </Link>
            )}
          </div>
          <Field
            name="email"
            label="Email"
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            defaultValue={account.user?.email}
            error={errors.email}
          />
          <label className="flex cursor-pointer items-start gap-3 text-[14px]">
            <input type="checkbox" name="marketing" className="mt-0.5 h-5 w-5 shrink-0 accent-ink" />
            <span>Email me about new collections and offers. Unsubscribe any time.</span>
          </label>
        </section>

        <section aria-labelledby="delivery-h" className="mt-12 space-y-4">
          <h2 id="delivery-h" className="label">Delivery</h2>
          <div>
            <label htmlFor="country" className="field-label">Country</label>
            <select
              id="country"
              name="country"
              required
              defaultValue={saved?.country ?? 'LT'}
              autoComplete="country"
              className="input cursor-pointer"
              aria-invalid={Boolean(errors.country)}
            >
              {EU_COUNTRIES.map(([code, name]) => (
                <option key={code} value={code}>{name}</option>
              ))}
            </select>
            {errors.country && <p className="mt-1.5 text-[13px] text-danger">{errors.country}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field name="firstName" label="First name" required autoComplete="given-name" defaultValue={saved?.name.split(' ')[0]} error={errors.firstName} />
            <Field name="lastName" label="Last name" required autoComplete="family-name" defaultValue={saved?.name.split(' ').slice(1).join(' ')} error={errors.lastName} />
          </div>
          <Field name="line1" label="Address" required autoComplete="address-line1" defaultValue={saved?.line1} error={errors.line1} />
          <Field name="line2" label="Apartment, suite" autoComplete="address-line2" defaultValue={saved?.line2} />
          <div className="grid grid-cols-2 gap-3">
            <Field name="postalCode" label="Postal code" required autoComplete="postal-code" defaultValue={saved?.postalCode} error={errors.postalCode} />
            <Field name="city" label="City" required autoComplete="address-level2" defaultValue={saved?.city} error={errors.city} />
          </div>
          <Field name="phone" label="Phone" type="tel" autoComplete="tel" inputMode="tel" defaultValue={saved?.phone} />
        </section>

        <section aria-labelledby="shipping-h" className="mt-12">
          <h2 id="shipping-h" className="label mb-4">Shipping</h2>
          <div className="flex items-center justify-between border border-ink px-4 py-4 text-[14px]">
            <div>
              <p className="font-semibold">EU standard</p>
              <p className="text-[13px] text-muted">2–5 working days</p>
            </div>
            <span>{totals.shipping === 0 ? 'Free' : formatPrice(totals.shipping)}</span>
          </div>
          {totals.shipping > 0 && (
            <p className="mt-2 text-[13px] text-muted">
              Add {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} more for free shipping.
            </p>
          )}
        </section>

        <fieldset className="mt-12">
          <legend className="label mb-4">Payment</legend>
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
                  <span className="block text-[14px] font-semibold">{m.label}</span>
                  <span className="block text-[13px] text-muted">{m.note}</span>
                </span>
              </label>
            ))}
          </div>
          <p className="mt-3 text-[13px] text-muted">
            You complete payment on Stripe&apos;s secure page. We never see or store your card details.
          </p>
        </fieldset>

        {formError && (
          <p role="alert" className="mt-8 border border-danger px-4 py-3 text-[14px] text-danger">
            {formError}
          </p>
        )}

        <button type="submit" disabled={submitting} className="btn-primary mt-8 h-14 w-full text-[12px]">
          {submitting ? 'Processing' : `Pay ${formatPrice(totals.total)}`}
        </button>
        <p className="mt-4 text-[12px] leading-relaxed text-muted">
          By placing your order you agree to our <Link href="/legal/terms" className="underline underline-offset-2">Terms</Link> and
          confirm you have read our <Link href="/legal/privacy" className="underline underline-offset-2">Privacy policy</Link>.
          You have 14 days to withdraw from the purchase after delivery.
        </p>
      </form>

      <aside aria-label="Order summary" className="hidden border-l border-line bg-bone lg:block">
        <div className="sticky top-header px-10 py-14 xl:px-14">{renderSummary('d')}</div>
      </aside>
    </div>
  );
}

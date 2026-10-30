'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { accountStore, type Address } from '@/lib/store';
import { EU_COUNTRIES } from '@/lib/site';
import { formatPrice } from '@/lib/money';
import { useMounted } from '@/lib/hooks';
import { LOCALE_META, lp, splitLocale, type Locale } from '@/lib/locale';
import { useLocale } from '@/lib/useLocale';

type Tab = 'orders' | 'addresses';

const COPY = {
  en: {
    title: 'Account',
    pitch: 'Track orders, save addresses and check out faster.',
    signIn: 'Sign in or create an account',
    name: 'Name',
    email: 'Email',
    continue: 'Continue',
    device: 'Your account details and order history are stored on this device.',
    hi: 'Hi',
    signOut: 'Sign out',
    sections: 'Account sections',
    orders: 'Orders',
    addresses: 'Addresses',
    noOrders: 'No orders yet.',
    shopNow: 'Shop now',
    demo: 'Demo order',
    paid: 'Paid',
    default: 'Default',
    makeDefault: 'Make default',
    remove: 'Remove',
    add: 'Add address',
    newAddress: 'New address',
    fullName: 'Full name',
    address: 'Address',
    line2: 'Apartment, suite (optional)',
    postalCode: 'Postal code',
    city: 'City',
    phone: 'Phone (optional)',
    country: 'Country',
    save: 'Save address',
    cancel: 'Cancel',
  },
  lt: {
    title: 'Paskyra',
    pitch: 'Sekite užsakymus, išsaugokite adresus ir apmokėkite greičiau.',
    signIn: 'Prisijunkite arba susikurkite paskyrą',
    name: 'Vardas',
    email: 'El. paštas',
    continue: 'Tęsti',
    device: 'Paskyros duomenys ir užsakymų istorija saugomi šiame įrenginyje.',
    hi: 'Labas',
    signOut: 'Atsijungti',
    sections: 'Paskyros skiltys',
    orders: 'Užsakymai',
    addresses: 'Adresai',
    noOrders: 'Užsakymų dar nėra.',
    shopNow: 'Apsipirkti',
    demo: 'Demonstracinis užsakymas',
    paid: 'Apmokėta',
    default: 'Pagrindinis',
    makeDefault: 'Padaryti pagrindiniu',
    remove: 'Pašalinti',
    add: 'Pridėti adresą',
    newAddress: 'Naujas adresas',
    fullName: 'Vardas ir pavardė',
    address: 'Adresas',
    line2: 'Butas, korpusas (neprivaloma)',
    postalCode: 'Pašto kodas',
    city: 'Miestas',
    phone: 'Telefonas (neprivaloma)',
    country: 'Šalis',
    save: 'Išsaugoti adresą',
    cancel: 'Atšaukti',
  },
};

type Copy = (typeof COPY)['en'];

function countryNames(locale: Locale) {
  const names = new Intl.DisplayNames([LOCALE_META[locale].intl], { type: 'region' });
  return EU_COUNTRIES.map(([code, name]) => [code, names.of(code) ?? name] as const).sort((a, b) =>
    a[1].localeCompare(b[1], LOCALE_META[locale].intl),
  );
}

/**
 * Customer account. Data lives on this device (localStorage) until a customer
 * backend is connected — Shopify Customer Accounts or your own auth + database.
 */
export function AccountView() {
  const locale = useLocale();
  const c = COPY[locale];
  const L = (path: string) => lp(locale, path);
  const countryName = (code: string) => countryNames(locale).find(([x]) => x === code)?.[1] ?? code;
  const mounted = useMounted();
  const router = useRouter();
  const { user, orders, addresses } = accountStore.useStore();
  const [tab, setTab] = useState<Tab>('orders');
  const [adding, setAdding] = useState(false);

  if (!mounted) return <div className="min-h-[60vh]" aria-busy="true" />;

  if (!user) {
    return (
      <div className="container-site grid gap-16 py-12 md:grid-cols-2 md:py-20">
        <div>
          <h1 className="heading-display">{c.title}</h1>
          <p className="mt-6 max-w-sm text-[15px] text-muted">{c.pitch}</p>
        </div>
        <form
          className="max-w-md space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            const f = new FormData(e.currentTarget);
            accountStore.set({ user: { email: String(f.get('email')).trim(), name: String(f.get('name')).trim() } });
            const next = new URLSearchParams(window.location.search).get('next');
            if (next?.startsWith('/') && !next.startsWith('//')) router.push(next);
          }}
        >
          <h2 className="label">{c.signIn}</h2>
          <div>
            <label htmlFor="acc-name" className="field-label">
              {c.name}
            </label>
            <input id="acc-name" name="name" required autoComplete="name" className="input" />
          </div>
          <div>
            <label htmlFor="acc-email" className="field-label">
              {c.email}
            </label>
            <input id="acc-email" name="email" type="email" required autoComplete="email" className="input" />
          </div>
          <button type="submit" className="btn-primary w-full">
            {c.continue}
          </button>
          <p className="text-[12px] leading-relaxed text-muted">{c.device}</p>
        </form>
      </div>
    );
  }

  const tabBtn = (t: Tab, label: string) => (
    <button
      type="button"
      role="tab"
      id={`tab-${t}`}
      aria-selected={tab === t}
      aria-controls={`panel-${t}`}
      onClick={() => setTab(t)}
      className={`label h-11 border-b-2 px-1 transition-colors ${tab === t ? 'border-ink' : 'border-transparent text-muted hover:text-ink'}`}
    >
      {label}
    </button>
  );

  return (
    <div className="container-site py-12 md:py-20">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="label mb-3 text-muted">{user.email}</p>
          <h1 className="heading-1">
            {c.hi}, {user.name.split(' ')[0]}
          </h1>
        </div>
        <button type="button" className="label text-muted underline underline-offset-4 hover:text-ink" onClick={() => accountStore.set({ user: null })}>
          {c.signOut}
        </button>
      </div>

      <div role="tablist" aria-label={c.sections} className="mt-10 flex gap-8 border-b border-line">
        {tabBtn('orders', `${c.orders} (${orders.length})`)}
        {tabBtn('addresses', `${c.addresses} (${addresses.length})`)}
      </div>

      {tab === 'orders' && (
        <section id="panel-orders" role="tabpanel" aria-labelledby="tab-orders" className="py-8">
          {orders.length === 0 ? (
            <div className="py-12">
              <p className="text-muted">{c.noOrders}</p>
              <Link href={L('/shop')} className="btn-primary mt-6">
                {c.shopNow}
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-line border-y border-line">
              {orders.map((o) => (
                <li key={o.id} className="py-6">
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <div>
                      <p className="label">{o.id}</p>
                      <p className="mt-1 text-[13px] text-muted">
                        {new Intl.DateTimeFormat(LOCALE_META[locale].intl, { dateStyle: 'medium' }).format(new Date(o.createdAt))} ·{' '}
                        {o.status === 'demo' ? c.demo : c.paid}
                      </p>
                    </div>
                    <p className="text-[15px] font-semibold tabular-nums">{formatPrice(o.total, locale)}</p>
                  </div>
                  <ul className="mt-4 flex flex-wrap gap-3">
                    {o.lines.map((l, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <Link href={L(splitLocale(l.url).path)} className="relative block aspect-[4/5] w-14 bg-bone">
                          <Image src={l.image} alt={l.name} fill sizes="56px" className="object-cover" />
                        </Link>
                        <span className="text-[13px] leading-snug">
                          {l.name}
                          <br />
                          <span className="text-muted">
                            {l.colorName} · {l.size} · ×{l.quantity}
                          </span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {tab === 'addresses' && (
        <section id="panel-addresses" role="tabpanel" aria-labelledby="tab-addresses" className="py-8">
          {addresses.length > 0 && (
            <ul className="grid gap-4 md:grid-cols-3">
              {addresses.map((a, i) => (
                <li key={a.id} className="border border-line p-5 text-[14px] leading-6">
                  {i === 0 && <p className="label mb-2 text-muted">{c.default}</p>}
                  <p className="font-semibold">{a.name}</p>
                  <p>{a.line1}</p>
                  {a.line2 && <p>{a.line2}</p>}
                  <p>
                    {a.postalCode} {a.city}
                  </p>
                  <p>{countryName(a.country)}</p>
                  {a.phone && <p className="text-muted">{a.phone}</p>}
                  <div className="mt-4 flex gap-4">
                    {i > 0 && (
                      <button
                        type="button"
                        className="label underline underline-offset-4"
                        onClick={() => accountStore.set((s) => ({ addresses: [a, ...s.addresses.filter((x) => x.id !== a.id)] }))}
                      >
                        {c.makeDefault}
                      </button>
                    )}
                    <button
                      type="button"
                      className="label text-muted underline underline-offset-4 hover:text-ink"
                      onClick={() => accountStore.set((s) => ({ addresses: s.addresses.filter((x) => x.id !== a.id) }))}
                    >
                      {c.remove}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {adding ? (
            <AddressForm
              c={c}
              countries={countryNames(locale)}
              onCancel={() => setAdding(false)}
              onSave={(a) => {
                accountStore.set((s) => ({ addresses: [...s.addresses, a] }));
                setAdding(false);
              }}
            />
          ) : (
            <button type="button" className="btn-secondary mt-8" onClick={() => setAdding(true)}>
              {c.add}
            </button>
          )}
        </section>
      )}
    </div>
  );
}

function AddressForm({
  c,
  countries,
  onSave,
  onCancel,
}: {
  c: Copy;
  countries: (readonly [string, string])[];
  onSave: (a: Address) => void;
  onCancel: () => void;
}) {
  return (
    <form
      className="mt-8 grid max-w-xl gap-4 md:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        const g = (k: string) => String(f.get(k) ?? '').trim();
        onSave({
          id: crypto.randomUUID(),
          name: g('name'),
          line1: g('line1'),
          line2: g('line2') || undefined,
          city: g('city'),
          postalCode: g('postalCode'),
          country: g('country'),
          phone: g('phone') || undefined,
        });
      }}
    >
      <h2 className="label md:col-span-2">{c.newAddress}</h2>
      {[
        { name: 'name', label: c.fullName, auto: 'name', span: true, required: true },
        { name: 'line1', label: c.address, auto: 'address-line1', span: true, required: true },
        { name: 'line2', label: c.line2, auto: 'address-line2', span: true },
        { name: 'postalCode', label: c.postalCode, auto: 'postal-code', required: true },
        { name: 'city', label: c.city, auto: 'address-level2', required: true },
        { name: 'phone', label: c.phone, auto: 'tel' },
      ].map((fld) => (
        <div key={fld.name} className={fld.span ? 'md:col-span-2' : ''}>
          <label htmlFor={`addr-${fld.name}`} className="field-label">{fld.label}</label>
          <input id={`addr-${fld.name}`} name={fld.name} autoComplete={fld.auto} required={fld.required} className="input" />
        </div>
      ))}
      <div>
        <label htmlFor="addr-country" className="field-label">
          {c.country}
        </label>
        <select id="addr-country" name="country" defaultValue="LT" className="input" autoComplete="country">
          {countries.map(([code, name]) => (
            <option key={code} value={code}>
              {name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex gap-3 md:col-span-2">
        <button type="submit" className="btn-primary">
          {c.save}
        </button>
        <button type="button" className="btn-secondary" onClick={onCancel}>
          {c.cancel}
        </button>
      </div>
    </form>
  );
}

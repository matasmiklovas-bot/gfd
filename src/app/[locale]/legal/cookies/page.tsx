import type { Metadata } from 'next';
import { ContentPage } from '@/components/content/ContentPage';
import { CookieSettingsLink } from '@/components/layout/CookieBanner';
import { alternates, type Locale } from '@/lib/locale';
import { pageLocale, type LocaleParams } from '@/lib/pageLocale';

type Props = { params: LocaleParams };
type Text = Record<Locale, string>;

const LOCAL: Text = { en: 'Local storage', lt: 'Vietinė saugykla' };
const NECESSARY: Text = { en: 'Necessary', lt: 'Būtini' };
const UNTIL_CLEARED: Text = { en: 'Until cleared', lt: 'Kol ištrinsite' };

// Keep this table in sync with what the site actually stores.
const ITEMS: { name: string; type: Text; purpose: Text; category: Text; duration: Text }[] = [
  {
    name: 'ostrev:consent',
    type: LOCAL,
    purpose: { en: 'Remembers your cookie choice', lt: 'Prisimena jūsų pasirinkimą dėl slapukų' },
    category: NECESSARY,
    duration: UNTIL_CLEARED,
  },
  {
    name: 'ostrev:cart',
    type: LOCAL,
    purpose: { en: 'Keeps your bag between visits', lt: 'Išsaugo krepšelį tarp apsilankymų' },
    category: NECESSARY,
    duration: UNTIL_CLEARED,
  },
  {
    name: 'ostrev:wishlist',
    type: LOCAL,
    purpose: { en: 'Saves your wishlist', lt: 'Išsaugo norų sąrašą' },
    category: NECESSARY,
    duration: UNTIL_CLEARED,
  },
  {
    name: 'ostrev:recent',
    type: LOCAL,
    purpose: { en: 'Products you viewed recently, shown under product pages', lt: 'Neseniai žiūrėtos prekės, rodomos prekių puslapiuose' },
    category: NECESSARY,
    duration: UNTIL_CLEARED,
  },
  {
    name: 'ostrev:account',
    type: LOCAL,
    purpose: {
      en: 'Your account details, addresses and order history on this device',
      lt: 'Jūsų paskyros duomenys, adresai ir užsakymų istorija šiame įrenginyje',
    },
    category: NECESSARY,
    duration: { en: 'Until cleared or signed out', lt: 'Kol ištrinsite ar atsijungsite' },
  },
  {
    name: 'ostrev:pending-order',
    type: { en: 'Session storage', lt: 'Seanso saugykla' },
    purpose: { en: 'Links your checkout to the confirmation page', lt: 'Susieja apmokėjimą su patvirtinimo puslapiu' },
    category: NECESSARY,
    duration: { en: 'Until the tab is closed', lt: 'Kol uždarysite skirtuką' },
  },
  {
    name: '__stripe_mid, __stripe_sid',
    type: { en: 'Cookie (stripe.com)', lt: 'Slapukas (stripe.com)' },
    purpose: { en: 'Fraud prevention on Stripe’s payment page', lt: 'Sukčiavimo prevencija Stripe mokėjimo puslapyje' },
    category: NECESSARY,
    duration: { en: '1 year / 30 minutes', lt: '1 metai / 30 minučių' },
  },
];

const COPY = {
  en: {
    title: 'Cookie policy',
    description: 'Which cookies and local storage OSTREV uses, and how to change your choice.',
    eyebrow: 'Legal',
    updated: '30 October 2026',
    intro:
      'We use only what the store needs to work. Analytics and marketing tools load only if you allow them — and right now we do not run any. If that changes, they will be listed here before they go live.',
    what: 'What we use',
    cols: ['Name', 'Purpose', 'Category', 'Duration'],
    change: 'Change your choice',
    clear: '— or clear your browser’s site data for ostrev.com.',
    language: 'Your language is part of the address (/lt for Lithuanian), so we do not store it.',
  },
  lt: {
    title: 'Slapukų politika',
    description: 'Kokius slapukus ir vietinę saugyklą naudoja OSTREV ir kaip pakeisti savo pasirinkimą.',
    eyebrow: 'Teisinė informacija',
    updated: '2026 m. spalio 30 d.',
    intro:
      'Naudojame tik tai, ko reikia parduotuvei veikti. Analitikos ir rinkodaros įrankiai įkeliami tik jums leidus – šiuo metu jų nenaudojame. Jei tai pasikeis, prieš įjungdami juos išvardysime čia.',
    what: 'Ką naudojame',
    cols: ['Pavadinimas', 'Paskirtis', 'Kategorija', 'Trukmė'],
    change: 'Pakeisti pasirinkimą',
    clear: '– arba ištrinkite ostrev.com svetainės duomenis naršyklėje.',
    language: 'Kalba yra adreso dalis (/lt – lietuviškai), todėl jos nesaugome.',
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await pageLocale(params);
  return { title: COPY[locale].title, description: COPY[locale].description, alternates: alternates(locale, '/legal/cookies') };
}

export default async function CookiesPage({ params }: Props) {
  const locale = await pageLocale(params);
  const c = COPY[locale];
  return (
    <ContentPage locale={locale} path="/legal/cookies" nav="legal" eyebrow={c.eyebrow} title={c.title} updated={c.updated}>
      <p>{c.intro}</p>
      <h2>{c.what}</h2>
      <table>
        <thead>
          <tr>
            {c.cols.map((col) => (
              <th key={col} scope="col">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ITEMS.map((i) => (
            <tr key={i.name}>
              <td>
                <code className="text-[13px]">{i.name}</code>
                <br />
                <span className="text-muted">{i.type[locale]}</span>
              </td>
              <td>{i.purpose[locale]}</td>
              <td>{i.category[locale]}</td>
              <td>{i.duration[locale]}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>{c.language}</p>
      <h2>{c.change}</h2>
      <p>
        <CookieSettingsLink className="link-underline" /> {c.clear}
      </p>
    </ContentPage>
  );
}

import type { Metadata } from 'next';
import { ContentPage } from '@/components/content/ContentPage';
import { ContactForm } from '@/components/forms/ContactForm';
import { SITE } from '@/lib/site';
import { alternates } from '@/lib/locale';
import { pageLocale, type LocaleParams } from '@/lib/pageLocale';

type Props = { params: LocaleParams };

const COPY = {
  en: {
    title: 'Contact',
    description: 'Contact OSTREV about orders, returns, sizing, wholesale or press. We reply within one working day.',
    eyebrow: 'Help',
    intro: 'We reply within one working day, Monday to Friday.',
    orders: 'Orders & returns',
    other: 'Everything else',
  },
  lt: {
    title: 'Kontaktai',
    description: 'Susisiekite su OSTREV dėl užsakymų, grąžinimo, dydžių, didmeninės prekybos ar spaudos. Atsakome per vieną darbo dieną.',
    eyebrow: 'Pagalba',
    intro: 'Atsakome per vieną darbo dieną, nuo pirmadienio iki penktadienio.',
    orders: 'Užsakymai ir grąžinimas',
    other: 'Kiti klausimai',
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await pageLocale(params);
  return { title: COPY[locale].title, description: COPY[locale].description, alternates: alternates(locale, '/help/contact') };
}

export default async function ContactPage({ params }: Props) {
  const locale = await pageLocale(params);
  const c = COPY[locale];
  return (
    <ContentPage locale={locale} path="/help/contact" nav="help" eyebrow={c.eyebrow} title={c.title} intro={<p>{c.intro}</p>}>
      <dl className="mb-12 grid gap-6 sm:grid-cols-2">
        <div>
          <dt className="label mb-1 text-muted">{c.orders}</dt>
          <dd>
            <a href={`mailto:${SITE.supportEmail}`}>{SITE.supportEmail}</a>
          </dd>
        </div>
        <div>
          <dt className="label mb-1 text-muted">{c.other}</dt>
          <dd>
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
          </dd>
        </div>
      </dl>
      <ContactForm />
    </ContentPage>
  );
}

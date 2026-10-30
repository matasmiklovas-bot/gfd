import type { Metadata } from 'next';
import Link from 'next/link';
import { ContentPage } from '@/components/content/ContentPage';
import { AccordionItem } from '@/components/ui/Accordion';
import { JsonLd } from '@/components/seo/JsonLd';
import { SITE } from '@/lib/site';
import { alternates, lp, type Locale } from '@/lib/locale';
import { pageLocale, type LocaleParams } from '@/lib/pageLocale';

type Props = { params: LocaleParams };

/** One answer per question; `link` is appended after the answer text. */
type Entry = { q: string; a: string; link?: { href: string; label: string } };

const FAQ: Record<Locale, Entry[]> = {
  en: [
    {
      q: 'How do your clothes fit?',
      a: 'Fits vary by piece: coats and knitwear are often relaxed or oversized, jeans follow your usual waist size. Every product page lists the fit, and the size guide has exact measurements in cm.',
      link: { href: '/help/size-guide', label: 'Size guide' },
    },
    {
      q: 'Will sold-out items come back?',
      a: 'Sometimes. Core pieces such as jeans and basics are restocked; seasonal pieces are usually made once. Use the newsletter to hear about restocks and new collections first.',
    },
    {
      q: 'How long does delivery take?',
      a: '2–5 working days anywhere in the EU, usually 1–3 in the Baltics. Orders before 14:00 Vilnius time ship the same working day.',
      link: { href: '/help/shipping', label: 'Shipping details' },
    },
    { q: 'How much is shipping?', a: '€4.99 flat to any EU country. Free on orders of €60 or more.' },
    { q: 'Do you ship outside the EU?', a: 'Not yet.' },
    {
      q: 'Which payment methods do you accept?',
      a: 'Visa, Mastercard, American Express, Apple Pay, Google Pay, PayPal and Klarna. Payments are processed by Stripe.',
    },
    {
      q: 'Can I return something?',
      a: 'Yes, within 14 days of delivery, no reason needed.',
      link: { href: '/help/returns', label: 'Returns policy' },
    },
    {
      q: 'Can I change or cancel my order?',
      a: 'Contact us as soon as possible. If it has not shipped yet, we can change or cancel it. After that, use a return.',
    },
    {
      q: 'How do I use a discount code?',
      a: 'Enter it in the discount field at checkout. One code per order. Codes cannot be applied after the order is placed.',
    },
    {
      q: 'How do I care for wool, knitwear and denim?',
      a: 'Knitwear: wash cold on a wool cycle and dry flat. Wool coats: dry clean or steam. Denim: wash inside out at 30°C, no tumble dryer. Care instructions are on every product page.',
    },
  ],
  lt: [
    {
      q: 'Kaip tinka jūsų drabužiai?',
      a: 'Priklauso nuo prekės: paltai ir megztiniai dažnai laisvo kirpimo, džinsus rinkitės pagal įprastą juosmens dydį. Kiekvienos prekės puslapyje nurodytas kirpimas, o dydžių lentelėje – tikslūs išmatavimai centimetrais.',
      link: { href: '/help/size-guide', label: 'Dydžių lentelė' },
    },
    {
      q: 'Ar išparduotos prekės grįš?',
      a: 'Kartais. Pagrindinius modelius, pavyzdžiui, džinsus ir bazinius drabužius, papildome; sezoninės prekės dažniausiai pagaminamos vieną kartą. Užsiprenumeruokite naujienlaiškį – apie papildymus ir naujas kolekcijas sužinosite pirmi.',
    },
    {
      q: 'Kiek laiko trunka pristatymas?',
      a: '2–5 darbo dienas visoje ES, į Baltijos šalis paprastai 1–3. Iki 14:00 Vilniaus laiku pateikti užsakymai išsiunčiami tą pačią darbo dieną.',
      link: { href: '/help/shipping', label: 'Daugiau apie pristatymą' },
    },
    { q: 'Kiek kainuoja pristatymas?', a: '4,99 € į bet kurią ES šalį. Užsakymams nuo 60 € – nemokamai.' },
    { q: 'Ar siunčiate už ES ribų?', a: 'Kol kas ne.' },
    {
      q: 'Kokius mokėjimo būdus priimate?',
      a: 'Visa, Mastercard, American Express, Apple Pay, Google Pay, PayPal ir Klarna. Mokėjimus apdoroja Stripe.',
    },
    {
      q: 'Ar galiu grąžinti prekę?',
      a: 'Taip, per 14 dienų nuo pristatymo, priežasties nurodyti nereikia.',
      link: { href: '/help/returns', label: 'Grąžinimo sąlygos' },
    },
    {
      q: 'Ar galiu pakeisti arba atšaukti užsakymą?',
      a: 'Susisiekite su mumis kuo greičiau. Jei užsakymas dar neišsiųstas, galime jį pakeisti arba atšaukti. Vėliau – pasinaudokite grąžinimu.',
    },
    {
      q: 'Kaip pasinaudoti nuolaidos kodu?',
      a: 'Įveskite jį nuolaidos laukelyje apmokėdami. Vienam užsakymui – vienas kodas. Pateikus užsakymą, kodo pritaikyti nebegalima.',
    },
    {
      q: 'Kaip prižiūrėti vilną, megztinius ir džinsus?',
      a: 'Megztinius skalbkite šaltame vandenyje vilnos programa ir džiovinkite paguldę. Vilnonius paltus valykite cheminiu būdu arba atnaujinkite garais. Džinsus skalbkite išvertę 30 °C, nedžiovinkite džiovyklėje. Priežiūros instrukcijos – kiekvienos prekės puslapyje.',
    },
  ],
};

const COPY = {
  en: {
    description: 'Sizing, shipping, returns and payments. Answers to common questions about OSTREV.',
    eyebrow: 'Help',
    intro: 'Short answers. If yours is not here, email',
  },
  lt: {
    description: 'Dydžiai, pristatymas, grąžinimas ir mokėjimai. Atsakymai į dažniausius klausimus apie OSTREV.',
    eyebrow: 'Pagalba',
    intro: 'Trumpi atsakymai. Neradote savo klausimo? Rašykite',
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await pageLocale(params);
  return {
    title: locale === 'lt' ? 'DUK' : 'FAQ',
    description: COPY[locale].description,
    alternates: alternates(locale, '/help/faq'),
  };
}

export default async function FaqPage({ params }: Props) {
  const locale = await pageLocale(params);
  const c = COPY[locale];
  const faq = FAQ[locale];

  return (
    <ContentPage
      locale={locale}
      path="/help/faq"
      nav="help"
      eyebrow={c.eyebrow}
      title={locale === 'lt' ? 'Dažni klausimai' : 'FAQ'}
      intro={
        <p>
          {c.intro}{' '}
          <a className="link-underline" href={`mailto:${SITE.supportEmail}`}>
            {SITE.supportEmail}
          </a>
          .
        </p>
      }
    >
      <div className="border-t border-line">
        {faq.map((item) => (
          <AccordionItem key={item.q} title={item.q} name="faq">
            {item.a}
            {item.link && (
              <>
                {' '}
                <Link href={lp(locale, item.link.href)}>{item.link.label}</Link>.
              </>
            )}
          </AccordionItem>
        ))}
      </div>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          inLanguage: locale,
          mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
        }}
      />
    </ContentPage>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { ContentPage } from '@/components/content/ContentPage';
import { AccordionItem } from '@/components/ui/Accordion';
import { JsonLd } from '@/components/seo/JsonLd';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Sizing, shipping, returns, payments and drops. Answers to common questions about OSTREV.',
  alternates: { canonical: '/help/faq' },
};

const FAQ: { q: string; a: React.ReactNode; text: string }[] = [
  {
    q: 'How do your clothes fit?',
    a: <>Most tops are cut oversized. Size down for a regular fit. Every product page lists the fit, and the <Link href="/help/size-guide">size guide</Link> has exact measurements in cm.</>,
    text: 'Most tops are cut oversized. Size down for a regular fit. Every product page lists the fit, and the size guide has exact measurements in cm.',
  },
  {
    q: 'Will sold-out items come back?',
    a: 'No. Every piece is made in a single run. When it is gone, it is gone. Sign up to the newsletter to hear about new drops first.',
    text: 'No. Every piece is made in a single run. When it is gone, it is gone. Sign up to the newsletter to hear about new drops first.',
  },
  {
    q: 'How long does delivery take?',
    a: <>2–5 working days anywhere in the EU, usually 1–3 in the Baltics. Orders before 14:00 Vilnius time ship the same working day. <Link href="/help/shipping">Shipping details</Link>.</>,
    text: '2–5 working days anywhere in the EU, usually 1–3 in the Baltics. Orders before 14:00 Vilnius time ship the same working day.',
  },
  {
    q: 'How much is shipping?',
    a: '€4.99 flat to any EU country. Free on orders of €60 or more.',
    text: '€4.99 flat to any EU country. Free on orders of €60 or more.',
  },
  {
    q: 'Do you ship outside the EU?',
    a: 'Not yet.',
    text: 'Not yet.',
  },
  {
    q: 'Which payment methods do you accept?',
    a: 'Visa, Mastercard, American Express, Apple Pay, Google Pay, PayPal and Klarna. Payments are processed by Stripe.',
    text: 'Visa, Mastercard, American Express, Apple Pay, Google Pay, PayPal and Klarna. Payments are processed by Stripe.',
  },
  {
    q: 'Can I return something?',
    a: <>Yes, within 14 days of delivery, no reason needed. <Link href="/help/returns">Returns policy</Link>.</>,
    text: 'Yes, within 14 days of delivery, no reason needed.',
  },
  {
    q: 'Can I change or cancel my order?',
    a: <>Contact us as soon as possible. If it has not shipped yet, we can change or cancel it. After that, use a return.</>,
    text: 'Contact us as soon as possible. If it has not shipped yet, we can change or cancel it. After that, use a return.',
  },
  {
    q: 'How do I use a discount code?',
    a: 'Enter it in the discount field at checkout. One code per order. Codes cannot be applied after the order is placed.',
    text: 'Enter it in the discount field at checkout. One code per order. Codes cannot be applied after the order is placed.',
  },
  {
    q: 'How do I wash heavyweight pieces?',
    a: 'Cold, inside out, no tumble dryer. Fleece and jersey are pre-shrunk, but heat still shortens cotton. Care instructions are on every product page.',
    text: 'Cold, inside out, no tumble dryer. Fleece and jersey are pre-shrunk, but heat still shortens cotton.',
  },
];

export default function FaqPage() {
  return (
    <ContentPage
      path="/help/faq"
      nav="help"
      eyebrow="Help"
      title="FAQ"
      intro={<p>Short answers. If yours is not here, email <a className="link-underline" href={`mailto:${SITE.supportEmail}`}>{SITE.supportEmail}</a>.</p>}
    >
      <div className="border-t border-line">
        {FAQ.map((item) => (
          <AccordionItem key={item.q} title={item.q} name="faq">
            {item.a}
          </AccordionItem>
        ))}
      </div>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.text } })),
        }}
      />
    </ContentPage>
  );
}

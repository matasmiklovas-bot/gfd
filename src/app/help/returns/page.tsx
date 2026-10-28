import type { Metadata } from 'next';
import Link from 'next/link';
import { ContentPage } from '@/components/content/ContentPage';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Returns',
  description: 'Return any OSTREV order within 14 days of delivery for a full refund. EU-wide.',
  alternates: { canonical: '/help/returns' },
};

export default function ReturnsPage() {
  return (
    <ContentPage
      path="/help/returns"
      nav="help"
      eyebrow="Help"
      title="Returns"
      intro={<p>14 days from delivery. No reason needed. Full refund to your original payment method.</p>}
    >
      <h2>How to return</h2>
      <ol>
        <li>
          Email <a href={`mailto:${SITE.supportEmail}`}>{SITE.supportEmail}</a> or use the{' '}
          <Link href="/help/contact">contact form</Link> within 14 days of delivery. Include your order number and the items you
          are sending back.
        </li>
        <li>We reply within one working day with the return address and instructions.</li>
        <li>Pack the items in their original packaging if you can and send them within 14 days of telling us.</li>
        <li>We refund you within 14 days of receiving your request. We may wait until the items arrive, or you send proof of shipping.</li>
      </ol>

      <h2>Condition</h2>
      <p>
        Try things on like you would in a shop. If an item comes back worn, washed or damaged beyond what is needed to check it,
        we may reduce the refund to cover the loss in value.
      </p>

      <h2>Costs</h2>
      <p>
        Return shipping is paid by you, unless the item is faulty or we sent the wrong one. If you return the whole order, we
        also refund the original standard shipping cost.
      </p>

      <h2>Exchanges</h2>
      <p>
        Our stock is limited and we do not restock, so we cannot hold sizes for exchange. Return the item for a refund and place
        a new order.
      </p>

      <h2>Faulty items</h2>
      <p>
        You have a two-year legal guarantee on every item under EU consumer law. If something is faulty, contact us with photos
        and we will repair, replace or refund it, including shipping.
      </p>

      <h2>Model withdrawal form</h2>
      <p>You do not have to use this form, but you can. Copy it into an email to {SITE.supportEmail}:</p>
      <blockquote className="border-l-2 border-ink pl-4 text-[14px]">
        <p>
          To {SITE.company.legalName}, {SITE.company.address}, {SITE.supportEmail}:
        </p>
        <p>
          I hereby give notice that I withdraw from my contract of sale of the following goods: [items]. Ordered on [date] /
          received on [date]. Order number: [number]. Name: [name]. Address: [address]. Date: [date].
        </p>
      </blockquote>
    </ContentPage>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { ContentPage } from '@/components/content/ContentPage';
import { SITE } from '@/lib/site';
import { formatPrice, formatPriceShort } from '@/lib/money';
import { FLAT_SHIPPING, FREE_SHIPPING_THRESHOLD } from '@/lib/pricing';

export const metadata: Metadata = {
  title: 'Terms & conditions',
  description: 'Terms and conditions of sale for orders placed at ostrev.com.',
  alternates: { canonical: '/legal/terms' },
};

// Template reflecting how this store works. Have it reviewed by a lawyer before launch.
export default function TermsPage() {
  const c = SITE.company;
  return (
    <ContentPage path="/legal/terms" nav="legal" eyebrow="Legal" title="Terms & conditions" updated="28 October 2026">
      <h2>1. Seller</h2>
      <p>
        ostrev.com is operated by {c.legalName}, {c.address}. Company code: {c.registrationNumber}. VAT number: {c.vatNumber}.
        Email: <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
      </p>

      <h2>2. Scope</h2>
      <p>
        These terms apply to all orders placed at ostrev.com by consumers in the European Union. Nothing in them limits your
        rights under mandatory consumer law in your country of residence.
      </p>

      <h2>3. Orders</h2>
      <p>
        Product images are for illustration; colours can look slightly different on screen. Clicking &ldquo;Pay&rdquo; is an
        offer to buy. The contract is formed when we send the order confirmation email. If an item turns out to be unavailable
        after you order, we tell you straight away and refund any payment for it in full.
      </p>

      <h2>4. Prices and payment</h2>
      <p>
        Prices are in euro and include VAT. Shipping is {formatPrice(FLAT_SHIPPING)} per order within the EU, free on orders of
        {' '}{formatPriceShort(FREE_SHIPPING_THRESHOLD)} or more (subtotal before discounts). Payment is taken when you place the order.
        We accept cards, Apple Pay, Google Pay, PayPal and Klarna. One discount code per order.
      </p>

      <h2>5. Delivery</h2>
      <p>
        We deliver to EU countries within 2–5 working days of dispatch. Risk passes to you when the parcel is delivered to you
        or a person you name. See <Link href="/help/shipping">Shipping</Link>.
      </p>

      <h2>6. Right of withdrawal</h2>
      <p>
        You can withdraw from the contract within 14 days of receiving the goods, without giving a reason. Tell us by email or
        through the contact form; you may use the model form on the <Link href="/help/returns">Returns</Link> page. Send the
        goods back within 14 days of withdrawing. We refund all payments received, including standard delivery costs, within
        14 days of your notice, using the original payment method. We may withhold the refund until we receive the goods or
        proof of return. You pay the direct cost of returning the goods. You are liable for any loss in value caused by handling
        beyond what is needed to establish their nature, characteristics and functioning.
      </p>

      <h2>7. Legal guarantee</h2>
      <p>
        You have a legal guarantee of conformity for two years from delivery. If goods are faulty or not as described, we
        repair, replace or refund them under applicable law.
      </p>

      <h2>8. Liability</h2>
      <p>
        We are liable for damage we cause intentionally or through gross negligence, and as required by mandatory law. We are
        not liable for delays caused by events outside our control.
      </p>

      <h2>9. Intellectual property</h2>
      <p>All content on this site, including the OSTREV name, designs, photos and text, belongs to us or our licensors.</p>

      <h2>10. Law and disputes</h2>
      <p>
        Lithuanian law applies, without removing the protection of mandatory consumer law in your country. If we cannot solve a
        complaint together, you can contact the State Consumer Rights Protection Authority of Lithuania (Valstybinė vartotojų
        teisių apsaugos tarnyba, <a href="https://vvtat.lrv.lt" target="_blank" rel="noopener noreferrer">vvtat.lrv.lt</a>) or
        the competent courts.
      </p>
    </ContentPage>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { ContentPage } from '@/components/content/ContentPage';
import { formatPrice, formatPriceShort } from '@/lib/money';
import { FLAT_SHIPPING, FREE_SHIPPING_THRESHOLD } from '@/lib/pricing';

export const metadata: Metadata = {
  title: 'Shipping',
  description: `OSTREV ships to all 27 EU countries in 2–5 working days. ${formatPrice(FLAT_SHIPPING)} flat rate, free over ${formatPriceShort(FREE_SHIPPING_THRESHOLD)}.`,
  alternates: { canonical: '/help/shipping' },
};

export default function ShippingPage() {
  return (
    <ContentPage
      path="/help/shipping"
      nav="help"
      eyebrow="Help"
      title="Shipping"
      intro={<p>We ship to every EU country. Tracked, 2–5 working days. Free over {formatPriceShort(FREE_SHIPPING_THRESHOLD)}.</p>}
    >
      <h2>Rates</h2>
      <table>
        <thead>
          <tr>
            <th scope="col">Order subtotal</th>
            <th scope="col">Shipping</th>
            <th scope="col">Delivery</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Under {formatPriceShort(FREE_SHIPPING_THRESHOLD)}</td>
            <td>{formatPrice(FLAT_SHIPPING)}</td>
            <td>2–5 working days</td>
          </tr>
          <tr>
            <td>{formatPriceShort(FREE_SHIPPING_THRESHOLD)} and over</td>
            <td>Free</td>
            <td>2–5 working days</td>
          </tr>
        </tbody>
      </table>
      <p>
        The free shipping threshold is based on your subtotal before discount codes. Lithuania, Latvia and Estonia usually
        arrive within 1–3 working days.
      </p>

      <h2>Dispatch</h2>
      <p>
        Orders placed before 14:00 Vilnius time on a working day leave our warehouse the same day. Orders placed later, at
        weekends or on Lithuanian public holidays leave the next working day. On drop days, allow one extra day.
      </p>

      <h2>Tracking</h2>
      <p>You get an email with a tracking link as soon as your parcel ships. No account needed.</p>

      <h2>Customs and duties</h2>
      <p>None. We ship from Lithuania, inside the EU. All prices include VAT. We do not ship outside the EU yet.</p>

      <h2>Problems with delivery</h2>
      <p>
        If your parcel is late, damaged or missing, <Link href="/help/contact">contact us</Link> with your order number. We will
        sort it out with the carrier and replace or refund the order.
      </p>
    </ContentPage>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { ContentPage } from '@/components/content/ContentPage';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Privacy policy',
  description: 'How OSTREV collects, uses and protects your personal data under the GDPR.',
  alternates: { canonical: '/legal/privacy' },
};

// Template reflecting how this store works. Have it reviewed by a lawyer before launch.
export default function PrivacyPage() {
  const c = SITE.company;
  return (
    <ContentPage path="/legal/privacy" nav="legal" eyebrow="Legal" title="Privacy policy" updated="28 October 2026">
      <h2>Who we are</h2>
      <p>
        {c.legalName} ({c.address}, company code {c.registrationNumber}) is the controller of your personal data. Contact us
        about privacy at <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
      </p>

      <h2>What we collect and why</h2>
      <table>
        <thead>
          <tr>
            <th scope="col">Data</th>
            <th scope="col">Purpose</th>
            <th scope="col">Legal basis</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Name, email, delivery address, phone, order contents</td>
            <td>Processing and delivering your order, returns, customer service</td>
            <td>Contract (Art. 6(1)(b) GDPR)</td>
          </tr>
          <tr>
            <td>Payment details</td>
            <td>Taking payment. Handled by Stripe — we never see or store full card numbers</td>
            <td>Contract</td>
          </tr>
          <tr>
            <td>Invoices and order records</td>
            <td>Accounting and tax obligations</td>
            <td>Legal obligation (Art. 6(1)(c))</td>
          </tr>
          <tr>
            <td>Email address (newsletter, drop alerts)</td>
            <td>Sending news about releases and offers</td>
            <td>Consent (Art. 6(1)(a)) — withdraw any time</td>
          </tr>
          <tr>
            <td>Messages you send us</td>
            <td>Answering your questions</td>
            <td>Legitimate interest (Art. 6(1)(f))</td>
          </tr>
          <tr>
            <td>Usage data via analytics cookies</td>
            <td>Understanding and improving the store</td>
            <td>Consent — only if you accept analytics cookies</td>
          </tr>
        </tbody>
      </table>

      <h2>Who we share it with</h2>
      <p>Only with processors who help us run the store, under data processing agreements:</p>
      <ul>
        <li>Stripe (payments, including PayPal and Klarna where you choose them)</li>
        <li>Our hosting provider</li>
        <li>Our email service provider (order emails and newsletter)</li>
        <li>Delivery carriers (name, address, phone, email for delivery updates)</li>
      </ul>
      <p>
        Some processors are based outside the EEA, such as in the United States. Those transfers are covered by the EU–US Data
        Privacy Framework or the European Commission&apos;s Standard Contractual Clauses. We never sell your data.
      </p>

      <h2>How long we keep it</h2>
      <ul>
        <li>Order and accounting records: 10 years, as required by Lithuanian accounting law.</li>
        <li>Newsletter: until you unsubscribe.</li>
        <li>Customer service messages: 3 years after the last contact.</li>
      </ul>

      <h2>Data stored on your device</h2>
      <p>
        Your bag, wishlist, account details and order history in this store are kept in your browser&apos;s local storage on
        your device. Clearing your browser data deletes them. See the <Link href="/legal/cookies">cookie policy</Link>.
      </p>

      <h2>Your rights</h2>
      <p>
        You can ask for access to, correction or deletion of your data, restriction of or objection to processing, and a copy in
        a portable format. You can withdraw consent at any time without affecting earlier processing. Email{' '}
        <a href={`mailto:${SITE.email}`}>{SITE.email}</a> — we answer within one month.
      </p>
      <p>
        You can also complain to the State Data Protection Inspectorate of Lithuania (Valstybinė duomenų apsaugos inspekcija,{' '}
        <a href="https://vdai.lrv.lt" target="_blank" rel="noopener noreferrer">vdai.lrv.lt</a>) or the authority in your EU country.
      </p>
    </ContentPage>
  );
}

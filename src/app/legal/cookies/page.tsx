import type { Metadata } from 'next';
import { ContentPage } from '@/components/content/ContentPage';
import { CookieSettingsLink } from '@/components/layout/CookieBanner';

export const metadata: Metadata = {
  title: 'Cookie policy',
  description: 'Which cookies and local storage OSTREV uses, and how to change your choice.',
  alternates: { canonical: '/legal/cookies' },
};

// Keep this table in sync with what the site actually loads.
const ITEMS = [
  { name: 'ostrev:consent', type: 'Local storage', purpose: 'Remembers your cookie choice', category: 'Necessary', duration: 'Until cleared' },
  { name: 'ostrev:cart', type: 'Local storage', purpose: 'Keeps your bag between visits', category: 'Necessary', duration: 'Until cleared' },
  { name: 'ostrev:wishlist', type: 'Local storage', purpose: 'Saves your wishlist', category: 'Necessary', duration: 'Until cleared' },
  { name: 'ostrev:account', type: 'Local storage', purpose: 'Your account details, addresses and order history on this device', category: 'Necessary', duration: 'Until cleared or signed out' },
  { name: 'ostrev:prefs', type: 'Local storage', purpose: 'Your language choice', category: 'Necessary', duration: 'Until cleared' },
  { name: 'ostrev:pending-order', type: 'Session storage', purpose: 'Links your checkout to the confirmation page', category: 'Necessary', duration: 'Until the tab is closed' },
  { name: '__stripe_mid, __stripe_sid', type: 'Cookie (stripe.com)', purpose: 'Fraud prevention on Stripe’s payment page', category: 'Necessary', duration: '1 year / 30 minutes' },
];

export default function CookiesPage() {
  return (
    <ContentPage path="/legal/cookies" nav="legal" eyebrow="Legal" title="Cookie policy" updated="28 October 2026">
      <p>
        We use only what the store needs to work. Analytics and marketing tools load only if you allow them — and right now we
        do not run any. If that changes, they will be listed here before they go live.
      </p>
      <h2>What we use</h2>
      <table>
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Purpose</th>
            <th scope="col">Category</th>
            <th scope="col">Duration</th>
          </tr>
        </thead>
        <tbody>
          {ITEMS.map((i) => (
            <tr key={i.name}>
              <td>
                <code className="text-[13px]">{i.name}</code>
                <br />
                <span className="text-muted">{i.type}</span>
              </td>
              <td>{i.purpose}</td>
              <td>{i.category}</td>
              <td>{i.duration}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Change your choice</h2>
      <p>
        <CookieSettingsLink className="link-underline" /> — or clear your browser&apos;s site data for ostrev.com.
      </p>
    </ContentPage>
  );
}

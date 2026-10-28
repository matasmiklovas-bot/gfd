import type { Metadata } from 'next';
import { ContentPage } from '@/components/content/ContentPage';
import { ContactForm } from '@/components/forms/ContactForm';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contact OSTREV about orders, returns, sizing, wholesale or press. We reply within one working day.',
  alternates: { canonical: '/help/contact' },
};

export default function ContactPage() {
  return (
    <ContentPage
      path="/help/contact"
      nav="help"
      eyebrow="Help"
      title="Contact"
      intro={<p>We reply within one working day, Monday to Friday.</p>}
    >
      <dl className="mb-12 grid gap-6 sm:grid-cols-2">
        <div>
          <dt className="label mb-1 text-muted">Orders & returns</dt>
          <dd><a href={`mailto:${SITE.supportEmail}`}>{SITE.supportEmail}</a></dd>
        </div>
        <div>
          <dt className="label mb-1 text-muted">Everything else</dt>
          <dd><a href={`mailto:${SITE.email}`}>{SITE.email}</a></dd>
        </div>
      </dl>
      <ContactForm />
    </ContentPage>
  );
}

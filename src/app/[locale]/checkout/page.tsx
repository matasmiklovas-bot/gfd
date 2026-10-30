import type { Metadata } from 'next';
import { CheckoutForm } from '@/components/checkout/CheckoutForm';
import { pageLocale, type LocaleParams } from '@/lib/pageLocale';

export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  return { title: (await pageLocale(params)) === 'lt' ? 'Apmokėjimas' : 'Checkout', robots: { index: false, follow: false } };
}

export default function CheckoutPage() {
  return <CheckoutForm />;
}

import type { Metadata } from 'next';
import { AccountView } from '@/components/account/AccountView';
import { pageLocale, type LocaleParams } from '@/lib/pageLocale';

export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  return { title: (await pageLocale(params)) === 'lt' ? 'Paskyra' : 'Account', robots: { index: false, follow: true } };
}

export default function AccountPage() {
  return <AccountView />;
}

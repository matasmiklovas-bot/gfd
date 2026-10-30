import { redirect } from 'next/navigation';
import { lp } from '@/lib/locale';
import { pageLocale, type LocaleParams } from '@/lib/pageLocale';

export default async function HelpIndex({ params }: { params: LocaleParams }) {
  redirect(lp(await pageLocale(params), '/help/faq'));
}

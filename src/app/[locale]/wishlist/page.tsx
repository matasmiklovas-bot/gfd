import type { Metadata } from 'next';
import { getAllSummaries } from '@/lib/commerce';
import { pageLocale, type LocaleParams } from '@/lib/pageLocale';
import { WishlistView } from '@/components/wishlist/WishlistView';

type Props = { params: LocaleParams };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: (await pageLocale(params)) === 'lt' ? 'Norų sąrašas' : 'Wishlist', robots: { index: false, follow: true } };
}

export default async function WishlistPage({ params }: Props) {
  return <WishlistView products={await getAllSummaries(await pageLocale(params))} />;
}

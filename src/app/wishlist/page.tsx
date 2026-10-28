import type { Metadata } from 'next';
import { getAllSummaries } from '@/lib/commerce';
import { WishlistView } from '@/components/wishlist/WishlistView';

export const metadata: Metadata = { title: 'Wishlist', robots: { index: false, follow: true } };

export default async function WishlistPage() {
  return <WishlistView products={await getAllSummaries()} />;
}

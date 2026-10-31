import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getT } from '@/lib/dictionary';
import { pageLocale, type LocaleParams } from '@/lib/pageLocale';
import { SearchResults } from '@/components/search/SearchResults';

type Props = { params: LocaleParams };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: getT(await pageLocale(params))('search.title'), robots: { index: false, follow: true } };
}

export default async function SearchPage({ params }: Props) {
  await pageLocale(params);
  return (
    <div className="container-site min-h-[60vh] pb-24 pt-10 md:pt-16">
      <Suspense>
        <SearchResults />
      </Suspense>
    </div>
  );
}

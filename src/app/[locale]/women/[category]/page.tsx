import { GenderCategoryPage, genderCategoryMetadata, genderCategoryParams } from '@/components/product/GenderCategoryPage';
import { pageLocale } from '@/lib/pageLocale';

type Props = { params: Promise<{ locale: string; category: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return genderCategoryParams('women');
}

export async function generateMetadata({ params }: Props) {
  return genderCategoryMetadata('women', (await params).category, await pageLocale(params));
}

export default async function Page({ params }: Props) {
  return <GenderCategoryPage gender="women" category={(await params).category} locale={await pageLocale(params)} />;
}

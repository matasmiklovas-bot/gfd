import { GenderCategoryPage, genderCategoryMetadata, genderCategoryParams } from '@/components/product/GenderCategoryPage';

type Props = { params: Promise<{ category: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return genderCategoryParams('women');
}

export async function generateMetadata({ params }: Props) {
  return genderCategoryMetadata('women', (await params).category);
}

export default async function Page({ params }: Props) {
  return <GenderCategoryPage gender="women" category={(await params).category} />;
}

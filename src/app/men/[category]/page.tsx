import { GenderCategoryPage, genderCategoryMetadata, genderCategoryParams } from '@/components/product/GenderCategoryPage';

type Props = { params: Promise<{ category: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return genderCategoryParams('men');
}

export async function generateMetadata({ params }: Props) {
  return genderCategoryMetadata('men', (await params).category);
}

export default async function Page({ params }: Props) {
  return <GenderCategoryPage gender="men" category={(await params).category} />;
}

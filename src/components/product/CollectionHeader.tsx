import type { Category } from '@/lib/types';
import { CategoryNav } from './CollectionView';

export function CollectionHeader({
  title,
  description,
  current,
  showNav = true,
}: {
  title: string;
  description?: string;
  current?: Category;
  showNav?: boolean;
}) {
  return (
    <div className="container-site pb-6 pt-10 md:pb-8 md:pt-16">
      <h1 className="heading-display">{title}</h1>
      {description && <p className="mt-4 max-w-xl text-[15px] text-muted">{description}</p>}
      {showNav && (
        <div className="mt-8">
          <CategoryNav current={current} />
        </div>
      )}
    </div>
  );
}

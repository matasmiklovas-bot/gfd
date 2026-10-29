import type { ReactNode } from 'react';
import type { Category } from '@/lib/types';
import { CategoryNav } from './CollectionView';

export function CollectionHeader({
  title,
  eyebrow,
  description,
  current,
  showNav = true,
  nav,
}: {
  title: string;
  eyebrow?: string;
  description?: string;
  current?: Category;
  showNav?: boolean;
  /** Replaces the default all-category links. */
  nav?: ReactNode;
}) {
  return (
    <div className="container-site pb-6 pt-8 md:pb-8 md:pt-12">
      {eyebrow && <p className="label mb-3 text-muted">{eyebrow}</p>}
      <h1 className="heading-1">{title}</h1>
      {description && <p className="mt-4 max-w-xl text-[15px] text-muted">{description}</p>}
      {(nav || showNav) && <div className="mt-6 md:mt-8">{nav ?? <CategoryNav current={current} />}</div>}
    </div>
  );
}

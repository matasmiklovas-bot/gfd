'use client';

import { toggleWishlist, wishlistStore } from '@/lib/store';
import { HeartIcon } from '@/components/ui/Icons';
import { useT } from '@/lib/i18n';

export function WishlistButton({ handle, name, className = '' }: { handle: string; name: string; className?: string }) {
  const saved = wishlistStore.useStore((s) => s.handles.includes(handle));
  const t = useT();
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(handle);
      }}
      aria-pressed={saved}
      aria-label={saved ? t('wish.remove', { name }) : t('wish.save', { name })}
      className={`group/wish inline-flex h-11 w-11 items-center justify-center ${className}`}
    >
      <span className="inline-flex h-8 w-8 items-center justify-center bg-white text-ink transition-colors group-hover/wish:bg-bone">
        <HeartIcon size={16} filled={saved} />
      </span>
    </button>
  );
}

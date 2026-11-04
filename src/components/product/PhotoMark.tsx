/**
 * Small OSTREV label in a photo's corner, drawn over the image rather than baked into it, so it stays sharp and can be
 * removed in one place. A solid white tag like the wishlist button, so it reads on any photo.
 */
export function PhotoMark({ className = 'bottom-3 left-3' }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute select-none bg-white/90 px-1.5 py-1 font-display text-[9px] font-black uppercase leading-none tracking-[0.2em] text-ink md:text-[10px] ${className}`}
    >
      OSTREV
    </span>
  );
}

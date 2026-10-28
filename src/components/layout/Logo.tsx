import Link from 'next/link';

export function Logo({ className = '', onClick }: { className?: string; onClick?: () => void }) {
  return (
    <Link
      href="/"
      onClick={onClick}
      aria-label="OSTREV — home"
      className={`font-display text-[22px] font-black uppercase leading-none tracking-[-0.02em] md:text-[26px] ${className}`}
      style={{ fontStretch: '125%' }}
    >
      OSTREV
    </Link>
  );
}

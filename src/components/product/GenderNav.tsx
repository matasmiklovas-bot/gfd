import Link from 'next/link';
import { MENU } from '@/lib/site';
import type { Gender } from '@/lib/types';

/** Category links inside Women or Men, as on Bershka: All · Coats · Knitwear · … */
export function GenderNav({ gender, current }: { gender: Gender; current?: string }) {
  const items = [{ href: `/${gender}`, label: 'All', active: !current }].concat(
    MENU[gender].map((m) => ({ href: `/${gender}/${m.category}`, label: m.label, active: current === m.category })),
  );
  return (
    <nav aria-label={gender === 'women' ? 'Women’s categories' : 'Men’s categories'} className="scroll-row -mx-4 px-4 md:mx-0 md:px-0">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={item.active ? 'page' : undefined}
          className={`label shrink-0 snap-start border px-4 py-2.5 transition-colors ${
            item.active ? 'border-ink bg-ink text-white' : 'border-line hover:border-ink'
          }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

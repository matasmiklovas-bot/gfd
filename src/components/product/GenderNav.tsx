import Link from 'next/link';
import { MENU } from '@/lib/site';
import { lp, type Locale } from '@/lib/locale';
import { getT } from '@/lib/dictionary';
import type { Gender } from '@/lib/types';

/** Category links inside Women or Men, as on Bershka: All · Coats · Knitwear · … */
export function GenderNav({ gender, current, locale }: { gender: Gender; current?: string; locale: Locale }) {
  const t = getT(locale);
  const items = [{ href: lp(locale, `/${gender}`), label: t('common.all'), active: !current }].concat(
    MENU[gender].map((m) => ({ href: lp(locale, `/${gender}/${m.category}`), label: m.label[locale], active: current === m.category })),
  );
  return (
    <nav aria-label={t(gender === 'women' ? 'nav.womenCategories' : 'nav.menCategories')} className="scroll-row -mx-4 px-4 md:mx-0 md:px-0">
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

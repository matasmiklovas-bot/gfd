import Image from 'next/image';
import Link from 'next/link';
import { lp, type Locale } from '@/lib/locale';

const PANELS = [
  {
    href: '/women',
    label: { en: 'Women', lt: 'Moterims' },
    cta: { en: 'Shop women', lt: 'Moterų kolekcija' },
    image: '/images/hero-women.webp',
    alt: {
      en: 'Model in a beige oversized trench coat and light wide-leg jeans in a white studio',
      lt: 'Modelis su smėlio spalvos laisvu tranšėjiniu paltu ir šviesiais plačiais džinsais baltoje studijoje',
    },
    position: 'object-[50%_30%]',
  },
  {
    href: '/men',
    label: { en: 'Men', lt: 'Vyrams' },
    cta: { en: 'Shop men', lt: 'Vyrų kolekcija' },
    image: '/images/hero-men.webp',
    alt: { en: 'Model in an ecru puffer jacket against a sand-coloured wall', lt: 'Modelis su ekru spalvos pūsta striuke prie smėlio spalvos sienos' },
    position: 'object-[50%_25%]',
  },
];

const SEASON = { en: 'Autumn–Winter 2026', lt: 'Ruduo–žiema 2026' };

/** Split campaign hero: women and men side by side on desktop, stacked on phones. */
export function Hero({ locale }: { locale: Locale }) {
  // Both panels share one size, set by the longest label (MOTERIMS), so the pair reads as a set side by side.
  const labelSize =
    Math.max(...PANELS.map((p) => p.label[locale].length)) > 6
      ? 'text-[13vw] md:text-[5.6vw] xl:text-[6.25rem]'
      : 'text-[18vw] md:text-[7.5vw] xl:text-[8.5rem]';
  return (
    <section aria-label={SEASON[locale]} className="-mt-header grid md:h-[calc(100svh-var(--announce-h))] md:min-h-[640px] md:grid-cols-2">
      {PANELS.map((panel, i) => (
        <Link
          key={panel.href}
          href={lp(locale, panel.href)}
          className="group relative block h-[82svh] min-h-[520px] overflow-hidden bg-bone md:h-full"
        >
          <Image
            src={panel.image}
            alt={panel.alt[locale]}
            fill
            priority
            sizes="(min-width: 768px) 50vw, 100vw"
            quality={78}
            className={`object-cover ${panel.position} transition-transform duration-[1200ms] ease-out group-hover:scale-[1.02]`}
          />
          <div className="absolute inset-x-0 bottom-0 flex flex-col items-start px-4 pb-8 md:px-8 md:pb-12">
            {i === 0 && <p className="label mb-3">{SEASON[locale]}</p>}
            <h2 className={`heading-display leading-[0.85] ${labelSize}`}>
              {panel.label[locale]}
            </h2>
            <span className="label mt-5 inline-flex items-center gap-2 border-b border-ink pb-1 transition-[gap] duration-300 group-hover:gap-3">
              {panel.cta[locale]} <span aria-hidden="true">→</span>
            </span>
          </div>
        </Link>
      ))}
      <h1 className="sr-only">{locale === 'lt' ? 'OSTREV — moterų ir vyrų mada, ruduo–žiema 2026' : 'OSTREV — women’s and men’s fashion, Autumn–Winter 2026'}</h1>
    </section>
  );
}

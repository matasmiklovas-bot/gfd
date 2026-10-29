import Image from 'next/image';
import Link from 'next/link';

const PANELS = [
  {
    href: '/women',
    label: 'Women',
    cta: 'Shop women',
    image: '/images/hero-women.webp',
    alt: 'Model in a beige oversized trench coat and light wide-leg jeans in a white studio',
    position: 'object-[50%_30%]',
  },
  {
    href: '/men',
    label: 'Men',
    cta: 'Shop men',
    image: '/images/hero-men.webp',
    alt: 'Model in an ecru puffer jacket against a sand-coloured wall',
    position: 'object-[50%_25%]',
  },
];

/** Split campaign hero: women and men side by side on desktop, stacked on phones. */
export function Hero() {
  return (
    <section aria-label="Autumn–Winter 2026" className="-mt-header grid md:h-[calc(100svh-var(--announce-h))] md:min-h-[640px] md:grid-cols-2">
      {PANELS.map((panel, i) => (
        <Link
          key={panel.href}
          href={panel.href}
          className="group relative block h-[82svh] min-h-[520px] overflow-hidden bg-bone md:h-full"
        >
          <Image
            src={panel.image}
            alt={panel.alt}
            fill
            priority
            sizes="(min-width: 768px) 50vw, 100vw"
            quality={78}
            className={`object-cover ${panel.position} transition-transform duration-[1200ms] ease-out group-hover:scale-[1.02]`}
          />
          <div className="absolute inset-x-0 bottom-0 flex flex-col items-start px-4 pb-8 md:px-8 md:pb-12">
            {i === 0 && <p className="label mb-3">Autumn–Winter 2026</p>}
            <h2 className="heading-display text-[18vw] leading-[0.85] md:text-[7.5vw] xl:text-[8.5rem]">{panel.label}</h2>
            <span className="label mt-5 inline-flex items-center gap-2 border-b border-ink pb-1 transition-[gap] duration-300 group-hover:gap-3">
              {panel.cta} <span aria-hidden="true">→</span>
            </span>
          </div>
        </Link>
      ))}
      <h1 className="sr-only">OSTREV — women’s and men’s fashion, Autumn–Winter 2026</h1>
    </section>
  );
}

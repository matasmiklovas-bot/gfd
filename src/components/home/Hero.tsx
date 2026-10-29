import Link from 'next/link';
import { getImageProps } from 'next/image';

/** Full-bleed hero. Art-directed: landscape crop on desktop, portrait crop on phones. */
export function Hero({ pieces }: { pieces: number }) {
  const common = { alt: 'Model in a long black coat leaning on the rail of a brutalist car park', priority: true, sizes: '100vw' };
  const {
    props: { srcSet: desktop },
  } = getImageProps({ ...common, src: '/images/hero.webp', width: 2000, height: 1333, quality: 75 });
  const {
    props: { srcSet: mobile, ...rest },
  } = getImageProps({ ...common, src: '/images/hero-mobile.webp', width: 1080, height: 1742, quality: 75 });

  return (
    <section className="on-dark relative -mt-header h-[calc(100svh-var(--announce-h))] min-h-[560px] w-full overflow-hidden bg-ink text-white">
      <picture>
        <source media="(min-width: 768px)" srcSet={desktop} />
        <source media="(max-width: 767px)" srcSet={mobile} />
        {/* eslint-disable-next-line jsx-a11y/alt-text -- alt is in rest */}
        <img {...rest} className="absolute inset-0 h-full w-full object-cover object-[50%_40%]" />
      </picture>
      {/* Flat scrim for text contrast (no gradients). */}
      <div className="absolute inset-0 bg-ink/30" aria-hidden="true" />
      <div className="container-site relative flex h-full flex-col justify-end pb-10 md:pb-16">
        <p className="label mb-4 text-white/85">Out now · {pieces} pieces · No restocks</p>
        <h1 className="heading-display text-[22vw] md:text-[12vw] xl:text-[11rem]">Drop 01</h1>
        <p className="mt-4 max-w-sm text-[15px] text-white/85 md:mt-6 md:text-base">Built heavy. Worn loose.</p>
        <div className="mt-7 flex flex-wrap gap-3 md:mt-8">
          <Link href="/shop" className="btn-inverse min-w-[180px]">
            Shop now
          </Link>
          <Link href="/drops" className="btn-ghost-inverse">
            Drop 02
          </Link>
        </div>
      </div>
    </section>
  );
}

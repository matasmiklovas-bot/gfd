import Link from 'next/link';
import { getImageProps } from 'next/image';

export function Hero({ pieces }: { pieces: number }) {
  const common = { alt: 'Model in an oversized hoodie and gas mask holding a smoke flare', priority: true, sizes: '100vw' };
  const {
    props: { srcSet: desktop },
  } = getImageProps({ ...common, src: '/images/hero.webp', width: 2400, height: 1600, quality: 70 });
  const {
    props: { srcSet: mobile, ...rest },
  } = getImageProps({ ...common, src: '/images/hero-mobile.webp', width: 1080, height: 1600, quality: 70 });

  return (
    <section className="on-dark relative -mt-header h-[100svh] min-h-[560px] w-full overflow-hidden bg-ink text-white">
      <picture>
        <source media="(min-width: 768px)" srcSet={desktop} />
        <source media="(max-width: 767px)" srcSet={mobile} />
        {/* eslint-disable-next-line jsx-a11y/alt-text -- alt is in rest */}
        <img {...rest} className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: '50% 35%' }} />
      </picture>
      <div className="absolute inset-0 bg-ink/35" aria-hidden="true" />
      <div className="container-site relative flex h-full flex-col justify-end pb-24 md:pb-20">
        <p className="label mb-4">Out now · {pieces} pieces · No restocks</p>
        <h1 className="heading-display">
          Drop 01
        </h1>
        <p className="mt-5 max-w-sm text-[15px] text-white/85 md:text-base">Built heavy. Worn loose.</p>
        <div className="mt-8">
          <Link href="/shop" className="btn-inverse min-w-[200px]">
            Shop now
          </Link>
        </div>
      </div>
    </section>
  );
}

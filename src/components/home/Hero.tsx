import Image from 'next/image';
import Link from 'next/link';

/** Split hero: headline on bone, one full-height photo. Stacks on mobile (photo first). */
export function Hero({ pieces }: { pieces: number }) {
  return (
    <section className="relative -mt-header flex min-h-[calc(100svh-var(--announce-h))] flex-col bg-bone md:grid md:grid-cols-2">
      <div className="relative order-1 min-h-[300px] flex-1 md:order-2 md:min-h-0">
        <Image
          src="/images/hero-mobile.webp"
          alt="Two models in matching grey melange hoodies and sweatpants against a concrete wall"
          fill
          priority
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover object-[50%_30%]"
        />
      </div>
      <div className="order-2 flex flex-col justify-end px-4 pb-8 pt-6 md:order-1 md:px-8 md:pb-16 md:pt-header lg:px-12">
        <p className="label mb-3 text-muted md:mb-5">Out now · {pieces} pieces · No restocks</p>
        <h1 className="heading-display text-[20vw] md:text-[12vw] xl:text-[10.5rem]">
          Drop
          <br />
          01
        </h1>
        <p className="mt-4 max-w-xs text-[15px] leading-relaxed md:mt-6 md:text-base">Built heavy. Worn loose.</p>
        <div className="mt-6 flex flex-wrap gap-3 md:mt-8">
          <Link href="/shop" className="btn-primary min-w-[180px]">
            Shop now
          </Link>
          <Link href="/drops" className="btn-secondary">
            Drop 02
          </Link>
        </div>
      </div>
    </section>
  );
}

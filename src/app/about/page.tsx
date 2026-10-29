import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Reveal } from '@/components/ui/Reveal';

export const metadata: Metadata = {
  title: 'About',
  description: 'OSTREV is women’s and men’s fashion from Vilnius. Coats, knitwear, shirts and denim that follow the season, at high-street prices.',
  alternates: { canonical: '/about' },
};

const PRINCIPLES = [
  { title: 'Follow the season', text: 'New pieces every few weeks, built around what people actually wear this autumn and winter.' },
  { title: 'Keep it wearable', text: 'Neutral colours, easy cuts, pieces that work together. A trench, a good knit, jeans that fit.' },
  { title: 'Price it fairly', text: 'High-street prices with VAT included, free EU shipping over €60 and 14-day returns.' },
];

export default function AboutPage() {
  return (
    <>
      <section className="container-site pb-16 pt-10 md:pb-24 md:pt-16">
        <p className="label mb-4 text-muted">About</p>
        <h1 className="heading-display max-w-6xl">Made in Vilnius, worn everywhere</h1>
        <div className="mt-10 grid gap-8 md:mt-16 md:grid-cols-12">
          <p className="text-[17px] leading-8 md:col-span-6 md:col-start-7 md:text-lg">
            OSTREV is a fashion label for women and men. We design the pieces a wardrobe is built on — coats, knitwear,
            shirts and denim — and update them every season, so looking current never means paying designer prices.
          </p>
        </div>
      </section>

      <section aria-label="Images" className="grid gap-1 md:grid-cols-2">
        <div className="relative aspect-[4/5]">
          <Image src="/images/about-1.webp" alt="Model in a black blazer and light jeans lying back against a yellow armchair" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
        </div>
        <div className="relative aspect-[4/5]">
          <Image src="/images/about-3.webp" alt="Close-up portrait of a model in an oat knit jumper" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
        </div>
      </section>

      <section className="container-site section">
        <h2 className="label mb-10 text-muted md:mb-14">How we work</h2>
        <ul className="grid gap-10 md:grid-cols-3 md:gap-8">
          {PRINCIPLES.map((p, i) => (
            <Reveal as="li" key={p.title} delay={i * 60}>
              <h3 className="heading-2">{p.title}</h3>
              <p className="mt-4 max-w-sm text-[15px] leading-7 text-muted">{p.text}</p>
            </Reveal>
          ))}
        </ul>
      </section>

      <section aria-label="Image" className="relative aspect-[4/3] md:aspect-[16/7]">
        <Image src="/images/about-2.webp" alt="Model in a white T-shirt and mom jeans bending backwards in a grey studio" fill sizes="100vw" className="object-cover" />
      </section>

      <section className="container-site section text-center">
        <h2 className="heading-1">Autumn–Winter 2026 is in.</h2>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link href="/women" className="btn-primary min-w-[160px]">
            Shop women
          </Link>
          <Link href="/men" className="btn-secondary min-w-[160px]">
            Shop men
          </Link>
        </div>
      </section>
    </>
  );
}

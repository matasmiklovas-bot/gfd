import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Reveal } from '@/components/ui/Reveal';

export const metadata: Metadata = {
  title: 'About',
  description: 'OSTREV makes heavyweight, oversized streetwear in black, grey and white. Single runs. No restocks. Fair prices.',
  alternates: { canonical: '/about' },
};

const MANIFESTO = ['Built heavy.', 'Worn loose.', 'Made once.', 'No restocks.', 'No noise.'];

export default function AboutPage() {
  return (
    <>
      <section className="container-site pb-16 pt-10 md:pb-24 md:pt-16">
        <p className="label mb-4 text-muted">About</p>
        <h1 className="heading-display max-w-6xl">Streetwear without the markup</h1>
        <div className="mt-10 grid gap-8 md:mt-16 md:grid-cols-12">
          <p className="text-[17px] leading-8 md:col-span-6 md:col-start-7 md:text-lg">
            OSTREV started with a simple problem. The pieces we wanted — heavy fleece, wide cuts, clean graphics — cost more
            than most people our age earn in a week. So we made them ourselves, and priced them like a high-street brand.
          </p>
        </div>
      </section>

      <section aria-label="Images" className="grid gap-1 md:grid-cols-2">
        <div className="relative aspect-[4/5]">
          <Image src="/images/about-1.webp" alt="Model sitting on a ledge in front of a circular window" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
        </div>
        <div className="relative aspect-[4/5]">
          <Image src="/images/about-2.webp" alt="Model in a leather jacket crouching on a rooftop ledge" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
        </div>
      </section>

      <section className="container-site section grid gap-10 md:grid-cols-12">
        <h2 className="label text-muted md:col-span-3">How we work</h2>
        <div className="space-y-6 text-[16px] leading-8 md:col-span-7">
          <p>
            We make fewer things, and we make them properly. Our fleece is 380 to 400gsm. Our tees are 220 to 250gsm. The cuts
            are wide on purpose and the colour range stays tight: black, grey, white.
          </p>
          <p>
            Every style is produced in a single run. When a drop sells out, it stays sold out. It keeps our stock lean, our prices
            low, and what you wear a little harder to find.
          </p>
          <p>No fake &ldquo;people viewing&rdquo; counters. No bought reviews. Just the clothes.</p>
        </div>
      </section>

      <section aria-label="Manifesto" className="on-dark bg-ink py-20 text-white md:py-32">
        <div className="container-site">
          <ul>
            {MANIFESTO.map((line, i) => (
              <Reveal as="li" key={line} delay={i * 60}>
                <span className="heading-display block py-1">{line}</span>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section aria-label="Image" className="relative aspect-[4/3] md:aspect-[16/7]">
        <Image src="/images/about-3.webp" alt="Rail of clothing on hangers against a white wall" fill sizes="100vw" className="object-cover" />
      </section>

      <section className="container-site section text-center">
        <h2 className="heading-1">Drop 01 — out now.</h2>
        <Link href="/shop" className="btn-primary mt-10">
          Shop now
        </Link>
      </section>
    </>
  );
}

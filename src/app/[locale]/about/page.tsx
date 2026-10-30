import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Reveal } from '@/components/ui/Reveal';
import { alternates, lp } from '@/lib/locale';
import { pageLocale, type LocaleParams } from '@/lib/pageLocale';

type Props = { params: LocaleParams };

const COPY = {
  en: {
    title: 'About',
    description: 'OSTREV is women’s and men’s fashion from Vilnius. Coats, knitwear, shirts and denim that follow the season, at high-street prices.',
    eyebrow: 'About',
    h1: 'Made in Vilnius, worn everywhere',
    intro:
      'OSTREV is a fashion label for women and men. We design the pieces a wardrobe is built on — coats, knitwear, shirts and denim — and update them every season, so looking current never means paying designer prices.',
    images: 'Images',
    alt1: 'Model in a black blazer and light jeans lying back against a yellow armchair',
    alt2: 'Close-up portrait of a model in an oat knit jumper',
    alt3: 'Model in a white T-shirt and mom jeans bending backwards in a grey studio',
    how: 'How we work',
    principles: [
      ['Follow the season', 'New pieces every few weeks, built around what people actually wear this autumn and winter.'],
      ['Keep it wearable', 'Neutral colours, easy cuts, pieces that work together. A trench, a good knit, jeans that fit.'],
      ['Price it fairly', 'High-street prices with VAT included, free EU shipping over €60 and 14-day returns.'],
    ],
    closing: 'Autumn–Winter 2026 is in.',
    women: 'Shop women',
    men: 'Shop men',
  },
  lt: {
    title: 'Apie mus',
    description: 'OSTREV – moterų ir vyrų mada iš Vilniaus. Paltai, megztiniai, marškiniai ir džinsai, sekantys sezoną, prieinamomis kainomis.',
    eyebrow: 'Apie mus',
    h1: 'Sukurta Vilniuje, dėvima visur',
    intro:
      'OSTREV – mados ženklas moterims ir vyrams. Kuriame drabužius, ant kurių laikosi visa spinta – paltus, megztinius, marškinius ir džinsus – ir atnaujiname juos kiekvieną sezoną, kad atrodyti madingai nereikštų mokėti dizainerių kainų.',
    images: 'Nuotraukos',
    alt1: 'Modelis su juodu švarku ir šviesiais džinsais atsilošęs prie geltono fotelio',
    alt2: 'Modelio portretas iš arti su avižinės spalvos megztiniu',
    alt3: 'Modelis su baltais marškinėliais ir „mom“ džinsais atsilenkęs atgal pilkoje studijoje',
    how: 'Kaip dirbame',
    principles: [
      ['Sekame sezoną', 'Nauji drabužiai kas kelias savaites – tai, ką žmonės iš tiesų dėvi šį rudenį ir žiemą.'],
      ['Patogu dėvėti', 'Neutralios spalvos, paprasti kirpimai, tarpusavyje derantys drabužiai. Tranšėjinis paltas, geras megztinis, tinkantys džinsai.'],
      ['Sąžininga kaina', 'Prieinamos kainos su PVM, nemokamas pristatymas ES nuo 60 € ir grąžinimas per 14 dienų.'],
    ],
    closing: 'Ruduo–žiema 2026 jau čia.',
    women: 'Moterims',
    men: 'Vyrams',
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await pageLocale(params);
  return { title: COPY[locale].title, description: COPY[locale].description, alternates: alternates(locale, '/about') };
}

export default async function AboutPage({ params }: Props) {
  const locale = await pageLocale(params);
  const c = COPY[locale];
  return (
    <>
      <section className="container-site pb-16 pt-10 md:pb-24 md:pt-16">
        <p className="label mb-4 text-muted">{c.eyebrow}</p>
        <h1 className="heading-display max-w-6xl">{c.h1}</h1>
        <div className="mt-10 grid gap-8 md:mt-16 md:grid-cols-12">
          <p className="text-[17px] leading-8 md:col-span-6 md:col-start-7 md:text-lg">{c.intro}</p>
        </div>
      </section>

      <section aria-label={c.images} className="grid gap-1 md:grid-cols-2">
        <div className="relative aspect-[4/5]">
          <Image src="/images/about-1.webp" alt={c.alt1} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
        </div>
        <div className="relative aspect-[4/5]">
          <Image src="/images/about-3.webp" alt={c.alt2} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
        </div>
      </section>

      <section className="container-site section">
        <h2 className="label mb-10 text-muted md:mb-14">{c.how}</h2>
        <ul className="grid gap-10 md:grid-cols-3 md:gap-8">
          {c.principles.map(([title, text], i) => (
            <Reveal as="li" key={title} delay={i * 60}>
              <h3 className="heading-2">{title}</h3>
              <p className="mt-4 max-w-sm text-[15px] leading-7 text-muted">{text}</p>
            </Reveal>
          ))}
        </ul>
      </section>

      <section aria-label={c.images} className="relative aspect-[4/3] md:aspect-[16/7]">
        <Image src="/images/about-2.webp" alt={c.alt3} fill sizes="100vw" className="object-cover" />
      </section>

      <section className="container-site section text-center">
        <h2 className="heading-1">{c.closing}</h2>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link href={lp(locale, '/women')} className="btn-primary min-w-[160px]">
            {c.women}
          </Link>
          <Link href={lp(locale, '/men')} className="btn-secondary min-w-[160px]">
            {c.men}
          </Link>
        </div>
      </section>
    </>
  );
}

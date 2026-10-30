import Image from 'next/image';
import Link from 'next/link';
import { SITE } from '@/lib/site';
import { lp, type Locale } from '@/lib/locale';
import { Reveal } from '@/components/ui/Reveal';
import { InstagramIcon } from '@/components/ui/Icons';
import { EmailCapture } from '@/components/forms/EmailCapture';

type Text = Record<Locale, string>;

const TILES: { href: string; label: Text; image: string; alt: Text }[] = [
  {
    href: '/shop/coats',
    label: { en: 'Coats & jackets', lt: 'Paltai ir striukės' },
    image: '/images/cat-coats.webp',
    alt: {
      en: 'Model in a beige trench coat sitting on a wooden stepladder',
      lt: 'Modelis su smėlio spalvos tranšėjiniu paltu sėdi ant medinių kopėtėlių',
    },
  },
  {
    href: '/shop/knitwear',
    label: { en: 'Knitwear', lt: 'Megztiniai' },
    image: '/images/cat-knitwear.webp',
    alt: {
      en: 'Model in a sage green chunky turtleneck pulling the collar over her face',
      lt: 'Modelis su šalavijo žalios spalvos storu golfu, užsitraukusi apykaklę ant veido',
    },
  },
  {
    href: '/shop/shirts',
    label: { en: 'Shirts & tops', lt: 'Marškiniai ir palaidinės' },
    image: '/images/cat-tops.webp',
    alt: { en: 'Model in an oversized white poplin shirt', lt: 'Modelis su laisvais baltais poplino marškiniais' },
  },
  {
    href: '/shop/trousers',
    label: { en: 'Jeans & trousers', lt: 'Džinsai ir kelnės' },
    image: '/images/cat-jeans.webp',
    alt: {
      en: 'Model crouching in a white T-shirt and baggy mid-blue jeans',
      lt: 'Pritūpęs modelis su baltais marškinėliais ir laisvais mėlynais džinsais',
    },
  },
];

export function CategoryTiles({ locale }: { locale: Locale }) {
  return (
    <section aria-label={locale === 'lt' ? 'Kategorijos' : 'Shop by category'} className="container-site py-12 md:py-20">
      <ul className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-4 md:gap-x-4">
        {TILES.map((tile, i) => (
          <Reveal as="li" key={tile.href} delay={i * 60}>
            <Link href={lp(locale, tile.href)} className="group block">
              <div className="relative aspect-[4/5] overflow-hidden bg-bone">
                <Image
                  src={tile.image}
                  alt={tile.alt[locale]}
                  fill
                  sizes="(min-width: 768px) 25vw, 50vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
              </div>
              <p className="label pt-3">{tile.label[locale]}</p>
            </Link>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}

const EDITORIAL = {
  en: {
    eyebrow: 'The edit',
    title: 'Tailoring meets denim',
    body: 'A sharp blazer, a crisp shirt, jeans cut long and wide. Easy pieces in black, white and stone that work together all season.',
    coats: 'Shop coats & jackets',
    jeans: 'Shop jeans',
    alt: 'Model in a black oversized blazer and light wide-leg jeans sitting on a studio floor',
  },
  lt: {
    eyebrow: 'Sezono derinys',
    title: 'Švarkas ir džinsai',
    body: 'Ryškių pečių švarkas, standūs marškiniai, ilgi ir platūs džinsai. Paprasti juodos, baltos ir akmens spalvos drabužiai, kurie dera tarpusavyje visą sezoną.',
    coats: 'Paltai ir striukės',
    jeans: 'Džinsai',
    alt: 'Modelis su juodu laisvu švarku ir šviesiais plačiais džinsais sėdi ant studijos grindų',
  },
};

export function Editorial({ locale }: { locale: Locale }) {
  const c = EDITORIAL[locale];
  return (
    <section aria-labelledby="editorial-title" className="bg-bone">
      <div className="grid md:grid-cols-12">
        <div className="relative aspect-[4/5] md:col-span-7 md:aspect-auto md:min-h-[85vh]">
          <Image src="/images/editorial.webp" alt={c.alt} fill sizes="(min-width: 768px) 58vw, 100vw" className="object-cover object-[68%_50%]" />
        </div>
        <Reveal className="flex flex-col justify-center px-4 py-14 md:col-span-5 md:px-12 md:py-24 lg:px-16">
          <p className="label mb-6 text-muted">{c.eyebrow}</p>
          <h2 id="editorial-title" className="heading-1 text-balance">
            {c.title}
          </h2>
          <p className="mt-6 max-w-md text-[15px] leading-7 text-ink md:text-base">{c.body}</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href={lp(locale, '/shop/coats')} className="btn-primary">
              {c.coats}
            </Link>
            <Link href={lp(locale, '/shop/trousers')} className="btn-secondary">
              {c.jeans}
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const LOOKBOOK = {
  en: {
    eyebrow: 'Women · Men',
    title: 'Denim, all year',
    cta: 'Shop denim',
    alt: 'Two models in oversized denim jackets and white T-shirts in a grey studio',
  },
  lt: {
    eyebrow: 'Moterims · Vyrams',
    title: 'Džinsas ištisus metus',
    cta: 'Visi džinsai',
    alt: 'Du modeliai su laisvomis džinsinėmis striukėmis ir baltais marškinėliais pilkoje studijoje',
  },
};

export function Lookbook({ locale }: { locale: Locale }) {
  const c = LOOKBOOK[locale];
  return (
    <section aria-labelledby="lookbook-title" className="relative h-[80svh] min-h-[480px] overflow-hidden bg-bone md:h-[90vh]">
      <Image src="/images/lookbook.webp" alt={c.alt} fill sizes="100vw" className="object-cover object-[45%_50%]" />
      <div className="container-site relative flex h-full flex-col items-start justify-end pb-10 md:pb-16">
        <p className="label mb-3">{c.eyebrow}</p>
        <h2 id="lookbook-title" className="heading-display max-w-3xl text-balance">
          {c.title}
        </h2>
        <Link href={lp(locale, '/shop/trousers')} className="btn-primary mt-8">
          {c.cta}
        </Link>
      </div>
    </section>
  );
}

const SOCIAL: { src: string; alt: Text }[] = [
  { src: '/images/social-1.webp', alt: { en: 'Beige trench coat worn with a clear tote bag', lt: 'Smėlio spalvos tranšėjinis paltas su skaidria rankine' } },
  { src: '/images/social-2.webp', alt: { en: 'Model stretching in a beige trench coat', lt: 'Modelis su smėlio spalvos tranšėjiniu paltu tempiasi' } },
  { src: '/images/social-3.webp', alt: { en: 'Model in a white T-shirt and mom jeans', lt: 'Modelis su baltais marškinėliais ir „mom“ džinsais' } },
  {
    src: '/images/social-4.webp',
    alt: { en: 'Model in a white shirt and wide-leg jeans, upside down against a wall', lt: 'Modelis su baltais marškiniais ir plačiais džinsais, aukštyn kojomis prie sienos' },
  },
  {
    src: '/images/social-5.webp',
    alt: { en: 'Model in a green corduroy overshirt and ecru cord trousers', lt: 'Modelis su žaliais velvetiniais marškiniais-striuke ir ekru velvetinėmis kelnėmis' },
  },
  { src: '/images/social-6.webp', alt: { en: 'Model in an ecru crew-neck jumper looking up', lt: 'Modelis su ekru megztiniu apvalia iškirpte žiūri aukštyn' } },
];

export function SocialGrid({ locale }: { locale: Locale }) {
  return (
    <section aria-labelledby="social-title" className="section">
      <div className="container-site mb-6 flex items-end justify-between gap-4 md:mb-10">
        <h2 id="social-title" className="heading-2">{SITE.handle}</h2>
        <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" className="label link-underline">
          {locale === 'lt' ? 'Sekti' : 'Follow'}
        </a>
      </div>
      <ul className="grid grid-cols-3 gap-1 md:grid-cols-6">
        {SOCIAL.map((post, i) => (
          <li key={post.src}>
            <a
              href={SITE.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block aspect-square overflow-hidden bg-bone"
              aria-label={locale === 'lt' ? `OSTREV „Instagram“, įrašas ${i + 1}` : `OSTREV on Instagram, post ${i + 1}`}
            >
              <Image src={post.src} alt={post.alt[locale]} fill sizes="(min-width: 768px) 17vw, 33vw" className="object-cover transition-opacity duration-300 group-hover:opacity-80" />
              <InstagramIcon className="absolute right-2 top-2 text-white opacity-0 transition-opacity group-hover:opacity-100" size={18} />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

const NEWSLETTER = {
  en: {
    title: 'New collections first',
    body: 'New arrivals, restocks and sales before anyone else. 10% off your first order.',
    cta: 'Sign up',
    done: ['You are in. Your code:', '— 10% off your first order.'],
  },
  lt: {
    title: 'Naujos kolekcijos pirmiausia jums',
    body: 'Naujienos, papildymai ir išpardavimai anksčiau už kitus. 10 % nuolaida pirmam užsakymui.',
    cta: 'Užsiprenumeruoti',
    done: ['Užsiprenumeravote. Jūsų kodas:', '– 10 % nuolaida pirmam užsakymui.'],
  },
};

export function Newsletter({ locale }: { locale: Locale }) {
  const c = NEWSLETTER[locale];
  return (
    <section aria-labelledby="newsletter-title" className="border-t border-line">
      <div className="container-site section grid gap-10 md:grid-cols-2 md:items-end">
        <div>
          <h2 id="newsletter-title" className="heading-1 text-balance">
            {c.title}
          </h2>
          <p className="mt-4 text-[15px] text-muted">{c.body}</p>
        </div>
        <EmailCapture
          source="newsletter"
          cta={c.cta}
          successMessage={
            <>
              {c.done[0]} <strong className="font-semibold tracking-wider">WELCOME10</strong> {c.done[1]}
            </>
          }
        />
      </div>
    </section>
  );
}

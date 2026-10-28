import Image from 'next/image';
import Link from 'next/link';
import { NEXT_DROP, SITE } from '@/lib/site';
import { Reveal } from '@/components/ui/Reveal';
import { ArrowRightIcon, InstagramIcon } from '@/components/ui/Icons';
import { EmailCapture } from '@/components/forms/EmailCapture';
import { Countdown } from './Countdown';

const TILES = [
  { href: '/shop/hoodies', label: 'Hoodies', image: '/images/cat-hoodies.webp', alt: 'Model in a hoodie under a quilted jacket' },
  { href: '/shop/tees', label: 'Tees', image: '/images/cat-tees.webp', alt: 'Model in a plain white heavyweight tee' },
  { href: '/shop/pants', label: 'Pants', image: '/images/cat-pants.webp', alt: 'Model in relaxed trousers and white sneakers' },
];

export function CategoryTiles() {
  return (
    <section aria-label="Shop by category" className="container-site pb-16 md:pb-28">
      <ul className="grid gap-8 md:grid-cols-3 md:gap-4">
        {TILES.map((tile, i) => (
          <Reveal as="li" key={tile.href} delay={i * 80}>
            <Link href={tile.href} className="group block">
              <div className="relative aspect-square overflow-hidden bg-bone md:aspect-[4/5]">
                <Image
                  src={tile.image}
                  alt={tile.alt}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover object-[50%_25%] transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
              </div>
              <div className="flex items-center justify-between pt-4">
                <span className="heading-2">{tile.label}</span>
                <ArrowRightIcon className="transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </Link>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}

export function Editorial() {
  return (
    <section aria-labelledby="editorial-title" className="bg-bone">
      <div className="grid md:grid-cols-2">
        <div className="relative aspect-[4/5] md:aspect-auto md:min-h-[90vh]">
          <Image
            src="/images/editorial.webp"
            alt="Model in a dark jacket reaching toward the camera in front of a graffiti wall"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        <Reveal className="flex flex-col justify-center px-4 py-16 md:px-16 md:py-24 lg:px-24">
          <p className="label mb-6 text-muted">The idea</p>
          <h2 id="editorial-title" className="heading-1 text-balance">
            Fewer pieces. Heavier fabric. No noise.
          </h2>
          <p className="mt-6 max-w-md text-[15px] leading-7 text-ink md:text-base">
            We make a small number of things and make them properly. 400gsm fleece, 250gsm jersey, cuts that sit wide and drop
            low. Black, grey, white. Every piece is made in one run. When it is gone, it is gone.
          </p>
          <div className="mt-10">
            <Link href="/about" className="btn-secondary">
              About OSTREV
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function DropCountdown() {
  return (
    <section aria-labelledby="drop-title" className="on-dark bg-ink text-white">
      <div className="container-site section">
        <Reveal>
          <p className="label mb-6 text-white/70">
            Next release ·{' '}
            {new Intl.DateTimeFormat('en-GB', {
              day: 'numeric',
              month: 'long',
              hour: '2-digit',
              minute: '2-digit',
              timeZone: 'Europe/Vilnius',
              timeZoneName: 'short',
            }).format(new Date(NEXT_DROP.date))}
          </p>
          <h2 id="drop-title" className="heading-display mb-10 md:mb-14">
            {NEXT_DROP.name}
          </h2>
          <Countdown date={NEXT_DROP.date} liveLabel={`${NEXT_DROP.name} — out now.`} />
          <div className="mt-12 grid gap-8 md:mt-16 md:grid-cols-2 md:items-end">
            <p className="max-w-md text-[15px] leading-7 text-white/85">{NEXT_DROP.teaser}</p>
            <EmailCapture
              source="drop-notify"
              cta="Notify me"
              dark
              successMessage={`You are on the list. We will email you when ${NEXT_DROP.name} goes live.`}
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const SOCIAL = [1, 2, 3, 4, 5, 6].map((n) => `/images/social-${n}.webp`);

export function SocialGrid() {
  return (
    <section aria-labelledby="social-title" className="section">
      <div className="container-site mb-6 flex items-end justify-between gap-4 md:mb-10">
        <h2 id="social-title" className="heading-2">{SITE.handle}</h2>
        <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" className="label link-underline">
          Follow
        </a>
      </div>
      <ul className="grid grid-cols-3 gap-1 md:grid-cols-6">
        {SOCIAL.map((src, i) => (
          <li key={src}>
            <a
              href={SITE.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block aspect-square overflow-hidden bg-bone"
              aria-label={`OSTREV on Instagram, post ${i + 1}`}
            >
              <Image src={src} alt="" fill sizes="(min-width: 768px) 17vw, 33vw" className="object-cover transition-opacity duration-300 group-hover:opacity-80" />
              <InstagramIcon className="absolute right-2 top-2 text-white opacity-0 transition-opacity group-hover:opacity-100" size={18} />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Newsletter() {
  return (
    <section aria-labelledby="newsletter-title" className="border-t border-line">
      <div className="container-site section grid gap-10 md:grid-cols-2 md:items-end">
        <div>
          <h2 id="newsletter-title" className="heading-1 text-balance">
            Get early access to drops
          </h2>
          <p className="mt-4 text-[15px] text-muted">First to know about every release. 10% off your first order.</p>
        </div>
        <EmailCapture
          source="newsletter"
          cta="Sign up"
          successMessage={
            <>
              You are in. Your code: <strong className="font-semibold tracking-wider">WELCOME10</strong> — 10% off your first order.
            </>
          }
        />
      </div>
    </section>
  );
}

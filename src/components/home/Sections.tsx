import Image from 'next/image';
import Link from 'next/link';
import { SITE } from '@/lib/site';
import { Reveal } from '@/components/ui/Reveal';
import { InstagramIcon } from '@/components/ui/Icons';
import { EmailCapture } from '@/components/forms/EmailCapture';

const TILES = [
  { href: '/shop/coats', label: 'Coats & jackets', image: '/images/cat-coats.webp', alt: 'Model in a beige trench coat sitting on a wooden stepladder' },
  { href: '/shop/knitwear', label: 'Knitwear', image: '/images/cat-knitwear.webp', alt: 'Model in a sage green chunky turtleneck pulling the collar over her face' },
  { href: '/shop/shirts', label: 'Shirts & tops', image: '/images/cat-tops.webp', alt: 'Model in an oversized white poplin shirt' },
  { href: '/shop/trousers', label: 'Jeans & trousers', image: '/images/cat-jeans.webp', alt: 'Model crouching in a white T-shirt and baggy mid-blue jeans' },
];

export function CategoryTiles() {
  return (
    <section aria-label="Shop by category" className="container-site py-12 md:py-20">
      <ul className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-4 md:gap-x-4">
        {TILES.map((tile, i) => (
          <Reveal as="li" key={tile.href} delay={i * 60}>
            <Link href={tile.href} className="group block">
              <div className="relative aspect-[4/5] overflow-hidden bg-bone">
                <Image
                  src={tile.image}
                  alt={tile.alt}
                  fill
                  sizes="(min-width: 768px) 25vw, 50vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
              </div>
              <p className="label pt-3">{tile.label}</p>
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
      <div className="grid md:grid-cols-12">
        <div className="relative aspect-[4/5] md:col-span-7 md:aspect-auto md:min-h-[85vh]">
          <Image
            src="/images/editorial.webp"
            alt="Model in a black oversized blazer and light wide-leg jeans sitting on a studio floor"
            fill
            sizes="(min-width: 768px) 58vw, 100vw"
            className="object-cover object-[68%_50%]"
          />
        </div>
        <Reveal className="flex flex-col justify-center px-4 py-14 md:col-span-5 md:px-12 md:py-24 lg:px-16">
          <p className="label mb-6 text-muted">The edit</p>
          <h2 id="editorial-title" className="heading-1 text-balance">
            Tailoring meets denim
          </h2>
          <p className="mt-6 max-w-md text-[15px] leading-7 text-ink md:text-base">
            A sharp blazer, a crisp shirt, jeans cut long and wide. Easy pieces in black, white and stone that work together
            all season.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/shop/coats" className="btn-primary">
              Shop coats & jackets
            </Link>
            <Link href="/shop/trousers" className="btn-secondary">
              Shop jeans
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Lookbook() {
  return (
    <section aria-labelledby="lookbook-title" className="relative h-[80svh] min-h-[480px] overflow-hidden bg-bone md:h-[90vh]">
      <Image
        src="/images/lookbook.webp"
        alt="Two models in oversized denim jackets and white T-shirts in a grey studio"
        fill
        sizes="100vw"
        className="object-cover object-[45%_50%]"
      />
      <div className="container-site relative flex h-full flex-col items-start justify-end pb-10 md:pb-16">
        <p className="label mb-3">Women · Men</p>
        <h2 id="lookbook-title" className="heading-display max-w-3xl text-balance">
          Denim, all year
        </h2>
        <Link href="/shop/trousers" className="btn-primary mt-8">
          Shop denim
        </Link>
      </div>
    </section>
  );
}

const SOCIAL = [
  { src: '/images/social-1.webp', alt: 'Beige trench coat worn with a clear tote bag' },
  { src: '/images/social-2.webp', alt: 'Model stretching in a beige trench coat' },
  { src: '/images/social-3.webp', alt: 'Model in a white T-shirt and mom jeans' },
  { src: '/images/social-4.webp', alt: 'Model in a white shirt and wide-leg jeans, upside down against a wall' },
  { src: '/images/social-5.webp', alt: 'Model in a green corduroy overshirt and ecru cord trousers' },
  { src: '/images/social-6.webp', alt: 'Model in an ecru crew-neck jumper looking up' },
];

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
        {SOCIAL.map((post, i) => (
          <li key={post.src}>
            <a
              href={SITE.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block aspect-square overflow-hidden bg-bone"
              aria-label={`OSTREV on Instagram, post ${i + 1}`}
            >
              <Image src={post.src} alt={post.alt} fill sizes="(min-width: 768px) 17vw, 33vw" className="object-cover transition-opacity duration-300 group-hover:opacity-80" />
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
            New collections first
          </h2>
          <p className="mt-4 text-[15px] text-muted">New arrivals, restocks and sales before anyone else. 10% off your first order.</p>
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

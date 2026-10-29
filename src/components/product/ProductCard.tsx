import Image from 'next/image';
import Link from 'next/link';
import type { ProductSummary } from '@/lib/types';
import { Price } from '@/components/ui/Price';
import { T } from '@/components/layout/T';
import { WishlistButton } from './WishlistButton';

export function ProductCard({
  product,
  priority = false,
  sizes = '(min-width: 1024px) 25vw, 50vw',
}: {
  product: ProductSummary;
  priority?: boolean;
  sizes?: string;
}) {
  const [primary, secondary] = product.images;

  return (
    <article className="group relative">
      <Link href={product.url} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-bone">
          <Image
            src={primary.src}
            alt={primary.alt}
            fill
            sizes={sizes}
            priority={priority}
            className={`object-cover transition-opacity duration-500 ease-out ${secondary ? 'md:group-hover:opacity-0' : ''} ${
              product.soldOut ? 'opacity-60' : ''
            }`}
          />
          {secondary && (
            <Image
              src={secondary.src}
              alt=""
              fill
              sizes={sizes}
              className="hidden object-cover opacity-0 transition-opacity duration-500 ease-out md:block md:group-hover:opacity-100"
            />
          )}
          {product.soldOut && (
            <span className="label absolute left-2 top-2 bg-white px-2 py-1 text-[10px] text-ink">
              <T k="product.soldOut" />
            </span>
          )}
        </div>
        {product.isNew && !product.soldOut && (
          <p className="label mt-3 text-[10px] text-muted">
            <T k="product.new" />
          </p>
        )}
        <h3 className={`${product.isNew && !product.soldOut ? 'mt-1' : 'mt-3'} font-sans text-[13px] font-normal normal-case leading-snug tracking-normal md:text-[14px]`}>
          {product.name}
        </h3>
        <Price cents={product.price} className="text-[13px] text-muted md:text-[14px]" />
      </Link>
      {product.colors.length > 1 && (
        <ul className="mt-2 flex gap-1.5" aria-label={`${product.colors.length} colours: ${product.colors.map((c) => c.name).join(', ')}`}>
          {product.colors.map((c) => (
            <li
              key={c.slug}
              title={c.name}
              className="h-2.5 w-2.5 border border-concrete"
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </ul>
      )}
      {/* Sits over the image's bottom-right corner, outside the link so it is its own tab stop. */}
      <div className="pointer-events-none absolute right-0 top-0 aspect-[4/5] w-full">
        <WishlistButton handle={product.handle} name={product.name} className="pointer-events-auto absolute bottom-0 right-0" />
      </div>
    </article>
  );
}

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  getAllProducts,
  getCategories,
  getGenders,
  getProductByHandle,
  productUrl,
  sortForListing,
  toSummary,
} from '@/lib/commerce';
import { centsToDecimal, formatPrice } from '@/lib/money';
import { alternates, lp, type Locale } from '@/lib/locale';
import { getT } from '@/lib/dictionary';
import { pageLocale } from '@/lib/pageLocale';
import type { Product } from '@/lib/types';
import { absoluteUrl, MENU, SITE } from '@/lib/site';
import { tablesFor } from '@/lib/sizeGuide';
import { FLAT_SHIPPING } from '@/lib/pricing';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { JsonLd } from '@/components/seo/JsonLd';
import { ProductMain } from '@/components/product/ProductMain';
import { ProductSlider } from '@/components/product/ProductSlider';
import { RecentlyViewed } from '@/components/product/RecentlyViewed';

type Props = { params: Promise<{ locale: string; category: string; slug: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getAllProducts()).map((p) => ({ category: p.category, slug: p.handle }));
}

async function load(params: Props['params'], locale: Locale) {
  const { category, slug } = await params;
  const product = await getProductByHandle(slug, locale);
  if (!product || product.category !== category) return null;
  return product;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await pageLocale(params);
  const product = await load(params, locale);
  if (!product) return {};
  const path = productUrl(product);
  const description = getT(locale)('meta.productDescription', {
    summary: product.summary,
    material: product.material,
    price: formatPrice(product.price, locale),
  });
  return {
    title: product.name,
    description,
    alternates: alternates(locale, path),
    openGraph: {
      type: 'website',
      url: lp(locale, path),
      title: `${product.name} — OSTREV`,
      description,
      images: product.images.map((img) => ({ url: img.src, width: 1200, height: 1500, alt: img.alt })),
    },
    other: {
      'product:price:amount': centsToDecimal(product.price),
      'product:price:currency': 'EUR',
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const locale = await pageLocale(params);
  const product = await load(params, locale);
  if (!product) notFound();
  const t = getT(locale);
  const summary = (p: Product) => toSummary(p, locale);

  const url = lp(locale, productUrl(product));
  const category = getCategories(locale).find((c) => c.slug === product.category)!;
  const gender = getGenders(locale).find((g) => g.slug === product.gender)!;
  const all = await getAllProducts(locale);
  const related = product.related
    .map((h) => all.find((p) => p.handle === h))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .map(summary);
  // Same gender and category first, then the newest pieces for that gender.
  const taken = new Set([product.handle, ...related.map((p) => p.handle)]);
  const similar = sortForListing(
    all.filter((p) => p.gender === product.gender && !taken.has(p.handle)).map(summary),
  )
    .sort((a, b) => Number(b.category === product.category) - Number(a.category === product.category))
    .filter((p) => !p.soldOut)
    .slice(0, 8);

  return (
    <>
      <div className="container-site py-4">
        <Breadcrumbs
          label={t('a11y.breadcrumb')}
          items={[
            { href: lp(locale, '/'), label: t('common.home') },
            { href: lp(locale, `/${product.gender}`), label: gender.label },
            {
              href: lp(locale, `/${product.gender}/${category.slug}`),
              label: MENU[product.gender].find((m) => m.category === category.slug)?.label[locale] ?? category.label,
            },
            { href: url, label: product.name },
          ]}
        />
      </div>

      <ProductMain product={product} url={url} sizeTables={tablesFor(product.category, locale)} />
      <div className="h-6 md:h-12" aria-hidden="true" />

      {related.length > 0 && <ProductSlider title={t('product.complete')} products={related} compact />}
      {similar.length > 0 && <ProductSlider title={t('product.similar')} products={similar} compact />}
      <RecentlyViewed current={product.handle} products={all.map(summary)} />

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'ProductGroup',
          name: product.name,
          description: product.description,
          url: absoluteUrl(url),
          productGroupID: product.id,
          brand: { '@type': 'Brand', name: SITE.name },
          material: product.material,
          image: product.images.map((i) => absoluteUrl(i.src)),
          variesBy: ['https://schema.org/color', 'https://schema.org/size'],
          hasVariant: product.colors.flatMap((c) =>
            product.sizes.map((s) => ({
              '@type': 'Product',
              sku: `${product.id}-${c.slug}-${s}`.toUpperCase(),
              name: `${product.name} — ${c.name}, ${s}`,
              color: c.name,
              size: s,
              image: absoluteUrl((product.colorImages?.[c.slug] ?? product.images)[0].src),
              offers: {
                '@type': 'Offer',
                url: absoluteUrl(url),
                price: centsToDecimal(product.price),
                priceCurrency: 'EUR',
                itemCondition: 'https://schema.org/NewCondition',
                availability:
                  (product.stock[c.slug]?.[s] ?? 0) > 0 ? 'https://schema.org/InStock' : 'https://schema.org/SoldOut',
                shippingDetails: {
                  '@type': 'OfferShippingDetails',
                  shippingRate: { '@type': 'MonetaryAmount', value: centsToDecimal(FLAT_SHIPPING), currency: 'EUR' },
                  shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'LT' },
                  deliveryTime: {
                    '@type': 'ShippingDeliveryTime',
                    handlingTime: { '@type': 'QuantitativeValue', minValue: 0, maxValue: 1, unitCode: 'DAY' },
                    transitTime: { '@type': 'QuantitativeValue', minValue: 2, maxValue: 5, unitCode: 'DAY' },
                  },
                },
                hasMerchantReturnPolicy: {
                  '@type': 'MerchantReturnPolicy',
                  applicableCountry: 'LT',
                  returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
                  merchantReturnDays: 14,
                  returnMethod: 'https://schema.org/ReturnByMail',
                  returnFees: 'https://schema.org/ReturnFeesCustomerResponsibility',
                },
              },
            })),
          ),
        }}
      />
    </>
  );
}

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  getAllProducts,
  getProductByHandle,
  CATEGORIES,
  productUrl,
  toSummary,
} from '@/lib/commerce';
import { centsToDecimal } from '@/lib/money';
import { absoluteUrl, SITE } from '@/lib/site';
import { tablesFor } from '@/lib/sizeGuide';
import { FLAT_SHIPPING } from '@/lib/pricing';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { JsonLd } from '@/components/seo/JsonLd';
import { ProductGallery } from '@/components/product/ProductGallery';
import { ProductDetail } from '@/components/product/ProductDetail';
import { ProductSlider } from '@/components/product/ProductSlider';

type Props = { params: Promise<{ category: string; slug: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getAllProducts()).map((p) => ({ category: p.category, slug: p.handle }));
}

async function load(params: Props['params']) {
  const { category, slug } = await params;
  const product = await getProductByHandle(slug);
  if (!product || product.category !== category) return null;
  return product;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await load(params);
  if (!product) return {};
  const url = productUrl(product);
  const description = `${product.summary} ${product.material} €${centsToDecimal(product.price)}. Free EU shipping over €60.`;
  return {
    title: product.name,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      url,
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
  const product = await load(params);
  if (!product) notFound();

  const url = productUrl(product);
  const category = CATEGORIES.find((c) => c.slug === product.category)!;
  const all = await getAllProducts();
  const related = product.related
    .map((h) => all.find((p) => p.handle === h))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .map(toSummary);

  return (
    <>
      <div className="container-site py-4">
        <Breadcrumbs
          items={[
            { href: '/', label: 'Home' },
            { href: `/shop/${category.slug}`, label: category.label },
            { href: url, label: product.name },
          ]}
        />
      </div>

      <div className="md:container-site md:grid md:grid-cols-12 md:gap-10 lg:gap-16">
        <div className="md:col-span-7">
          <ProductGallery images={product.images} name={product.name} />
        </div>
        <div className="container-site pt-6 md:col-span-5 md:px-0 md:pt-0">
          <div className="md:sticky md:top-[calc(var(--header-h)+2rem)]">
            <ProductDetail product={product} url={url} sizeTables={tablesFor(product.category)} />
          </div>
        </div>
      </div>

      {related.length > 0 && <ProductSlider title="Complete the look" products={related} />}

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
              image: absoluteUrl(product.images[0].src),
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

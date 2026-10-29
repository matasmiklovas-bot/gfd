'use client';

import { useState } from 'react';
import type { Product } from '@/lib/types';
import type { SizeTable } from '@/lib/sizeGuide';
import { ProductGallery } from './ProductGallery';
import { ProductDetail, defaultColor, imagesFor } from './ProductDetail';

/** Gallery + buy box sharing the selected colour, so picking a colour swaps the photos. */
export function ProductMain({ product, url, sizeTables }: { product: Product; url: string; sizeTables: SizeTable[] }) {
  const [color, setColor] = useState(() => defaultColor(product));
  return (
    <div className="md:container-site md:grid md:grid-cols-12 md:gap-10 lg:gap-16">
      <div className="md:col-span-7">
        <ProductGallery key={color} images={imagesFor(product, color)} name={product.name} />
      </div>
      <div className="container-site pt-6 md:col-span-5 md:px-0 md:pt-0">
        <div className="md:sticky md:top-[calc(var(--header-h)+2rem)]">
          <ProductDetail product={product} url={url} sizeTables={sizeTables} color={color} onColorChange={setColor} />
        </div>
      </div>
    </div>
  );
}

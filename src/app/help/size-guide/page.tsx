import type { Metadata } from 'next';
import { ContentPage } from '@/components/content/ContentPage';
import { SizeTables } from '@/components/product/SizeTables';
import { SIZE_TABLES } from '@/lib/sizeGuide';

export const metadata: Metadata = {
  title: 'Size guide',
  description: 'OSTREV size guide with garment measurements in cm for hoodies, tees and pants. Oversized fits — size down for regular.',
  alternates: { canonical: '/help/size-guide' },
};

export default function SizeGuidePage() {
  return (
    <ContentPage
      path="/help/size-guide"
      nav="help"
      eyebrow="Help"
      title="Size guide"
      intro={<p>Oversized fit — size down for a regular fit. All measurements in centimetres.</p>}
    >
      <h2>How to measure</h2>
      <p>
        The easiest way: lay a piece you like flat and compare it with the garment tables. To use the body table, measure
        yourself in light clothing.
      </p>
      <ul>
        <li><strong>Chest</strong> — around the fullest part, under the arms.</li>
        <li><strong>Waist</strong> — around your natural waistline.</li>
        <li><strong>Inseam</strong> — crotch seam to hem, on a pair of trousers that fit.</li>
      </ul>
      <div className="mt-10">
        <SizeTables tables={[SIZE_TABLES.body, SIZE_TABLES.tops, SIZE_TABLES.tees, SIZE_TABLES.bottoms]} />
      </div>
      <p className="mt-10">Beanies and bags are one size.</p>
    </ContentPage>
  );
}

import type { Metadata } from 'next';
import { ContentPage } from '@/components/content/ContentPage';
import { SizeTables } from '@/components/product/SizeTables';
import { sizeTables } from '@/lib/sizeGuide';
import { alternates } from '@/lib/locale';
import { pageLocale, type LocaleParams } from '@/lib/pageLocale';

type Props = { params: LocaleParams };

const COPY = {
  en: {
    title: 'Size guide',
    description: 'OSTREV size guide with garment measurements in cm for coats, knitwear, shirts and jeans, for women and men.',
    eyebrow: 'Help',
    intro: 'Women’s sizes run XS–XL, men’s S–XXL. Each product page says how it fits. All measurements in centimetres.',
    how: 'How to measure',
    howText:
      'The easiest way: lay a piece you like flat and compare it with the garment tables. To use the body table, measure yourself in light clothing.',
    points: [
      ['Chest', 'around the fullest part, under the arms.'],
      ['Waist', 'around your natural waistline.'],
      ['Inseam', 'crotch seam to hem, on a pair of trousers that fit.'],
    ],
    bags: 'Bags are one size; dimensions are on each product page.',
  },
  lt: {
    title: 'Dydžių lentelė',
    description: 'OSTREV dydžių lentelė su paltų, megztinių, marškinių ir džinsų išmatavimais centimetrais moterims ir vyrams.',
    eyebrow: 'Pagalba',
    intro: 'Moteriški dydžiai – nuo XS iki XL, vyriški – nuo S iki XXL. Kiekvienos prekės puslapyje parašyta, kaip ji tinka. Visi išmatavimai centimetrais.',
    how: 'Kaip išsimatuoti',
    howText:
      'Paprasčiausia: paguldykite mėgstamą drabužį ir palyginkite su drabužių lentelėmis. Kūno lentelei išsimatuokite vilkėdami lengvus drabužius.',
    points: [
      ['Krūtinė', 'per plačiausią vietą, po pažastimis.'],
      ['Juosmuo', 'per natūralią juosmens liniją.'],
      ['Vidinė siūlė', 'nuo tarpkojo siūlės iki apačios, matuojant tinkančias kelnes.'],
    ],
    bags: 'Rankinės yra vieno dydžio; jų matmenys nurodyti prekės puslapyje.',
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await pageLocale(params);
  return { title: COPY[locale].title, description: COPY[locale].description, alternates: alternates(locale, '/help/size-guide') };
}

export default async function SizeGuidePage({ params }: Props) {
  const locale = await pageLocale(params);
  const c = COPY[locale];
  const t = sizeTables(locale);
  return (
    <ContentPage locale={locale} path="/help/size-guide" nav="help" eyebrow={c.eyebrow} title={c.title} intro={<p>{c.intro}</p>}>
      <h2>{c.how}</h2>
      <p>{c.howText}</p>
      <ul>
        {c.points.map(([term, text]) => (
          <li key={term}>
            <strong>{term}</strong> — {text}
          </li>
        ))}
      </ul>
      <div className="mt-10">
        <SizeTables tables={[t.body, t.tops, t.tees, t.bottoms]} />
      </div>
      <p className="mt-10">{c.bags}</p>
    </ContentPage>
  );
}

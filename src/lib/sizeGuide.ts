import type { Category } from '@/lib/types';
import type { Locale } from './locale';

export interface SizeTable {
  title: string;
  note: string;
  columns: string[];
  rows: (string | number)[][];
}

type Key = 'tops' | 'tees' | 'bottoms' | 'body';

/** Garment measurements in cm, measured flat. Update from the factory spec sheet. */
const ROWS: Record<Key, (string | number)[][]> = {
  tops: [
    ['XS', 60, 68, 58],
    ['S', 63, 70, 59],
    ['M', 66, 72, 60],
    ['L', 69, 74, 61],
    ['XL', 72, 76, 62],
    ['XXL', 75, 78, 63],
  ],
  tees: [
    ['XS', 56, 68, 22],
    ['S', 59, 70, 23],
    ['M', 62, 72, 24],
    ['L', 65, 74, 25],
    ['XL', 68, 76, 26],
    ['XXL', 71, 78, 27],
  ],
  bottoms: [
    ['XS', 68, 104, 78, 26],
    ['S', 72, 108, 80, 27],
    ['M', 76, 112, 81, 28],
    ['L', 82, 118, 82, 29],
    ['XL', 88, 124, 83, 30],
    ['XXL', 94, 130, 84, 31],
  ],
  body: [
    ['XS', '84–88', '68–72', '160–168'],
    ['S', '88–94', '72–78', '166–174'],
    ['M', '94–100', '78–84', '172–180'],
    ['L', '100–106', '84–90', '178–186'],
    ['XL', '106–112', '90–96', '184–192'],
    ['XXL', '112–118', '96–102', '190–198'],
  ],
};

const TEXT: Record<Locale, Record<Key, Omit<SizeTable, 'rows'>>> = {
  en: {
    tops: {
      title: 'Coats, jackets & knitwear',
      note: 'Garment measured flat. Chest is armpit to armpit.',
      columns: ['Size', 'Chest', 'Length', 'Sleeve'],
    },
    tees: {
      title: 'Shirts & tops',
      note: 'Garment measured flat. Length is high point of shoulder to hem.',
      columns: ['Size', 'Chest', 'Length', 'Sleeve'],
    },
    bottoms: {
      title: 'Jeans & trousers',
      note: 'Waist measured relaxed, all the way round. Leg opening measured flat.',
      columns: ['Size', 'Waist', 'Hip', 'Inseam', 'Leg opening'],
    },
    body: {
      title: 'Find your size',
      note: 'Your body measurements. Many of our pieces are cut oversized — check the fit note on each product. Between sizes, size down for a closer fit.',
      columns: ['Size', 'Chest', 'Waist', 'Height'],
    },
  },
  lt: {
    tops: {
      title: 'Paltai, striukės ir megztiniai',
      note: 'Drabužis matuojamas paguldytas. Krūtinė – nuo pažasties iki pažasties.',
      columns: ['Dydis', 'Krūtinė', 'Ilgis', 'Rankovė'],
    },
    tees: {
      title: 'Marškiniai ir palaidinės',
      note: 'Drabužis matuojamas paguldytas. Ilgis – nuo aukščiausio peties taško iki apačios.',
      columns: ['Dydis', 'Krūtinė', 'Ilgis', 'Rankovė'],
    },
    bottoms: {
      title: 'Džinsai ir kelnės',
      note: 'Juosmuo matuojamas laisvai, aplink. Klešnės plotis matuojamas paguldžius.',
      columns: ['Dydis', 'Juosmuo', 'Klubai', 'Vidinė siūlė', 'Klešnės plotis'],
    },
    body: {
      title: 'Kaip išsirinkti dydį',
      note: 'Jūsų kūno išmatavimai. Daug mūsų drabužių yra laisvo kirpimo – žiūrėkite pastabą prie kiekvienos prekės. Jei esate tarp dydžių, rinkitės mažesnį.',
      columns: ['Dydis', 'Krūtinė', 'Juosmuo', 'Ūgis'],
    },
  },
};

export function sizeTables(locale: Locale = 'en'): Record<Key, SizeTable> {
  return Object.fromEntries(
    (Object.keys(ROWS) as Key[]).map((k) => [k, { ...TEXT[locale][k], rows: ROWS[k] }]),
  ) as Record<Key, SizeTable>;
}

export function tablesFor(category: Category, locale: Locale = 'en'): SizeTable[] {
  const t = sizeTables(locale);
  if (category === 'trousers') return [t.bottoms, t.body];
  if (category === 'shirts') return [t.tees, t.body];
  if (category === 'dresses') return [t.body];
  if (category === 'coats' || category === 'knitwear') return [t.tops, t.body];
  return [];
}

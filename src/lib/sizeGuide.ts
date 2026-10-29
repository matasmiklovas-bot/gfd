import type { Category } from '@/lib/types';

export interface SizeTable {
  title: string;
  note: string;
  columns: string[];
  rows: (string | number)[][];
}

/** Garment measurements in cm, measured flat. Update from the factory spec sheet. */
export const SIZE_TABLES: Record<'tops' | 'tees' | 'bottoms' | 'body', SizeTable> = {
  tops: {
    title: 'Coats, jackets & knitwear',
    note: 'Garment measured flat. Chest is armpit to armpit.',
    columns: ['Size', 'Chest', 'Length', 'Sleeve'],
    rows: [
      ['XS', 60, 68, 58],
      ['S', 63, 70, 59],
      ['M', 66, 72, 60],
      ['L', 69, 74, 61],
      ['XL', 72, 76, 62],
      ['XXL', 75, 78, 63],
    ],
  },
  tees: {
    title: 'Shirts & tops',
    note: 'Garment measured flat. Length is high point of shoulder to hem.',
    columns: ['Size', 'Chest', 'Length', 'Sleeve'],
    rows: [
      ['XS', 56, 68, 22],
      ['S', 59, 70, 23],
      ['M', 62, 72, 24],
      ['L', 65, 74, 25],
      ['XL', 68, 76, 26],
      ['XXL', 71, 78, 27],
    ],
  },
  bottoms: {
    title: 'Jeans & trousers',
    note: 'Waist measured relaxed, all the way round. Leg opening measured flat.',
    columns: ['Size', 'Waist', 'Hip', 'Inseam', 'Leg opening'],
    rows: [
      ['XS', 68, 104, 78, 26],
      ['S', 72, 108, 80, 27],
      ['M', 76, 112, 81, 28],
      ['L', 82, 118, 82, 29],
      ['XL', 88, 124, 83, 30],
      ['XXL', 94, 130, 84, 31],
    ],
  },
  body: {
    title: 'Find your size',
    note: 'Your body measurements. Many of our pieces are cut oversized — check the fit note on each product. Between sizes, size down for a closer fit.',
    columns: ['Size', 'Chest', 'Waist', 'Height'],
    rows: [
      ['XS', '84–88', '68–72', '160–168'],
      ['S', '88–94', '72–78', '166–174'],
      ['M', '94–100', '78–84', '172–180'],
      ['L', '100–106', '84–90', '178–186'],
      ['XL', '106–112', '90–96', '184–192'],
      ['XXL', '112–118', '96–102', '190–198'],
    ],
  },
};

export function tablesFor(category: Category): SizeTable[] {
  if (category === 'trousers') return [SIZE_TABLES.bottoms, SIZE_TABLES.body];
  if (category === 'shirts') return [SIZE_TABLES.tees, SIZE_TABLES.body];
  if (category === 'coats' || category === 'knitwear') return [SIZE_TABLES.tops, SIZE_TABLES.body];
  return [];
}

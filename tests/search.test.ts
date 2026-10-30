import { test } from 'node:test';
import assert from 'node:assert/strict';
import { searchProducts } from '@/lib/search';
import type { ProductSummary } from '@/lib/types';

const p = (handle: string, name: string, category: string, gender: string, colors: string[] = [], soldOut = false) =>
  ({ handle, name, category, gender, soldOut, colors: colors.map((c) => ({ name: c, slug: c, hex: '#000' })) }) as unknown as ProductSummary;

const catalog = [
  p('trench', 'Oversized Trench Coat', 'coats', 'women', ['Beige']),
  p('cardigan', 'Ilgas megztas kardiganas', 'knitwear', 'women', ['Geltona']),
  p('jumper', 'Fine Knit Jumper', 'knitwear', 'men', ['Black']),
  p('jeans', 'Mom Jeans', 'trousers', 'women', ['Mid blue'], true),
];

test('finds products by name, category synonym, colour and Lithuanian words, ignoring diacritics', () => {
  assert.deepEqual(searchProducts(catalog, 'trench').map((x) => x.handle), ['trench']);
  assert.deepEqual(searchProducts(catalog, 'paltas').map((x) => x.handle), ['trench']);
  assert.deepEqual(searchProducts(catalog, 'dzinsai').map((x) => x.handle), ['jeans']);
  assert.deepEqual(searchProducts(catalog, 'džinsai').map((x) => x.handle), ['jeans']);
  assert.deepEqual(searchProducts(catalog, 'black').map((x) => x.handle), ['jumper']);
});

test('every word must match, and a name match ranks above a synonym match', () => {
  assert.deepEqual(searchProducts(catalog, 'knit men').map((x) => x.handle), ['jumper']);
  assert.deepEqual(searchProducts(catalog, 'kardiganas').map((x) => x.handle), ['cardigan', 'jumper']);
  assert.deepEqual(searchProducts(catalog, 'coat jeans'), []);
  assert.deepEqual(searchProducts(catalog, '   '), []);
});

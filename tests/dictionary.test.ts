import { test } from 'node:test';
import assert from 'node:assert/strict';
import { COUNT, DICT, plural, translate } from '@/lib/dictionary';

test('Lithuanian plurals follow the one / few / many rules', () => {
  const cases: [number, string][] = [
    [0, '0 prekių'], [1, '1 prekė'], [2, '2 prekės'], [9, '9 prekės'], [10, '10 prekių'], [11, '11 prekių'],
    [12, '12 prekių'], [19, '19 prekių'], [20, '20 prekių'], [21, '21 prekė'], [22, '22 prekės'], [101, '101 prekė'],
    [111, '111 prekių'],
  ];
  for (const [n, expected] of cases) assert.equal(plural('lt', n, COUNT.items), expected, `n=${n}`);
});

test('English plurals', () => {
  assert.equal(plural('en', 1, COUNT.items), '1 item');
  assert.equal(plural('en', 0, COUNT.items), '0 items');
  assert.equal(plural('en', 2, COUNT.results), '2 results');
});

test('every dictionary key has non-empty English and Lithuanian text with the same placeholders', () => {
  for (const [key, value] of Object.entries(DICT)) {
    assert.ok(value.en.trim(), `${key}: empty en`);
    assert.ok(value.lt.trim(), `${key}: empty lt`);
    const vars = (s: string) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();
    assert.deepEqual(vars(value.lt), vars(value.en), `${key}: placeholders differ`);
  }
});

test('translate fills placeholders', () => {
  assert.equal(translate('lt', 'product.onlyLeft', { n: 2 }), 'Liko tik 2');
});

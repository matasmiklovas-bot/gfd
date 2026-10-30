import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatPrice, formatPriceShort } from '@/lib/money';

// Intl may use a no-break space; compare with plain spaces.
const plain = (s: string) => s.replace(/[  ]/g, ' ');

test('prices format per language', () => {
  assert.equal(plain(formatPrice(3999, 'en')), '€39.99');
  assert.equal(plain(formatPrice(3999, 'lt')), '39,99 €');
  assert.equal(plain(formatPrice(123456, 'lt')), '1 234,56 €');
});

test('short format drops ".00" only for whole euros', () => {
  assert.equal(plain(formatPriceShort(6000, 'en')), '€60');
  assert.equal(plain(formatPriceShort(6000, 'lt')), '60 €');
  assert.equal(plain(formatPriceShort(499, 'en')), '€4.99');
});

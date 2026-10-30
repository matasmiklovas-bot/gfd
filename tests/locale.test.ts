import { test } from 'node:test';
import assert from 'node:assert/strict';
import { alternates, lp, splitLocale } from '@/lib/locale';

test('lp prefixes Lithuanian paths and leaves English un-prefixed', () => {
  assert.equal(lp('en', '/women'), '/women');
  assert.equal(lp('lt', '/women'), '/lt/women');
  assert.equal(lp('lt', '/'), '/lt');
  assert.equal(lp('en', '/'), '/');
});

test('splitLocale reads the browser path and the /en path seen during server rendering alike', () => {
  assert.deepEqual(splitLocale('/lt/shop/coats/x'), { locale: 'lt', path: '/shop/coats/x' });
  assert.deepEqual(splitLocale('/lt'), { locale: 'lt', path: '/' });
  assert.deepEqual(splitLocale('/shop'), { locale: 'en', path: '/shop' });
  // Regression: this used to yield path "/en/checkout", giving /lt/en/... links and a hydration mismatch.
  assert.deepEqual(splitLocale('/en/checkout'), { locale: 'en', path: '/checkout' });
  assert.deepEqual(splitLocale('/en'), { locale: 'en', path: '/' });
  // Paths that only start with the letters of a locale are not locale-prefixed.
  assert.deepEqual(splitLocale('/ltd'), { locale: 'en', path: '/ltd' });
});

test('alternates give a canonical URL and hreflang for both languages plus x-default', () => {
  const a = alternates('lt', '/women');
  assert.equal(a.canonical, '/lt/women');
  assert.deepEqual(a.languages, { en: '/women', lt: '/lt/women', 'x-default': '/women' });
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { withBase } from '@/lib/basePath';

test('withBase leaves paths alone in the normal build', () => {
  delete process.env.NEXT_PUBLIC_BASE_PATH;
  delete process.env.NEXT_PUBLIC_STATIC_DEMO;
  assert.equal(withBase('/lt/search'), '/lt/search');
  assert.equal(withBase('/api/search-index/lt', { page: false }), '/api/search-index/lt');
});

test('in the static demo, pages get the sub-path and a trailing slash, files only the sub-path', () => {
  process.env.NEXT_PUBLIC_BASE_PATH = '/gfd';
  process.env.NEXT_PUBLIC_STATIC_DEMO = '1';
  assert.equal(withBase('/lt/search'), '/gfd/lt/search/');
  assert.equal(withBase('/lt/'), '/gfd/lt/');
  // Regression: the exported index is a file, "/api/search-index/lt/" 404s.
  assert.equal(withBase('/api/search-index/lt', { page: false }), '/gfd/api/search-index/lt');
  delete process.env.NEXT_PUBLIC_BASE_PATH;
  delete process.env.NEXT_PUBLIC_STATIC_DEMO;
});

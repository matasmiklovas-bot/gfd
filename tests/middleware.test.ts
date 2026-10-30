import { test } from 'node:test';
import assert from 'node:assert/strict';
import { NextRequest } from 'next/server';
import { middleware } from '@/middleware';

const run = (p: string) => middleware(new NextRequest(new URL(p, 'https://ostrev.com')));

test('un-prefixed paths are rewritten to the English pages', () => {
  assert.equal(run('/women').headers.get('x-middleware-rewrite'), 'https://ostrev.com/en/women');
  assert.equal(run('/').headers.get('x-middleware-rewrite'), 'https://ostrev.com/en');
});

test('/en/... permanently redirects to the un-prefixed URL', () => {
  const res = run('/en/women?x=1');
  assert.equal(res.status, 308);
  assert.equal(res.headers.get('location'), 'https://ostrev.com/women?x=1');
  assert.equal(run('/en').headers.get('location'), 'https://ostrev.com/');
});

test('Lithuanian paths pass through untouched', () => {
  const res = run('/lt/women');
  assert.equal(res.headers.get('x-middleware-rewrite'), null);
  assert.equal(res.headers.get('location'), null);
});

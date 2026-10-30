import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
type Img = { src: string; alt: string };
type P = { id: string; handle: string; name: string; price: number; images: Img[]; colorImages?: Record<string, Img[]>; colors: { slug: string }[] };
const products: P[] = JSON.parse(readFileSync(path.join(ROOT, 'data/products.json'), 'utf8'));
const lt = JSON.parse(readFileSync(path.join(ROOT, 'data/products.lt.json'), 'utf8'));
const imagesOf = (p: P) => [...p.images, ...Object.values(p.colorImages ?? {}).flat()];

test('ids, handles and names are unique in both languages', () => {
  for (const key of ['id', 'handle', 'name'] as const) {
    const values = products.map((p) => p[key]);
    assert.equal(new Set(values).size, values.length, `duplicate ${key}`);
  }
  const ltNames = products.map((p) => lt.products[p.handle]?.name);
  assert.equal(new Set(ltNames).size, ltNames.length, 'duplicate Lithuanian name');
});

test('every product has at least two photos, all present on disk', () => {
  for (const p of products) {
    assert.ok(p.images.length >= 2, `${p.handle} has ${p.images.length} photo(s)`);
    for (const img of imagesOf(p)) {
      assert.ok(existsSync(path.join(ROOT, 'public', img.src)), `${p.handle}: missing ${img.src}`);
      assert.ok(img.alt.length > 10, `${p.handle}: weak alt "${img.alt}"`);
    }
  }
});

test('no stock photo is used by two different products', () => {
  // README maps every file in public/images to its Pexels source.
  const readme = readFileSync(path.join(ROOT, 'README.md'), 'utf8');
  const source = new Map([...readme.matchAll(/^\| `([^`]+)` \| https:\/\/www\.pexels\.com\/photo\/(\d+)\//gm)].map((m) => [m[1], m[2]]));
  const owner = new Map<string, string>();
  for (const p of products) {
    for (const img of imagesOf(p)) {
      const file = img.src.replace('/images/', '');
      const id = source.get(file);
      assert.ok(id, `${file} has no source in the README image table`);
      const prev = owner.get(id);
      assert.ok(!prev || prev === p.handle, `Pexels ${id} is used by both ${prev} and ${p.handle}`);
      owner.set(id, p.handle);
    }
  }
});

test('prices are positive whole cents ending in 99', () => {
  for (const p of products) {
    assert.ok(Number.isInteger(p.price) && p.price > 0, p.handle);
    assert.equal(p.price % 100, 99, `${p.handle}: ${p.price}`);
  }
});

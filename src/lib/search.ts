import type { ProductSummary } from '@/lib/types';

const normalize = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]/g, ' ');

/** Every query word must match the start of a word in name, category or colour. */
export function searchProducts(products: ProductSummary[], query: string) {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  return products
    .map((p) => {
      const haystack = normalize(
        [p.name, p.category, p.category.replace(/s$/, ''), ...p.colors.map((c) => c.name)].join(' '),
      );
      const words = haystack.split(/\s+/);
      const nameWords = normalize(p.name).split(/\s+/);
      let score = 0;
      for (const term of terms) {
        if (!words.some((w) => w.startsWith(term))) return null;
        score += nameWords.some((w) => w.startsWith(term)) ? 2 : 1;
      }
      return { p, score: score - (p.soldOut ? 1 : 0) };
    })
    .filter((x): x is { p: ProductSummary; score: number } => x !== null)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.p);
}

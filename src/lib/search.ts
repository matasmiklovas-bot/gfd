import type { ProductSummary } from '@/lib/types';

const normalize = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]/g, ' ');

/** Extra words people search for, including Lithuanian, per category and gender. */
const SYNONYMS: Record<string, string> = {
  coats: 'coat jacket outerwear blazer paltas paltai striuke striukes svarkas',
  knitwear: 'knit knitwear sweater jumper pullover cardigan megztinis megztiniai',
  shirts: 'shirt shirts top tops tee t-shirt bodysuit marskiniai palaidine',
  dresses: 'dress dresses suknele sukneles',
  trousers: 'trousers pants jeans denim kelnes dzinsai',
  accessories: 'bag bags handbag accessories rankine rankines krepsys',
  women: 'women woman womens ladies moterims moteriski',
  men: 'men man mens vyrams vyriski',
};

/** Every query word must match the start of a word in name, category, colour or synonyms. */
export function searchProducts(products: ProductSummary[], query: string) {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  return products
    .map((p) => {
      const haystack = normalize(
        [p.name, p.category, SYNONYMS[p.category], SYNONYMS[p.gender], ...p.colors.map((c) => c.name)].join(' '),
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

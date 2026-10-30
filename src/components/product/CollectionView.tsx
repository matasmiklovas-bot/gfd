'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Category, Gender, ProductSummary, Size } from '@/lib/types';
import { ui, uiStore } from '@/lib/store';
import { useDialogBehavior, useScrollLock } from '@/lib/hooks';
import { CloseIcon, FilterIcon } from '@/components/ui/Icons';
import { ProductCard } from './ProductCard';
import { useT } from '@/lib/i18n';
import { COUNT, plural } from '@/lib/dictionary';
import { lp, type Locale } from '@/lib/locale';
import { useLocale } from '@/lib/useLocale';

type Sort = 'newest' | 'price-asc' | 'price-desc';

type Text = Record<Locale, string>;

const SORTS: { value: Sort; label: Text }[] = [
  { value: 'newest', label: { en: 'Newest', lt: 'Naujausi' } },
  { value: 'price-asc', label: { en: 'Price: low–high', lt: 'Kaina: nuo mažiausios' } },
  { value: 'price-desc', label: { en: 'Price: high–low', lt: 'Kaina: nuo didžiausios' } },
];

const SIZE_ORDER: Size[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'ONE SIZE'];

const PRICES = [
  { value: 'u30', label: { en: 'Under €30', lt: 'Iki 30 €' }, test: (c: number) => c < 3000 },
  { value: '30-60', label: { en: '€30–€60', lt: '30–60 €' }, test: (c: number) => c >= 3000 && c <= 6000 },
  { value: 'o60', label: { en: 'Over €60', lt: 'Virš 60 €' }, test: (c: number) => c > 6000 },
] as const;

const FAMILIES: { value: string; label: Text; hex: string; match: (slug: string) => boolean }[] = [
  { value: 'black', label: { en: 'Black', lt: 'Juoda' }, hex: '#111111', match: (s) => s === 'black' },
  { value: 'white', label: { en: 'White & ecru', lt: 'Balta ir ekru' }, hex: '#F1EBDF', match: (s) => ['white', 'ecru', 'cream'].includes(s) },
  {
    value: 'neutral',
    label: { en: 'Beige & brown', lt: 'Smėlio ir ruda' },
    hex: '#C8B49A',
    match: (s) => ['beige', 'oat', 'tan', 'camel', 'stone', 'champagne', 'caramel'].includes(s),
  },
  { value: 'grey', label: { en: 'Grey', lt: 'Pilka' }, hex: '#A6A8AB', match: (s) => s.includes('grey') },
  { value: 'blue', label: { en: 'Blue', lt: 'Mėlyna' }, hex: '#7C9CC4', match: (s) => s.includes('blue') },
  { value: 'green', label: { en: 'Green', lt: 'Žalia' }, hex: '#A9BFA8', match: (s) => s.includes('green') || s === 'sage' },
  { value: 'pink', label: { en: 'Pink & red', lt: 'Rožinė ir raudona' }, hex: '#F2C6D3', match: (s) => s.includes('pink') || s === 'red' },
  { value: 'yellow', label: { en: 'Yellow', lt: 'Geltona' }, hex: '#F2DF57', match: (s) => s === 'yellow' },
];

export const CATEGORY_LABELS: Record<Category, Text> = {
  coats: { en: 'Coats & jackets', lt: 'Paltai ir striukės' },
  knitwear: { en: 'Knitwear', lt: 'Megztiniai' },
  shirts: { en: 'Shirts & tops', lt: 'Marškiniai ir palaidinės' },
  dresses: { en: 'Dresses', lt: 'Suknelės' },
  trousers: { en: 'Jeans & trousers', lt: 'Džinsai ir kelnės' },
  accessories: { en: 'Bags', lt: 'Rankinės' },
};

const GENDER_LABELS: Record<Gender, Text> = { women: { en: 'Women', lt: 'Moterims' }, men: { en: 'Men', lt: 'Vyrams' } };

interface Filters {
  gender: string[];
  category: string[];
  size: string[];
  color: string[];
  price: string[];
}

const EMPTY: Filters = { gender: [], category: [], size: [], color: [], price: [] };
const KEYS = Object.keys(EMPTY) as (keyof Filters)[];

function applyFilters(products: ProductSummary[], f: Filters) {
  return products.filter((p) => {
    if (f.gender.length && !f.gender.includes(p.gender)) return false;
    if (f.category.length && !f.category.includes(p.category)) return false;
    if (f.size.length && !f.size.some((s) => p.availableSizes.includes(s as Size))) return false;
    if (f.color.length) {
      const fams = FAMILIES.filter((fam) => f.color.includes(fam.value));
      if (!p.colors.some((c) => fams.some((fam) => fam.match(c.slug)))) return false;
    }
    if (f.price.length && !PRICES.some((pr) => f.price.includes(pr.value) && pr.test(p.price))) return false;
    return true;
  });
}

function applySort(products: ProductSummary[], sort: Sort) {
  const list = [...products];
  if (sort === 'price-asc') list.sort((a, b) => a.price - b.price);
  else if (sort === 'price-desc') list.sort((a, b) => b.price - a.price);
  else list.sort((a, b) => b.releasedAt.localeCompare(a.releasedAt));
  // Sold-out pieces always sit at the end.
  return list.sort((a, b) => Number(a.soldOut) - Number(b.soldOut));
}

export function CollectionView({
  products,
  showCategoryFilter = true,
  showGenderFilter = true,
  quickCategories = false,
}: {
  products: ProductSummary[];
  showCategoryFilter?: boolean;
  showGenderFilter?: boolean;
  /** Bershka-style row of category chips above the grid (single choice). */
  quickCategories?: boolean;
}) {
  const locale = useLocale();
  const t = useT();
  const [filters, setFilters] = useState<Filters>(EMPTY);
  const [sort, setSort] = useState<Sort>('newest');
  const open = uiStore.useStore((s) => s.panel === 'filters');
  const panelRef = useRef<HTMLDivElement>(null);
  const close = useCallback(() => ui.close(), []);
  useScrollLock(open);
  useDialogBehavior(panelRef, open, close);

  // Read initial state from the URL once, then keep the URL in sync (shareable filtered views).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const next = { ...EMPTY };
    for (const key of KEYS) next[key] = params.get(key)?.split(',').filter(Boolean) ?? [];
    setFilters(next);
    const s = params.get('sort') as Sort | null;
    if (s && SORTS.some((x) => x.value === s)) setSort(s);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    for (const key of KEYS) {
      if (filters[key].length) params.set(key, filters[key].join(','));
      else params.delete(key);
    }
    if (sort !== 'newest') params.set('sort', sort);
    else params.delete('sort');
    const qs = params.toString();
    window.history.replaceState(window.history.state, '', `${window.location.pathname}${qs ? `?${qs}` : ''}`);
  }, [filters, sort]);

  const visible = useMemo(() => applySort(applyFilters(products, filters), sort), [products, filters, sort]);
  const activeCount = KEYS.reduce((n, k) => n + filters[k].length, 0);

  const options = useMemo(() => {
    const categories = (Object.keys(CATEGORY_LABELS) as Category[]).filter((c) => products.some((p) => p.category === c));
    const genders = (Object.keys(GENDER_LABELS) as Gender[]).filter((g) => products.some((p) => p.gender === g));
    const sizes = SIZE_ORDER.filter((s) => products.some((p) => p.sizes.includes(s)));
    const colors = FAMILIES.filter((fam) => products.some((p) => p.colors.some((c) => fam.match(c.slug))));
    return { categories, genders, sizes, colors };
  }, [products]);

  const toggle = (key: keyof Filters, value: string) =>
    setFilters((f) => ({
      ...f,
      [key]: f[key].includes(value) ? f[key].filter((v) => v !== value) : [...f[key], value],
    }));

  const chip = (active: boolean) =>
    `label inline-flex h-10 min-w-12 items-center justify-center gap-2 border px-3 transition-colors ${
      active ? 'border-ink bg-ink text-white' : 'border-line hover:border-ink'
    }`;

  return (
    <>
      {quickCategories && options.categories.length > 1 && (
        <div className="container-site pb-4">
          <div className="scroll-row -mx-4 px-4 md:mx-0 md:px-0" role="group" aria-label={t('filter.category')}>
            {[{ value: '', label: t('common.all') }, ...options.categories.map((c) => ({ value: c, label: CATEGORY_LABELS[c][locale] }))].map((item) => {
              const active = item.value ? filters.category.length === 1 && filters.category[0] === item.value : filters.category.length === 0;
              return (
                <button
                  key={item.value || 'all'}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFilters((f) => ({ ...f, category: item.value ? [item.value] : [] }))}
                  className={`label shrink-0 snap-start border px-4 py-2.5 transition-colors ${
                    active ? 'border-ink bg-ink text-white' : 'border-line hover:border-ink'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
      <div className="container-site sticky top-header z-10 flex h-14 items-center justify-between gap-4 border-b border-line bg-white">
        <button
          type="button"
          onClick={() => ui.open('filters')}
          className="label -ml-1 inline-flex h-11 items-center gap-2 px-1"
          aria-expanded={open}
          aria-controls="filters-panel"
        >
          <FilterIcon size={18} />
          {t('filter.title')}{activeCount > 0 && ` (${activeCount})`}
        </button>
        <p className="label hidden text-muted sm:block" aria-live="polite">
          {plural(locale, visible.length, COUNT.products)}
        </p>
        <label className="label flex items-center gap-2">
          <span className="sr-only sm:not-sr-only text-muted">{t('filter.sort')}</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="label h-11 cursor-pointer appearance-none bg-transparent pr-1 text-right focus:outline-none"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label[locale]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="container-site pb-20 pt-6 md:pb-28 md:pt-8">
        {visible.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-muted">{t('filter.none')}</p>
            <button type="button" className="btn-secondary mt-6" onClick={() => setFilters(EMPTY)}>
              {t('filter.clearAll')}
            </button>
          </div>
        ) : (
          <>
            <h2 className="sr-only">{t('filter.products')}</h2>
            <ul className="grid grid-cols-2 gap-x-3 gap-y-10 md:gap-x-4 lg:grid-cols-4 lg:gap-y-14">
              {visible.map((p, i) => (
                <li key={p.handle}>
                  <ProductCard product={p} priority={i < 4} />
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      {/* Filter panel */}
      <div className={`fixed inset-0 z-drawer ${open ? 'visible' : 'invisible transition-[visibility] duration-300'}`} inert={!open}>
        <button
          type="button"
          tabIndex={-1}
          aria-hidden="true"
          onClick={close}
          className={`absolute inset-0 bg-ink/40 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}
        />
        <div
          id="filters-panel"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="filters-title"
          className={`absolute inset-y-0 right-0 flex w-full max-w-[400px] flex-col bg-white transition-transform duration-300 ease-out ${
            open ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex h-header items-center justify-between border-b border-line px-5">
            <h2 id="filters-title" className="label">{t('filter.title')}</h2>
            <button type="button" onClick={close} className="-mr-3 inline-flex h-11 w-11 items-center justify-center" aria-label={t('filter.close')}>
              <CloseIcon />
            </button>
          </div>

          <div className="flex-1 space-y-8 overflow-y-auto px-5 py-6">
            {showGenderFilter && options.genders.length > 1 && (
              <fieldset>
                <legend className="label mb-3 text-muted">{t('filter.gender')}</legend>
                <div className="flex flex-wrap gap-2">
                  {options.genders.map((g) => (
                    <button key={g} type="button" aria-pressed={filters.gender.includes(g)} onClick={() => toggle('gender', g)} className={chip(filters.gender.includes(g))}>
                      {GENDER_LABELS[g][locale]}
                    </button>
                  ))}
                </div>
              </fieldset>
            )}

            {showCategoryFilter && options.categories.length > 1 && (
              <fieldset>
                <legend className="label mb-3 text-muted">{t('filter.category')}</legend>
                <div className="flex flex-wrap gap-2">
                  {options.categories.map((c) => (
                    <button key={c} type="button" aria-pressed={filters.category.includes(c)} onClick={() => toggle('category', c)} className={chip(filters.category.includes(c))}>
                      {CATEGORY_LABELS[c][locale]}
                    </button>
                  ))}
                </div>
              </fieldset>
            )}

            <fieldset>
              <legend className="label mb-3 text-muted">{t('filter.size')}</legend>
              <div className="flex flex-wrap gap-2">
                {options.sizes.map((s) => (
                  <button key={s} type="button" aria-pressed={filters.size.includes(s)} onClick={() => toggle('size', s)} className={chip(filters.size.includes(s))}>
                    {s}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="label mb-3 text-muted">{t('filter.colour')}</legend>
              <div className="flex flex-wrap gap-2">
                {options.colors.map((c) => (
                  <button key={c.value} type="button" aria-pressed={filters.color.includes(c.value)} onClick={() => toggle('color', c.value)} className={chip(filters.color.includes(c.value))}>
                    <span className="h-3 w-3 border border-concrete" style={{ backgroundColor: c.hex }} aria-hidden="true" />
                    {c.label[locale]}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="label mb-3 text-muted">{t('filter.price')}</legend>
              <div className="flex flex-wrap gap-2">
                {PRICES.map((p) => (
                  <button key={p.value} type="button" aria-pressed={filters.price.includes(p.value)} onClick={() => toggle('price', p.value)} className={chip(filters.price.includes(p.value))}>
                    {p.label[locale]}
                  </button>
                ))}
              </div>
            </fieldset>
          </div>

          <div className="grid grid-cols-2 gap-2 border-t border-line px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4">
            <button type="button" className="btn-secondary" onClick={() => setFilters(EMPTY)} disabled={activeCount === 0}>
              {t('filter.clear')}
            </button>
            <button type="button" className="btn-primary" onClick={close}>
              {t('filter.show', { n: visible.length })}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export function CategoryNav({ current }: { current?: Category }) {
  const locale = useLocale();
  const t = useT();
  const items: { href: string; label: string; active: boolean }[] = [
    { href: lp(locale, '/shop'), label: t('common.all'), active: !current },
    ...(Object.keys(CATEGORY_LABELS) as Category[]).map((c) => ({
      href: lp(locale, `/shop/${c}`),
      label: CATEGORY_LABELS[c][locale],
      active: current === c,
    })),
  ];
  return (
    <nav aria-label={t('filter.categories')} className="scroll-row -mx-4 px-4 md:mx-0 md:px-0">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={item.active ? 'page' : undefined}
          className={`label shrink-0 snap-start border px-4 py-2.5 transition-colors ${
            item.active ? 'border-ink bg-ink text-white' : 'border-line hover:border-ink'
          }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

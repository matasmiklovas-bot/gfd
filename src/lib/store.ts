'use client';

import { useSyncExternalStore } from 'react';
import type { CartLine } from '@/lib/types';

/**
 * Minimal store: module-level state, optional localStorage persistence,
 * cross-tab sync. Server render and hydration always see `initial`;
 * persisted state is applied right after hydration (no mismatch warnings).
 */
function createStore<T extends object>(initial: T, storageKey?: string) {
  let state = initial;
  let loaded = !storageKey;
  const listeners = new Set<() => void>();

  const read = () => {
    if (loaded || typeof window === 'undefined') return;
    loaded = true;
    try {
      const raw = window.localStorage.getItem(storageKey!);
      if (raw) state = { ...initial, ...JSON.parse(raw) };
    } catch {
      /* corrupted or blocked storage: keep defaults */
    }
  };

  const emit = () => listeners.forEach((l) => l());

  const set = (next: Partial<T> | ((prev: T) => Partial<T>)) => {
    read();
    const patch = typeof next === 'function' ? next(state) : next;
    state = { ...state, ...patch };
    if (storageKey) {
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(state));
      } catch {
        /* quota or private mode */
      }
    }
    emit();
  };

  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    const onStorage = (e: StorageEvent) => {
      if (e.key !== storageKey) return;
      loaded = false;
      read();
      emit();
    };
    if (storageKey) window.addEventListener('storage', onStorage);
    return () => {
      listeners.delete(listener);
      if (storageKey) window.removeEventListener('storage', onStorage);
    };
  };

  const get = () => {
    read();
    return state;
  };

  function useStore(): T;
  function useStore<S>(selector: (s: T) => S): S;
  function useStore<S>(selector?: (s: T) => S) {
    const pick = selector ?? ((s: T) => s as unknown as S);
    return useSyncExternalStore(
      subscribe,
      () => pick(get()),
      () => pick(initial),
    );
  }

  return { get, set, subscribe, useStore };
}

/* ---------- Cart ---------- */

export const cartStore = createStore<{ lines: CartLine[] }>({ lines: [] }, 'ostrev:cart');

export const cart = {
  add(line: Omit<CartLine, 'quantity'>, quantity = 1) {
    cartStore.set(({ lines }) => {
      const existing = lines.find((l) => l.key === line.key);
      if (existing) {
        return {
          lines: lines.map((l) =>
            l.key === line.key
              ? { ...l, ...line, quantity: Math.min(l.quantity + quantity, line.maxQuantity) }
              : l,
          ),
        };
      }
      return { lines: [...lines, { ...line, quantity: Math.min(quantity, line.maxQuantity) }] };
    });
  },
  setQuantity(key: string, quantity: number) {
    cartStore.set(({ lines }) => ({
      lines: lines
        .map((l) => (l.key === key ? { ...l, quantity: Math.min(quantity, l.maxQuantity) } : l))
        .filter((l) => l.quantity > 0),
    }));
  },
  remove(key: string) {
    cartStore.set(({ lines }) => ({ lines: lines.filter((l) => l.key !== key) }));
  },
  clear() {
    cartStore.set({ lines: [] });
  },
};

export const cartCount = (s: { lines: CartLine[] }) => s.lines.reduce((n, l) => n + l.quantity, 0);
export const cartSubtotal = (s: { lines: CartLine[] }) =>
  s.lines.reduce((n, l) => n + l.price * l.quantity, 0);

/* ---------- Wishlist ---------- */

export const wishlistStore = createStore<{ handles: string[] }>({ handles: [] }, 'ostrev:wishlist');

export function toggleWishlist(handle: string) {
  wishlistStore.set(({ handles }) => ({
    handles: handles.includes(handle) ? handles.filter((h) => h !== handle) : [handle, ...handles],
  }));
}

/* ---------- UI (not persisted) ---------- */

type Panel = 'cart' | 'menu' | 'search' | 'filters' | null;

/* ---------- Recently viewed ---------- */

export const recentStore = createStore<{ handles: string[] }>({ handles: [] }, 'ostrev:recent');

export const recent = {
  add(handle: string) {
    recentStore.set((s) => ({ handles: [handle, ...s.handles.filter((h) => h !== handle)].slice(0, 12) }));
  },
};

export const uiStore = createStore<{ panel: Panel }>({ panel: null });

export const ui = {
  open: (panel: Exclude<Panel, null>) => uiStore.set({ panel }),
  close: () => uiStore.set({ panel: null }),
};

/* ---------- Account (device-local until customer accounts are connected) ---------- */

export interface Address {
  id: string;
  name: string;
  line1: string;
  line2?: string;
  city: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface OrderRecord {
  id: string;
  createdAt: string;
  email: string;
  lines: Pick<CartLine, 'name' | 'colorName' | 'size' | 'quantity' | 'price' | 'image' | 'url'>[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  status: 'paid' | 'demo';
}

export const accountStore = createStore<{
  user: { email: string; name: string } | null;
  addresses: Address[];
  orders: OrderRecord[];
}>({ user: null, addresses: [], orders: [] }, 'ostrev:account');

/* ---------- Cookie consent ---------- */

export interface Consent {
  decided: boolean;
  analytics: boolean;
  marketing: boolean;
  updatedAt?: string;
}

export const consentStore = createStore<Consent>(
  { decided: false, analytics: false, marketing: false },
  'ostrev:consent',
);

/* ---------- Preferences ---------- */

export type Locale = 'en' | 'lt';

export const prefsStore = createStore<{ locale: Locale }>({ locale: 'en' }, 'ostrev:prefs');

/** sessionStorage key for an order between checkout submit and the success page. */
export const PENDING_ORDER_KEY = 'ostrev:pending-order';

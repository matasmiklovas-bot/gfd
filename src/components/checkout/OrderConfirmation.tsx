'use client';

import { useEffect } from 'react';
import { accountStore, cart, PENDING_ORDER_KEY, type OrderRecord } from '@/lib/store';

/** Clears the bag and moves the pending order into this device's order history (once). */
export function OrderConfirmation({ orderId, status }: { orderId: string; status: OrderRecord['status'] }) {
  useEffect(() => {
    cart.clear();
    try {
      const raw = sessionStorage.getItem(PENDING_ORDER_KEY);
      if (!raw) return;
      const pending = JSON.parse(raw) as OrderRecord;
      sessionStorage.removeItem(PENDING_ORDER_KEY);
      if (pending.id !== orderId) return;
      accountStore.set((s) =>
        s.orders.some((o) => o.id === pending.id) ? {} : { orders: [{ ...pending, status }, ...s.orders] },
      );
    } catch {
      /* ignore */
    }
  }, [orderId, status]);

  return null;
}

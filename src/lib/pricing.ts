/** Shared by client (cart, checkout summary) and server (order total). Amounts in cents. */
export const FREE_SHIPPING_THRESHOLD = 6000;
export const FLAT_SHIPPING = 499;

/** Free shipping is based on the merchandise subtotal before discounts. */
export function shippingFor(subtotal: number) {
  if (subtotal === 0) return 0;
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING;
}

export function amountToFreeShipping(subtotal: number) {
  return Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
}

export function discountAmount(subtotal: number, percent: number) {
  return Math.round((subtotal * percent) / 100);
}

export function orderTotals(subtotal: number, discountPercent = 0) {
  const discount = discountAmount(subtotal, discountPercent);
  const shipping = shippingFor(subtotal);
  return { subtotal, discount, shipping, total: subtotal - discount + shipping };
}

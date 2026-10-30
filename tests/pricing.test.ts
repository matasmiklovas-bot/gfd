import { test } from 'node:test';
import assert from 'node:assert/strict';
import { FLAT_SHIPPING, FREE_SHIPPING_THRESHOLD, amountToFreeShipping, orderTotals, shippingFor } from '@/lib/pricing';
import { lookupDiscount } from '@/lib/discounts';

test('shipping is flat below the threshold, free at and above it, zero for an empty bag', () => {
  assert.equal(shippingFor(0), 0);
  assert.equal(shippingFor(FREE_SHIPPING_THRESHOLD - 1), FLAT_SHIPPING);
  assert.equal(shippingFor(FREE_SHIPPING_THRESHOLD), 0);
  assert.equal(amountToFreeShipping(2999), FREE_SHIPPING_THRESHOLD - 2999);
  assert.equal(amountToFreeShipping(9999), 0);
});

test('free shipping is judged on the subtotal before the discount', () => {
  // €60.00 qualifies even though WELCOME10 brings the goods to €54.00.
  assert.deepEqual(orderTotals(6000, 10), { subtotal: 6000, discount: 600, shipping: 0, total: 5400 });
  assert.deepEqual(orderTotals(2999, 10), { subtotal: 2999, discount: 300, shipping: 499, total: 3198 });
});

test('discount codes are case- and whitespace-insensitive and unknown codes are rejected', () => {
  assert.deepEqual(lookupDiscount(' welcome10 '), { code: 'WELCOME10', percent: 10 });
  assert.equal(lookupDiscount('NOPE'), null);
  assert.equal(lookupDiscount(''), null);
  assert.equal(lookupDiscount(undefined), null);
});

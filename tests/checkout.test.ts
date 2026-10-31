import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkContact, orderRef } from '@/lib/checkout';

const valid = {
  email: 'a@b.lt',
  address: { firstName: 'A', lastName: 'B', line1: 'Gedimino pr. 1', city: 'Vilnius', postalCode: 'LT-01103', country: 'lt' },
};

test('a complete EU address passes and the country code is normalised', () => {
  const { fields, address } = checkContact(valid, 'lt');
  assert.deepEqual(fields, {});
  assert.equal(address.country, 'LT');
});

test('missing fields and non-EU countries are reported in the shopper language', () => {
  const { fields } = checkContact({ email: 'nope', address: { country: 'US' } }, 'lt');
  assert.deepEqual(Object.keys(fields).sort(), ['city', 'country', 'email', 'firstName', 'lastName', 'line1', 'postalCode']);
  assert.equal(fields.country, 'Siunčiame tik į ES šalis.');
  assert.equal(checkContact({ email: 'nope', address: {} }, 'en').fields.email, 'Enter a valid email address.');
});

test('order references look like OST-XXXXXX', () => {
  assert.match(orderRef(), /^OST-[0-9A-Z]{6}$/);
});

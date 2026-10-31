import 'server-only';

// Server-side entry point so codes are never shipped in the client bundle.
export { lookupDiscount } from './discountCodes';

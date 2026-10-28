import { lookupDiscount } from '@/lib/discounts';
import { json, str } from '@/lib/server/validate';

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const discount = lookupDiscount(str(body?.code, 40));
  if (!discount) return json({ error: 'This code is not valid.' }, 404);
  return json(discount);
}

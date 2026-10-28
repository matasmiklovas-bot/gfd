import { forward } from '@/lib/server/forward';
import { isEmail, json, str } from '@/lib/server/validate';

const TOPICS = new Set(['order', 'returns', 'sizing', 'wholesale', 'press', 'other']);

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return json({ error: 'Invalid request.' }, 400);
  if (str(body.company)) return json({ ok: true });

  const name = str(body.name, 100);
  const message = str(body.message, 4000);
  const errors: Record<string, string> = {};
  if (!name) errors.name = 'Enter your name.';
  if (!isEmail(body.email)) errors.email = 'Enter a valid email address.';
  if (message.length < 10) errors.message = 'Write at least a sentence.';
  if (Object.keys(errors).length) return json({ error: 'Check the highlighted fields.', fields: errors }, 422);

  const ok = await forward('CONTACT_WEBHOOK_URL', {
    name,
    email: body.email.trim(),
    topic: TOPICS.has(body.topic) ? body.topic : 'other',
    orderNumber: str(body.orderNumber, 40),
    message,
    createdAt: new Date().toISOString(),
  });
  if (!ok) return json({ error: 'Message not sent. Email us directly instead.' }, 502);
  return json({ ok: true });
}

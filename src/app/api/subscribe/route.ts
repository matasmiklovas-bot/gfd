import { forward } from '@/lib/server/forward';
import { isEmail, json, str } from '@/lib/server/validate';

const SOURCES = new Set(['newsletter', 'drop-notify']);

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return json({ error: 'Invalid request.' }, 400);
  // Honeypot filled: pretend success so bots learn nothing.
  if (str(body.company)) return json({ ok: true });
  if (!isEmail(body.email)) return json({ error: 'Enter a valid email address.' }, 422);
  const source = SOURCES.has(body.source) ? body.source : 'newsletter';

  const ok = await forward('NEWSLETTER_WEBHOOK_URL', {
    email: body.email.trim().toLowerCase(),
    source,
    consent: true,
    consentText: 'By signing up you agree to receive emails from OSTREV. Unsubscribe any time.',
    createdAt: new Date().toISOString(),
  });
  if (!ok) return json({ error: 'Could not sign you up right now. Try again in a minute.' }, 502);
  return json({ ok: true });
}

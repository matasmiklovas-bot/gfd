import 'server-only';

/**
 * Forwards a form submission to an external service (Klaviyo, Mailchimp, Zapier, own API…).
 * Without a configured URL it logs, so local development works with no setup.
 */
export async function forward(envVar: 'NEWSLETTER_WEBHOOK_URL' | 'CONTACT_WEBHOOK_URL', payload: Record<string, unknown>) {
  const url = process.env[envVar];
  if (!url) {
    console.info(`[${envVar} not set] submission:`, JSON.stringify(payload));
    return true;
  }
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8000),
    });
    return res.ok;
  } catch (err) {
    console.error(`[${envVar}] forward failed`, err);
    return false;
  }
}

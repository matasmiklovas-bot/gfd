import { getAllSummaries } from '@/lib/commerce';
import { LOCALES, isLocale } from '@/lib/locale';

// The search overlay's index, built once per language at build time and fetched only when search opens, so it is
// not repeated in every page's HTML.
export const dynamic = 'force-static';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return new Response('Not found', { status: 404 });
  const products = await getAllSummaries(locale);
  return Response.json(products);
}

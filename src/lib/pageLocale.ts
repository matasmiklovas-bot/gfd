import { notFound } from 'next/navigation';
import { isLocale, type Locale } from './locale';

export type LocaleParams = Promise<{ locale: string }>;

/** Reads and validates the [locale] route segment; unknown values 404. */
export async function pageLocale(params: Promise<{ locale: string }>): Promise<Locale> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return locale;
}

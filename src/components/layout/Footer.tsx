import Link from 'next/link';
import { FOOTER_LINKS, SITE } from '@/lib/site';
import { lp, type Locale } from '@/lib/locale';
import { getT } from '@/lib/dictionary';
import { InstagramIcon, TikTokIcon } from '@/components/ui/Icons';
import { LanguageSwitch } from './LanguageSwitch';
import { CookieSettingsLink } from './CookieBanner';

const PAYMENTS = ['Visa', 'Mastercard', 'Apple Pay', 'Google Pay', 'PayPal', 'Klarna'];

function Column({ title, links, locale }: { title: string; links: { href: string; label: Record<Locale, string> }[]; locale: Locale }) {
  return (
    <div>
      <h2 className="label mb-4 font-sans font-semibold text-concrete">{title}</h2>
      <ul className="space-y-1">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={lp(locale, l.href)} className="inline-block py-1 text-[14px] text-white/90 transition-colors hover:text-white">
              {l.label[locale]}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer({ locale }: { locale: Locale }) {
  const t = getT(locale);
  return (
    <footer className="on-dark bg-ink text-white">
      <div className="container-site pb-8 pt-16 md:pt-24">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
          <Column title={t('footer.shop')} links={FOOTER_LINKS.shop} locale={locale} />
          <Column title={t('footer.help')} links={FOOTER_LINKS.help} locale={locale} />
          <Column title={t('footer.legal')} links={FOOTER_LINKS.legal} locale={locale} />
          <div>
            <h2 className="label mb-4 font-sans font-semibold text-concrete">{t('footer.follow')}</h2>
            <ul className="flex gap-2">
              <li>
                <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" aria-label={t('footer.instagram')} className="-ml-2.5 inline-flex h-11 w-11 items-center justify-center hover:opacity-70">
                  <InstagramIcon />
                </a>
              </li>
              <li>
                <a href={SITE.tiktok} target="_blank" rel="noopener noreferrer" aria-label={t('footer.tiktok')} className="inline-flex h-11 w-11 items-center justify-center hover:opacity-70">
                  <TikTokIcon />
                </a>
              </li>
            </ul>
            <p className="mt-3 text-[14px] text-white/90">
              <a href={`mailto:${SITE.email}`} className="hover:text-white">{SITE.email}</a>
            </p>
          </div>
        </div>

        <ul className="mt-14 flex flex-wrap gap-2" aria-label={t('footer.payments')}>
          {PAYMENTS.map((p) => (
            <li key={p} className="label flex h-7 items-center border border-white/25 px-2.5 text-[10px] text-white/80">
              {p}
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-col gap-4 border-t border-white/15 pt-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-6">
            <LanguageSwitch />
            <span className="label text-white/80" title={t('footer.currency')}>EUR €</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[12px] text-white/60">
            <CookieSettingsLink />
            <span>© {new Date().getFullYear()} {SITE.company.legalName}. {t('footer.vat')}</span>
          </div>
        </div>
      </div>

      {/* textLength makes the wordmark fill the width exactly at any viewport. */}
      <svg aria-hidden="true" viewBox="0 0 1000 178" className="block w-full" focusable="false">
        <text
          x="0"
          y="172"
          textLength="1000"
          lengthAdjust="spacingAndGlyphs"
          fill="#FFFFFF"
          className="font-display font-black uppercase"
          style={{ fontSize: 236, fontStretch: '125%', letterSpacing: '-0.02em' }}
        >
          OSTREV
        </text>
      </svg>
    </footer>
  );
}

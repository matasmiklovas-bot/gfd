'use client';

import Link from 'next/link';
import { useCallback, useRef } from 'react';
import { MENU, NAV, FOOTER_LINKS } from '@/lib/site';
import { useT } from '@/lib/i18n';
import { ui, uiStore } from '@/lib/store';
import { useDialogBehavior, useScrollLock } from '@/lib/hooks';
import { CloseIcon } from '@/components/ui/Icons';
import { Logo } from './Logo';
import { LanguageSwitch } from './LanguageSwitch';

export function MobileMenu() {
  const t = useT();
  const open = uiStore.useStore((s) => s.panel === 'menu');
  const ref = useRef<HTMLDivElement>(null);
  const close = useCallback(() => ui.close(), []);
  useScrollLock(open);
  useDialogBehavior(ref, open, close);

  return (
    <div
      id="mobile-menu"
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label={t('nav.menu')}
      inert={!open}
      className={`fixed inset-0 z-overlay flex flex-col bg-white duration-300 ease-out md:hidden ${
        // Visibility flips instantly on open (so focus can move in) and transitions only on close.
        open ? 'visible opacity-100 transition-opacity' : 'invisible opacity-0 transition-[opacity,visibility]'
      }`}
    >
      <div className="container-site grid h-header grid-cols-[1fr_auto_1fr] items-center border-b border-line">
        <button
          type="button"
          onClick={close}
          className="-ml-3 inline-flex h-11 w-11 items-center justify-center"
          aria-label={t('nav.close')}
        >
          <CloseIcon />
        </button>
        <Logo onClick={close} />
        <span />
      </div>

      <nav aria-label="Mobile" className="container-site flex-1 overflow-y-auto pb-10 pt-8">
        <ul className="space-y-1">
          {NAV.map((item, i) => (
            <li
              key={item.href}
              className={`transition-all duration-500 ease-out ${open ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'}`}
              style={{ transitionDelay: open ? `${80 + i * 50}ms` : '0ms' }}
            >
              <Link href={item.href} onClick={close} className="heading-1 block py-1">
                {t(item.key)}
              </Link>
              {(item.href === '/women' || item.href === '/men') && (
                <ul className="mb-5 mt-1 flex flex-wrap gap-x-5 gap-y-1">
                  {MENU[item.href === '/women' ? 'women' : 'men'].map((m) => (
                    <li key={m.category}>
                      <Link href={`${item.href}/${m.category}`} onClick={close} className="block py-2 text-[15px] text-muted">
                        {m.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>

        <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-1 border-t border-line pt-6">
          <li><Link href="/account" onClick={close} className="label block py-3">{t('nav.account')}</Link></li>
          <li><Link href="/wishlist" onClick={close} className="label block py-3">{t('nav.wishlist')}</Link></li>
          {FOOTER_LINKS.help.map((l) => (
            <li key={l.href}>
              <Link href={l.href} onClick={close} className="label block py-3 text-muted">{l.label}</Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="container-site flex items-center justify-between border-t border-line py-4">
        <LanguageSwitch />
        <span className="label text-muted">EUR €</span>
      </div>
    </div>
  );
}

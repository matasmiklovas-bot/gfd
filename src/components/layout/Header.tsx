'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { NAV } from '@/lib/site';
import { useT } from '@/lib/i18n';
import { cartCount, cartStore, ui, uiStore } from '@/lib/store';
import { BagIcon, MenuIcon, SearchIcon, UserIcon, HeartIcon } from '@/components/ui/Icons';
import { Logo } from './Logo';

export function Header() {
  const t = useT();
  const pathname = usePathname();
  const count = cartStore.useStore(cartCount);
  const panel = uiStore.useStore((s) => s.panel);
  const [scrolled, setScrolled] = useState(false);

  // Only the home page has a full-bleed hero under the header.
  const overlay = pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => ui.close(), [pathname]);

  const transparent = overlay && !scrolled && panel !== 'search';

  const iconBtn =
    'inline-flex h-11 w-11 items-center justify-center transition-opacity hover:opacity-60';

  return (
    <header
      className={`sticky top-0 z-header h-header transition-colors duration-300 ease-out ${
        transparent ? 'on-dark bg-transparent text-white' : 'border-b border-line bg-white text-ink'
      }`}
    >
      <div className="container-site grid h-full grid-cols-[1fr_auto_1fr] items-center">
        <div className="flex items-center">
          <button
            type="button"
            className={`${iconBtn} -ml-3 md:hidden`}
            aria-label={t('nav.menu')}
            aria-expanded={panel === 'menu'}
            aria-controls="mobile-menu"
            onClick={() => ui.open('menu')}
          >
            <MenuIcon />
          </button>
          <button
            type="button"
            className={`${iconBtn} md:hidden`}
            aria-label={t('nav.search')}
            onClick={() => ui.open('search')}
          >
            <SearchIcon />
          </button>
          <nav aria-label="Main" className="hidden md:block">
            <ul className="flex items-center gap-7">
              {NAV.map((item) => {
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? 'page' : undefined}
                      className={`label py-2 transition-opacity hover:opacity-60 ${
                        active ? 'underline decoration-1 underline-offset-[6px]' : ''
                      }`}
                    >
                      {t(item.key)}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        <Logo />

        <div className="-mr-3 flex items-center justify-end">
          <button
            type="button"
            className={`${iconBtn} hidden md:inline-flex`}
            aria-label={t('nav.search')}
            onClick={() => ui.open('search')}
          >
            <SearchIcon />
          </button>
          <Link href="/account" className={`${iconBtn} hidden md:inline-flex`} aria-label={t('nav.account')}>
            <UserIcon />
          </Link>
          <Link href="/wishlist" className={`${iconBtn} hidden md:inline-flex`} aria-label={t('nav.wishlist')}>
            <HeartIcon />
          </Link>
          <button
            type="button"
            className={`${iconBtn} relative`}
            aria-label={`${t('nav.bag')}, ${count} ${count === 1 ? 'item' : 'items'}`}
            aria-expanded={panel === 'cart'}
            aria-controls="cart-drawer"
            onClick={() => ui.open('cart')}
          >
            <BagIcon />
            {count > 0 && (
              <span
                className={`absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center px-1 text-[10px] font-semibold leading-none tabular-nums ${
                  transparent ? 'bg-white text-ink' : 'bg-ink text-white'
                }`}
                aria-hidden="true"
              >
                {count}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

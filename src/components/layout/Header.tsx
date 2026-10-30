'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, type FocusEvent } from 'react';
import { MENU, NAV } from '@/lib/site';
import { lp, splitLocale } from '@/lib/locale';
import { useT } from '@/lib/i18n';
import { COUNT, plural } from '@/lib/dictionary';
import { cartCount, cartStore, ui, uiStore } from '@/lib/store';
import { BagIcon, MenuIcon, SearchIcon, UserIcon, HeartIcon } from '@/components/ui/Icons';
import { Logo } from './Logo';

export function Header() {
  const t = useT();
  const fullPath = usePathname();
  // Path without the /lt prefix, so the checks below work in both languages.
  const { locale, path: pathname } = splitLocale(fullPath);
  const L = (path: string) => lp(locale, path);
  const count = cartStore.useStore(cartCount);
  const panel = uiStore.useStore((s) => s.panel);
  const [scrolled, setScrolled] = useState(false);
  const [dropdown, setDropdown] = useState<'women' | 'men' | null>(null);

  // Only the home page has a full-bleed hero under the header.
  const overlay = pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    ui.close();
    setDropdown(null);
  }, [fullPath]);

  useEffect(() => {
    if (!dropdown) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setDropdown(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [dropdown]);

  const leave = (e: FocusEvent<HTMLLIElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setDropdown(null);
  };

  const transparent = overlay && !scrolled && panel !== 'search' && !dropdown;

  const iconBtn =
    'inline-flex h-11 w-11 items-center justify-center transition-opacity hover:opacity-60';

  // Checkout: logo, a way back to the bag and a reassurance line. No shop navigation.
  if (pathname === '/checkout') {
    return (
      <header className="sticky top-0 z-header h-header border-b border-line bg-white text-ink">
        <div className="container-site grid h-full grid-cols-[1fr_auto_1fr] items-center">
          <Link href={L('/shop')} className="label -ml-1 inline-flex h-11 items-center px-1 transition-opacity hover:opacity-60">
            ← <span className="ml-1 hidden sm:inline">{t('cart.continue')}</span><span className="ml-1 sm:hidden">{t('nav.shop')}</span>
          </Link>
          <Logo />
          <p className="label hidden justify-self-end text-muted sm:block">{t('checkout.secure')}</p>
        </div>
      </header>
    );
  }

  return (
    <header
      className={`sticky top-0 z-header h-header transition-colors duration-300 ease-out ${
        // The hero photography is light, so the header keeps ink text over it.
        transparent ? 'border-b border-transparent bg-transparent text-ink' : 'border-b border-line bg-white text-ink'
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
          <nav aria-label={t('nav.main')} className="hidden md:block">
            <ul className="flex items-center gap-7">
              {NAV.map((item) => {
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                const gender = item.href === '/women' ? 'women' : item.href === '/men' ? 'men' : null;
                const link = (
                  <Link
                    href={L(item.href)}
                    aria-current={active ? 'page' : undefined}
                    className={`label inline-block py-2 transition-opacity hover:opacity-60 ${
                      active ? 'underline decoration-1 underline-offset-[6px]' : ''
                    }`}
                  >
                    {t(item.key)}
                  </Link>
                );
                if (!gender) return <li key={item.href}>{link}</li>;
                const open = dropdown === gender;
                return (
                  <li
                    key={item.href}
                    className="flex h-header items-center"
                    onMouseEnter={() => setDropdown(gender)}
                    onMouseLeave={() => setDropdown(null)}
                    onFocus={() => setDropdown(gender)}
                    onBlur={leave}
                  >
                    {link}
                    <div
                      className={`absolute inset-x-0 top-full border-b border-line bg-white text-ink transition-[opacity,visibility] duration-200 ${
                        open ? 'visible opacity-100' : 'invisible opacity-0'
                      }`}
                    >
                      <div className="container-site grid grid-cols-[1fr_auto] gap-12 py-8">
                        <ul className="grid max-w-2xl auto-rows-min grid-cols-2 gap-x-16 gap-y-1 self-start lg:grid-cols-3">
                          {MENU[gender].map((m) => (
                            <li key={m.category}>
                              <Link
                                href={L(`/${gender}/${m.category}`)}
                                className="block py-2 text-[15px] transition-opacity hover:opacity-60"
                                tabIndex={open ? 0 : -1}
                              >
                                {m.label[locale]}
                              </Link>
                            </li>
                          ))}
                          <li>
                            <Link href={L(`/${gender}`)} className="label block py-3 underline underline-offset-4" tabIndex={open ? 0 : -1}>
                              {t('common.viewAll')}
                            </Link>
                          </li>
                        </ul>
                        <Link
                          href={L(`/${gender}`)}
                          className="group relative block aspect-[4/5] w-[200px] overflow-hidden bg-bone"
                          tabIndex={-1}
                          aria-hidden="true"
                        >
                          <Image
                            src={`/images/hero-${gender}.webp`}
                            alt=""
                            fill
                            sizes="200px"
                            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                          />
                          <span className="label absolute bottom-3 left-3 bg-white px-2 py-1">{t('nav.newIn')}</span>
                        </Link>
                      </div>
                    </div>
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
          <Link href={L('/account')} className={`${iconBtn} hidden md:inline-flex`} aria-label={t('nav.account')}>
            <UserIcon />
          </Link>
          <Link href={L('/wishlist')} className={`${iconBtn} hidden md:inline-flex`} aria-label={t('nav.wishlist')}>
            <HeartIcon />
          </Link>
          <button
            type="button"
            className={`${iconBtn} relative`}
            aria-label={`${t('nav.bag')}, ${plural(locale, count, COUNT.items)}`}
            aria-expanded={panel === 'cart'}
            aria-controls="cart-drawer"
            onClick={() => ui.open('cart')}
          >
            <BagIcon />
            {count > 0 && (
              <span
                className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center bg-ink px-1 text-[10px] font-semibold leading-none tabular-nums text-white"
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

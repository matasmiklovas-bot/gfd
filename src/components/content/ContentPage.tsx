import Link from 'next/link';
import type { ReactNode } from 'react';
import { FOOTER_LINKS } from '@/lib/site';

export function ContentPage({
  eyebrow,
  title,
  intro,
  nav,
  updated,
  path,
  children,
}: {
  eyebrow: string;
  title: string;
  intro?: ReactNode;
  nav: 'help' | 'legal';
  updated?: string;
  path: string;
  children: ReactNode;
}) {
  const links = FOOTER_LINKS[nav];
  return (
    <div className="container-site pb-24 pt-10 md:pt-16">
      <p className="label mb-4 text-muted">{eyebrow}</p>
      <h1 className="heading-1 max-w-3xl text-balance">{title}</h1>
      {intro && <div className="mt-6 max-w-prose text-[16px] leading-7">{intro}</div>}
      <div className="mt-12 grid gap-12 md:mt-16 md:grid-cols-12">
        <nav aria-label={nav === 'help' ? 'Help' : 'Legal'} className="md:col-span-3">
          <ul className="scroll-row -mx-4 px-4 md:mx-0 md:flex-col md:gap-0 md:overflow-visible md:px-0">
            {links.map((l) => (
              <li key={l.href} className="shrink-0">
                <Link
                  href={l.href}
                  aria-current={l.href === path ? 'page' : undefined}
                  className="label block aria-[current=page]:border-ink aria-[current=page]:underline border border-line px-4 py-2.5 hover:border-ink md:border-0 md:px-0 md:py-2 md:hover:underline"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="prose-ostrev md:col-span-8 md:col-start-5">
          {children}
          {updated && <p className="mt-12 text-[13px] text-muted">Last updated: {updated}</p>}
        </div>
      </div>
    </div>
  );
}

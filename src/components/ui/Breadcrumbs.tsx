import Link from 'next/link';
import { absoluteUrl } from '@/lib/site';
import { JsonLd } from '@/components/seo/JsonLd';

export function Breadcrumbs({ items, label = 'Breadcrumb' }: { items: { href: string; label: string }[]; label?: string }) {
  return (
    <>
      <nav aria-label={label} className="label text-muted">
        <ol className="flex flex-wrap items-center gap-2">
          {items.map((item, i) => (
            <li key={item.href} className={`flex items-center gap-2 ${i === items.length - 1 && i > 1 ? 'max-md:hidden' : ''}`}>
              {i > 0 && <span aria-hidden="true">/</span>}
              {i === items.length - 1 ? (
                <span aria-current="page" className="text-ink">{item.label}</span>
              ) : (
                <Link href={item.href} className="hover:text-ink">{item.label}</Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: items.map((item, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: item.label,
            item: absoluteUrl(item.href),
          })),
        }}
      />
    </>
  );
}

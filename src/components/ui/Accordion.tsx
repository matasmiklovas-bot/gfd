import type { ReactNode } from 'react';
import { PlusIcon } from './Icons';

/** Native <details>: keyboard and screen-reader accessible with zero JS. */
export function AccordionItem({
  title,
  children,
  defaultOpen = false,
  name,
}: {
  title: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  name?: string;
}) {
  return (
    <details className="group border-b border-line" open={defaultOpen} name={name}>
      <summary className="label flex min-h-14 cursor-pointer items-center justify-between gap-4 py-4">
        <span>{title}</span>
        <PlusIcon size={16} className="shrink-0 transition-transform duration-300 group-open:rotate-45" />
      </summary>
      <div className="pb-6 text-[15px] leading-7 text-ink">{children}</div>
    </details>
  );
}

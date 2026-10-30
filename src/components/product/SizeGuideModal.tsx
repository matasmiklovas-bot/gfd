'use client';

import Link from 'next/link';
import { useRef } from 'react';
import type { SizeTable } from '@/lib/sizeGuide';
import { CloseIcon } from '@/components/ui/Icons';
import { SizeTables } from './SizeTables';
import { useT } from '@/lib/i18n';
import { lp } from '@/lib/locale';
import { useLocale } from '@/lib/useLocale';

/** Native <dialog>: focus trap, Escape and backdrop handled by the browser. */
export function SizeGuideModal({ tables }: { tables: SizeTable[] }) {
  const ref = useRef<HTMLDialogElement>(null);
  const t = useT();
  const locale = useLocale();
  if (!tables.length) return null;

  return (
    <>
      <button type="button" onClick={() => ref.current?.showModal()} className="label text-muted underline underline-offset-4 hover:text-ink">
        {t('size.title')}
      </button>
      <dialog
        ref={ref}
        aria-labelledby="size-guide-title"
        onClick={(e) => e.target === ref.current && ref.current?.close()}
        className="m-0 ml-auto h-[100dvh] max-h-[100dvh] w-full max-w-[560px] bg-white p-0 text-ink backdrop:bg-ink/40 open:flex open:flex-col"
      >
        <div className="flex h-header shrink-0 items-center justify-between border-b border-line px-5">
          <h2 id="size-guide-title" className="label">{t('size.title')}</h2>
          <button type="button" onClick={() => ref.current?.close()} className="-mr-3 inline-flex h-11 w-11 items-center justify-center" aria-label={t('size.close')}>
            <CloseIcon />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-6">
          <p className="mb-8 text-[15px] leading-7">
            {t('size.intro')}
          </p>
          <SizeTables tables={tables} />
          <p className="mt-10 text-[13px] text-muted">
            {t('size.unsure')} <Link href={lp(locale, '/help/contact')} className="link-underline">{t('size.ask')}</Link> {t('size.reply')}
          </p>
        </div>
      </dialog>
    </>
  );
}

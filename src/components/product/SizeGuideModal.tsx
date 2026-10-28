'use client';

import Link from 'next/link';
import { useRef } from 'react';
import type { SizeTable } from '@/lib/sizeGuide';
import { CloseIcon } from '@/components/ui/Icons';
import { SizeTables } from './SizeTables';

/** Native <dialog>: focus trap, Escape and backdrop handled by the browser. */
export function SizeGuideModal({ tables }: { tables: SizeTable[] }) {
  const ref = useRef<HTMLDialogElement>(null);
  if (!tables.length) return null;

  return (
    <>
      <button type="button" onClick={() => ref.current?.showModal()} className="label text-muted underline underline-offset-4 hover:text-ink">
        Size guide
      </button>
      <dialog
        ref={ref}
        aria-labelledby="size-guide-title"
        onClick={(e) => e.target === ref.current && ref.current?.close()}
        className="m-0 ml-auto h-[100dvh] max-h-[100dvh] w-full max-w-[560px] bg-white p-0 text-ink backdrop:bg-ink/40 open:flex open:flex-col"
      >
        <div className="flex h-header shrink-0 items-center justify-between border-b border-line px-5">
          <h2 id="size-guide-title" className="label">Size guide</h2>
          <button type="button" onClick={() => ref.current?.close()} className="-mr-3 inline-flex h-11 w-11 items-center justify-center" aria-label="Close size guide">
            <CloseIcon />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-6">
          <p className="mb-8 text-[15px] leading-7">
            Oversized fit — size down for a regular fit. Compare the measurements below with a piece you already own.
          </p>
          <SizeTables tables={tables} />
          <p className="mt-10 text-[13px] text-muted">
            Still unsure? <Link href="/help/contact" className="link-underline">Ask us</Link> — we reply within one working day.
          </p>
        </div>
      </dialog>
    </>
  );
}

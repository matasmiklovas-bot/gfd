'use client';

import { MinusIcon, PlusIcon } from './Icons';
import { useT } from '@/lib/i18n';

export function QuantityStepper({
  value,
  max,
  min = 0,
  label,
  onChange,
}: {
  value: number;
  max: number;
  min?: number;
  label: string;
  onChange: (value: number) => void;
}) {
  const btn =
    'inline-flex h-9 w-9 items-center justify-center transition-colors hover:bg-bone disabled:cursor-not-allowed disabled:text-concrete disabled:hover:bg-transparent';
  const t = useT();
  return (
    <div className="inline-flex items-center border border-line" role="group" aria-label={t('qty.for', { name: label })}>
      <button
        type="button"
        className={btn}
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        aria-label={value - 1 <= 0 && min === 0 ? t('qty.remove', { name: label }) : t('qty.decrease')}
      >
        <MinusIcon size={14} />
      </button>
      <span className="w-8 text-center text-[13px] tabular-nums" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        className={btn}
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label={t('qty.increase')}
      >
        <PlusIcon size={14} />
      </button>
    </div>
  );
}

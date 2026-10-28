'use client';

import { useEffect, useState } from 'react';

function diff(target: number) {
  const ms = Math.max(0, target - Date.now());
  return {
    done: ms === 0,
    days: Math.floor(ms / 86_400_000),
    hours: Math.floor((ms / 3_600_000) % 24),
    minutes: Math.floor((ms / 60_000) % 60),
    seconds: Math.floor((ms / 1000) % 60),
  };
}

const pad = (n: number) => String(n).padStart(2, '0');

export function Countdown({ date, liveLabel }: { date: string; liveLabel: string }) {
  const target = new Date(date).getTime();
  // Rendered as placeholders on the server; real values after mount (avoids hydration mismatch).
  const [t, setT] = useState<ReturnType<typeof diff> | null>(null);

  useEffect(() => {
    setT(diff(target));
    const id = window.setInterval(() => setT(diff(target)), 1000);
    return () => window.clearInterval(id);
  }, [target]);

  if (t?.done) return <p className="heading-1">{liveLabel}</p>;

  const units: [string, number | undefined][] = [
    ['Days', t?.days],
    ['Hours', t?.hours],
    ['Min', t?.minutes],
    ['Sec', t?.seconds],
  ];

  return (
    <div role="timer" aria-label={t ? `${t.days} days, ${t.hours} hours, ${t.minutes} minutes left` : 'Countdown'} aria-live="off">
      <dl className="grid grid-cols-4 gap-2 md:gap-4">
        {units.map(([label, value]) => (
          <div key={label} className="flex flex-col-reverse gap-2 border-t border-white/25 pt-3">
            <dt className="label text-white/70">{label}</dt>
            <dd className="font-display text-[clamp(2.5rem,9vw,6rem)] font-black leading-none tabular-nums tracking-tight" style={{ fontStretch: '88%' }}>
              {value === undefined ? '--' : pad(value)}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

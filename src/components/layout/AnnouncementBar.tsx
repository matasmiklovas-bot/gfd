'use client';

import { useEffect, useState } from 'react';
import { useT, type TKey } from '@/lib/i18n';

const KEYS: TKey[] = ['ann.0', 'ann.1', 'ann.2'];

export function AnnouncementBar() {
  const t = useT();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % KEYS.length), 4500);
    return () => window.clearInterval(id);
  }, [paused]);

  return (
    <div
      className="on-dark relative h-8 overflow-hidden bg-ink text-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      role="region"
      aria-label="Announcements"
    >
      {KEYS.map((key, i) => (
        <p
          key={key}
          aria-hidden={i !== index}
          className={`label absolute inset-0 flex items-center justify-center px-4 text-center transition-all duration-500 ease-out ${
            i === index ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
          }`}
        >
          {t(key)}
        </p>
      ))}
    </div>
  );
}

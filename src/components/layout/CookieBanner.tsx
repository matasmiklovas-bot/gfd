'use client';

import Link from 'next/link';
import { useEffect, useId, useState } from 'react';
import { consentStore, type Consent } from '@/lib/store';
import { useMounted } from '@/lib/hooks';
import { useT } from '@/lib/i18n';

const OPEN_EVENT = 'ostrev:cookie-settings';

function save(choice: Pick<Consent, 'analytics' | 'marketing'>) {
  consentStore.set({ ...choice, decided: true, updatedAt: new Date().toISOString() });
}

function Toggle({
  label,
  description,
  checked,
  disabled,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (v: boolean) => void;
}) {
  const id = useId();
  return (
    <div className="flex items-start justify-between gap-4 border-t border-line py-3">
      <div>
        <label htmlFor={id} className="label block">{label}</label>
        <p id={`${id}-d`} className="mt-1 text-[13px] leading-snug text-muted">{description}</p>
      </div>
      <input
        id={id}
        type="checkbox"
        role="switch"
        aria-describedby={`${id}-d`}
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
        className="mt-0.5 h-5 w-9 shrink-0 cursor-pointer appearance-none border border-ink bg-white transition-colors before:block before:h-[14px] before:w-[14px] before:translate-x-[2px] before:translate-y-[2px] before:bg-ink before:transition-transform checked:bg-ink checked:before:translate-x-[18px] checked:before:bg-white disabled:cursor-not-allowed disabled:opacity-50"
      />
    </div>
  );
}

/**
 * GDPR banner. Nothing non-essential runs before a choice; Reject is as easy as Accept.
 * Read consent anywhere with `consentStore.get()` before loading analytics or pixels.
 */
export function CookieBanner() {
  const t = useT();
  const mounted = useMounted();
  const decided = consentStore.useStore((s) => s.decided);
  const stored = consentStore.useStore();
  const [settings, setSettings] = useState(false);
  const [forced, setForced] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const onOpen = () => {
      setAnalytics(consentStore.get().analytics);
      setMarketing(consentStore.get().marketing);
      setSettings(true);
      setForced(true);
    };
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_EVENT, onOpen);
  }, []);

  if (!mounted || (decided && !forced)) return null;

  const finish = (choice: Pick<Consent, 'analytics' | 'marketing'>) => {
    save(choice);
    setForced(false);
    setSettings(false);
  };

  return (
    <div
      role="region"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-banner p-2 md:bottom-4 md:left-4 md:right-auto md:max-w-[420px] md:p-0"
    >
      <div className="max-h-[80dvh] overflow-y-auto border border-ink bg-white p-4 md:p-5">
        <p className="text-[12px] leading-snug md:text-[13px] md:leading-relaxed">
          {t('cookie.text')}{' '}
          <Link href="/legal/cookies" className="link-underline">Cookie policy</Link>
        </p>

        {settings && (
          <div className="mt-4">
            <Toggle label="Necessary" description="Cart, checkout, security and your cookie choice. Always on." checked disabled />
            <Toggle label="Analytics" description="Anonymous usage statistics that help us improve the store." checked={analytics} onChange={setAnalytics} />
            <Toggle label="Marketing" description="Measure ads on Instagram and TikTok." checked={marketing} onChange={setMarketing} />
          </div>
        )}

        <div className="mt-3 grid grid-cols-[auto_1fr_1fr] items-center gap-2 md:mt-4">
          <button
            type="button"
            disabled={settings}
            onClick={() => {
              setAnalytics(stored.analytics);
              setMarketing(stored.marketing);
              setSettings(true);
            }}
            className="label px-1 py-2 text-muted underline-offset-4 hover:text-ink hover:underline disabled:invisible"
          >
            {t('cookie.settings')}
          </button>
          <button type="button" className="btn-secondary h-10 px-2 md:h-11" onClick={() => finish({ analytics: false, marketing: false })}>
            {t('cookie.reject')}
          </button>
          {settings ? (
            <button type="button" className="btn-secondary h-10 px-2 md:h-11" onClick={() => finish({ analytics, marketing })}>
              {t('cookie.save')}
            </button>
          ) : (
            <button type="button" className="btn-secondary h-10 px-2 md:h-11" onClick={() => finish({ analytics: true, marketing: true })}>
              {t('cookie.accept')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function CookieSettingsLink({ className = 'hover:text-white' }: { className?: string }) {
  return (
    <button type="button" className={className} onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))}>
      Cookie settings
    </button>
  );
}

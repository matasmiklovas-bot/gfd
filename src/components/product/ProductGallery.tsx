'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { ProductImage } from '@/lib/types';
import { CloseIcon } from '@/components/ui/Icons';
import { useScrollLock } from '@/lib/hooks';

export function ProductGallery({ images, name }: { images: ProductImage[]; name: string }) {
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState<{ i: number; x: number; y: number } | null>(null);
  const track = useRef<HTMLUListElement>(null);

  const onScroll = useCallback(() => {
    const el = track.current;
    if (!el) return;
    setIndex(Math.round(el.scrollLeft / el.clientWidth));
  }, []);

  const openZoom = (i: number, e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    // Keyboard activation has no pointer position: zoom into the centre.
    const x = e.clientX ? (e.clientX - rect.left) / rect.width : 0.5;
    const y = e.clientY ? (e.clientY - rect.top) / rect.height : 0.5;
    setZoom({ i, x, y });
  };

  return (
    <div className="relative">
      <ul
        ref={track}
        onScroll={onScroll}
        className="scroll-row gap-0 md:grid md:grid-cols-1 md:gap-1 md:overflow-visible"
        aria-label={`${name} images`}
      >
        {images.map((img, i) => (
          <li key={img.src} className="w-full shrink-0 snap-center md:w-auto">
            <button
              type="button"
              onClick={(e) => openZoom(i, e)}
              className="relative block aspect-[4/5] w-full cursor-zoom-in overflow-hidden bg-bone"
              aria-label={`Zoom image ${i + 1} of ${images.length}`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                priority={i === 0}
                sizes="(min-width: 768px) 58vw, 100vw"
                className="object-cover"
              />
            </button>
          </li>
        ))}
      </ul>

      {images.length > 1 && (
        <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center gap-1.5 md:hidden" aria-hidden="true">
          {images.map((img, i) => (
            <span key={img.src} className={`h-[2px] w-6 transition-colors ${i === index ? 'bg-ink' : 'bg-ink/25'}`} />
          ))}
        </div>
      )}

      {zoom && <ZoomView image={images[zoom.i]} focus={zoom} onClose={() => setZoom(null)} />}
    </div>
  );
}

function ZoomView({
  image,
  focus,
  onClose,
}: {
  image: ProductImage;
  focus: { x: number; y: number };
  onClose: () => void;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  useScrollLock(true);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      previous?.focus();
    };
  }, [onClose]);

  const center = () => {
    const el = scroller.current;
    if (!el) return;
    el.scrollLeft = (el.scrollWidth - el.clientWidth) * focus.x;
    el.scrollTop = (el.scrollHeight - el.clientHeight) * focus.y;
  };

  return (
    <div role="dialog" aria-modal="true" aria-label="Zoomed image" className="fixed inset-0 z-drawer bg-white">
      <div ref={scroller} className="h-full w-full cursor-zoom-out overflow-auto" onClick={onClose}>
        <Image
          src={image.src}
          alt={image.alt}
          width={1200}
          height={1500}
          sizes="200vw"
          quality={85}
          onLoad={center}
          className="h-auto w-[200vw] max-w-none md:w-[120vw]"
        />
      </div>
      <button
        ref={closeBtn}
        type="button"
        onClick={onClose}
        className="absolute right-3 top-3 inline-flex h-11 w-11 items-center justify-center bg-white"
        aria-label="Close zoom"
      >
        <CloseIcon />
      </button>
    </div>
  );
}

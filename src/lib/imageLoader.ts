// Static demo build only (next.config.mjs): images are served as-is from public/, under the site's base path.
export default function imageLoader({ src }: { src: string; width: number; quality?: number }) {
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}${src}`;
}

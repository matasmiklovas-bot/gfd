import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container-site flex min-h-[70vh] flex-col justify-center py-20">
      <p className="label mb-4 text-muted">404</p>
      <h1 className="heading-display">Not here</h1>
      <p className="mt-6 max-w-sm text-[15px] text-muted">This page does not exist, or it sold out and went with it.</p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/shop" className="btn-primary">Shop</Link>
        <Link href="/" className="btn-secondary">Home</Link>
      </div>
    </div>
  );
}

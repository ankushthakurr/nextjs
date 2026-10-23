import Link from 'next/link';
export default function NotFound() {
  return (
    <div className="wrap page">
      <h1>Page not found</h1>
      <p>
        That story moved or never existed. <Link href="/">See today&apos;s trending story</Link>.
      </p>
    </div>
  );
}

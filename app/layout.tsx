import type { Metadata } from 'next';
import Link from 'next/link';
import { site, categories } from '@/lib/site';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name}: Today's Trending Topics, Explained`, template: `%s | ${site.name}` },
  description: site.description,
  applicationName: site.name,
  alternates: { canonical: '/', types: { 'application/rss+xml': '/feed.xml' } },
  openGraph: { type: 'website', siteName: site.name, locale: site.locale, url: site.url },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true, 'max-image-preview': 'large' } as Metadata['robots'],
};

const nav = ['technology', 'business', 'science', 'health', 'entertainment', 'sports'];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const orgLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: site.name,
    url: site.url,
    description: site.description,
    publisher: { '@type': 'Organization', name: site.name, logo: { '@type': 'ImageObject', url: `${site.url}/icon.svg` } },
  };
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <div className="wrap">
            <Link href="/" className="logo">
              Trend<span>Pulse</span>
            </Link>
            <nav className="nav" aria-label="Categories">
              {nav.map((c, i) => (
                <Link key={c} href={`/category/${c}`} className={i > 2 ? 'hide-sm' : undefined}>
                  {categories[c].split(' ')[0]}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="site-footer">
          <div className="wrap">
            <div>
              <Link href="/about">About</Link>
              <Link href="/feed.xml">RSS</Link>
              <Link href="/sitemap.xml">Sitemap</Link>
            </div>
            <div>© {new Date().getFullYear()} {site.name}. A new story every day.</div>
          </div>
        </footer>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }} />
      </body>
    </html>
  );
}

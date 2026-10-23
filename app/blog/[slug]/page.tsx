import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllPosts, getPost, getRelated } from '@/lib/posts';
import { site, categories } from '@/lib/site';
import { PostCard, formatDate } from '@/components/PostCard';

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const post = await getPost((await params).slug);
  if (!post) return {};
  const url = `/blog/${post.slug}`;
  return {
    title: { absolute: post.metaTitle },
    description: post.description,
    keywords: post.keywords,
    authors: [{ name: post.author }],
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title: post.metaTitle,
      description: post.description,
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      section: categories[post.category],
      tags: post.tags,
    },
    twitter: { card: 'summary_large_image', title: post.metaTitle, description: post.description },
  };
}

export default async function PostPage({ params }: Params) {
  const post = await getPost((await params).slug);
  if (!post) notFound();
  const related = getRelated(post);
  const url = `${site.url}/blog/${post.slug}`;
  const catName = categories[post.category] ?? post.category;

  const ld = [
    {
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      headline: post.title,
      description: post.description,
      image: [`${url}/opengraph-image`],
      datePublished: post.date,
      dateModified: post.updated ?? post.date,
      author: { '@type': 'Organization', name: post.author, url: `${site.url}/about` },
      publisher: { '@type': 'Organization', name: site.name, logo: { '@type': 'ImageObject', url: `${site.url}/icon.svg` } },
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
      articleSection: catName,
      keywords: post.keywords.join(', '),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
        { '@type': 'ListItem', position: 2, name: catName, item: `${site.url}/category/${post.category}` },
        { '@type': 'ListItem', position: 3, name: post.title, item: url },
      ],
    },
    ...(post.faq.length
      ? [
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: post.faq.map((f) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          },
        ]
      : []),
  ];

  return (
    <div className="wrap">
      <div className="article">
        <article>
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link> / <Link href={`/category/${post.category}`}>{catName}</Link>
          </nav>
          <div className="eyebrow">Trending now</div>
          <h1>{post.title}</h1>
          <p className="dek">{post.description}</p>
          <div className="meta">
            <span>By {post.author}</span>
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            {post.updated && <span>Updated {formatDate(post.updated)}</span>}
            <span>{post.readingMinutes} min read</span>
          </div>
          <figure className="figure">
            <img src={post.image} alt={post.imageAlt} width={1200} height={630} />
            {post.imageCredit && <figcaption>{post.imageCredit}</figcaption>}
          </figure>
          <div className="prose" dangerouslySetInnerHTML={{ __html: post.html }} />

          {post.faq.length > 0 && (
            <section className="faq">
              <h2>Frequently asked questions</h2>
              {post.faq.map((f) => (
                <details key={f.q}>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </section>
          )}
          {post.sources.length > 0 && (
            <section className="sources">
              <h4>Sources</h4>
              <ol>
                {post.sources.map((s) => (
                  <li key={s.url}>
                    <a href={s.url} target="_blank" rel="noopener nofollow">
                      {s.title}
                    </a>
                  </li>
                ))}
              </ol>
            </section>
          )}
          {post.tags.length > 0 && (
            <div className="tags">
              {post.tags.map((t) => (
                <span key={t} className="chip">
                  #{t}
                </span>
              ))}
            </div>
          )}
        </article>
        <aside className="aside">
          {post.headings.length > 0 && (
            <>
              <h4>In this story</h4>
              <ul className="toc">
                {post.headings.map((h) => (
                  <li key={h.id}>
                    <a href={`#${h.id}`}>{h.text}</a>
                  </li>
                ))}
              </ul>
            </>
          )}
        </aside>
      </div>
      {related.length > 0 && (
        <section className="related">
          <h2 style={{ fontFamily: 'var(--serif)', marginTop: 32 }}>Keep reading</h2>
          <div className="grid">
            {related.map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </div>
        </section>
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </div>
  );
}

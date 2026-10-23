import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';
import { site, categories } from '@/lib/site';
import { PostCard, formatDate } from '@/components/PostCard';

export default function Home() {
  const [latest, ...rest] = getAllPosts();
  return (
    <div className="wrap">
      <section className="hero">
        <div className="eyebrow">Updated daily</div>
        <h1>What the world is searching for today, explained.</h1>
        <p>{site.tagline}</p>
      </section>
      {latest && (
        <Link href={`/blog/${latest.slug}`} className="featured">
          <img src={latest.image} alt={latest.imageAlt} width={1200} height={630} />
          <div>
            <div className="eyebrow">Today&apos;s trending story</div>
            <h2>{latest.title}</h2>
            <p>{latest.description}</p>
            <div className="meta">
              <span className="chip">{categories[latest.category] ?? latest.category}</span>
              <time dateTime={latest.date}>{formatDate(latest.date)}</time>
              <span>{latest.readingMinutes} min read</span>
            </div>
          </div>
        </Link>
      )}
      {rest.length > 0 && (
        <section className="grid" aria-label="Recent stories">
          {rest.map((p) => (
            <PostCard key={p.slug} post={p} />
          ))}
        </section>
      )}
      {!latest && <p style={{ padding: '40px 0' }}>The first story lands soon.</p>}
    </div>
  );
}

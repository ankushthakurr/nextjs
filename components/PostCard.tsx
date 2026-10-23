import Link from 'next/link';
import type { PostMeta } from '@/lib/posts';
import { categories } from '@/lib/site';

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
}

export function PostCard({ post }: { post: PostMeta }) {
  return (
    <Link href={`/blog/${post.slug}`} className="card">
      <img src={post.image} alt={post.imageAlt} width={1200} height={630} loading="lazy" />
      <div className="meta">
        <span className="chip">{categories[post.category] ?? post.category}</span>
        <time dateTime={post.date}>{formatDate(post.date)}</time>
        <span>{post.readingMinutes} min read</span>
      </div>
      <h3>{post.title}</h3>
      <p>{post.description}</p>
    </Link>
  );
}

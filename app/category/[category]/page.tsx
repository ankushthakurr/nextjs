import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllPosts } from '@/lib/posts';
import { categories, site } from '@/lib/site';
import { PostCard } from '@/components/PostCard';

type Params = { params: Promise<{ category: string }> };

export function generateStaticParams() {
  return Object.keys(categories).map((category) => ({ category }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { category } = await params;
  const name = categories[category];
  return {
    title: `${name} News and Trends`,
    description: `The latest trending ${name.toLowerCase()} stories, explained in depth by ${site.name}.`,
    alternates: { canonical: `/category/${category}` },
  };
}

export default async function CategoryPage({ params }: Params) {
  const { category } = await params;
  const name = categories[category];
  if (!name) notFound();
  const posts = getAllPosts().filter((p) => p.category === category);
  return (
    <div className="wrap">
      <section className="hero">
        <div className="eyebrow">Category</div>
        <h1>{name}</h1>
        <p>Trending {name.toLowerCase()} stories, explained.</p>
      </section>
      {posts.length ? (
        <section className="grid">
          {posts.map((p) => (
            <PostCard key={p.slug} post={p} />
          ))}
        </section>
      ) : (
        <p style={{ padding: '24px 0 64px', color: 'var(--muted)' }}>No stories here yet. Check back tomorrow.</p>
      )}
    </div>
  );
}

import { ImageResponse } from 'next/og';
import { getAllPosts } from '@/lib/posts';
import { site, categories } from '@/lib/site';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export default async function OG({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getAllPosts().find((p) => p.slug === slug);
  const title = post?.title ?? site.name;
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          background: 'linear-gradient(135deg, #16151a 0%, #2b1b2e 55%, #e5484d 140%)',
          color: 'white',
        }}
      >
        <div style={{ display: 'flex', fontSize: 30, letterSpacing: 4, textTransform: 'uppercase', color: '#ff9da0' }}>
          {post ? categories[post.category] ?? post.category : 'Trending'}
        </div>
        <div style={{ display: 'flex', fontSize: title.length > 70 ? 56 : 68, fontWeight: 700, lineHeight: 1.1 }}>{title}</div>
        <div style={{ display: 'flex', fontSize: 30 }}>
          Trend<span style={{ color: '#ff6369' }}>Pulse</span>&nbsp;Daily
        </div>
      </div>
    ),
    size,
  );
}

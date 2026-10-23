import type { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/posts';
import { site, categories } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const latest = posts[0]?.date ?? new Date().toISOString();
  return [
    { url: site.url, lastModified: latest, changeFrequency: 'daily', priority: 1 },
    { url: `${site.url}/about`, changeFrequency: 'yearly', priority: 0.3 },
    ...Object.keys(categories).map((c) => ({
      url: `${site.url}/category/${c}`,
      lastModified: latest,
      changeFrequency: 'daily' as const,
      priority: 0.5,
    })),
    ...posts.map((p) => ({
      url: `${site.url}/blog/${p.slug}`,
      lastModified: p.updated ?? p.date,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
      images: [`${site.url}${p.image}`],
    })),
  ];
}

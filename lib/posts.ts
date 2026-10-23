import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeStringify from 'rehype-stringify';
import GithubSlugger from 'github-slugger';

const POSTS_DIR = path.join(process.cwd(), 'content/posts');

export type FAQ = { q: string; a: string };

export type PostMeta = {
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  date: string;
  updated?: string;
  category: string;
  tags: string[];
  keywords: string[];
  focusKeyword: string;
  image: string;
  imageAlt: string;
  imageCredit?: string;
  author: string;
  faq: FAQ[];
  sources: { title: string; url: string }[];
  readingMinutes: number;
};

export type Post = PostMeta & { html: string; headings: { id: string; text: string }[] };

function readFile(file: string): { meta: PostMeta; content: string } {
  const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8');
  const { data, content } = matter(raw);
  const slug = data.slug || file.replace(/\.md$/, '');
  const meta: PostMeta = {
    slug,
    title: data.title,
    metaTitle: data.metaTitle || data.title,
    description: data.description,
    date: new Date(data.date).toISOString(),
    updated: data.updated ? new Date(data.updated).toISOString() : undefined,
    category: data.category || 'world',
    tags: data.tags || [],
    keywords: data.keywords || [],
    focusKeyword: data.focusKeyword || '',
    image: data.image || `/images/posts/${slug}.svg`,
    imageAlt: data.imageAlt || data.title,
    imageCredit: data.imageCredit,
    author: data.author || 'TrendPulse Editorial',
    faq: data.faq || [],
    sources: data.sources || [],
    readingMinutes: Math.max(1, Math.round(readingTime(content).minutes)),
  };
  return { meta, content };
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((f) => readFile(f).meta)
    .filter((p) => new Date(p.date).getTime() <= Date.now() + 36e5 * 24)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPost(slug: string): Promise<Post | null> {
  const file = fs.readdirSync(POSTS_DIR).find((f) => readFile(f).meta.slug === slug);
  if (!file) return null;
  const { meta, content } = readFile(file);
  const html = String(
    await unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkRehype)
      .use(rehypeSlug)
      .use(rehypeAutolinkHeadings, { behavior: 'wrap' })
      .use(rehypeStringify)
      .process(content),
  );
  // Same slugger rehype-slug uses, so TOC links match heading ids.
  const slugger = new GithubSlugger();
  const headings: { id: string; text: string }[] = [];
  for (const m of content.matchAll(/^(#{2,3})\s+(.+)$/gm)) {
    const text = m[2].trim();
    const id = slugger.slug(text);
    if (m[1] === '##') headings.push({ id, text });
  }
  return { ...meta, html, headings };
}

export function getRelated(post: PostMeta, n = 3): PostMeta[] {
  return getAllPosts()
    .filter((p) => p.slug !== post.slug)
    .map((p) => ({
      p,
      score:
        (p.category === post.category ? 2 : 0) + p.tags.filter((t) => post.tags.includes(t)).length,
    }))
    .sort((a, b) => b.score - a.score || (a.p.date < b.p.date ? 1 : -1))
    .slice(0, n)
    .map((x) => x.p);
}

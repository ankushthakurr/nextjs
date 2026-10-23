// SEO and quality gate for a post. Exits non-zero on any failure.
// Usage: node scripts/check-post.mjs <slug>
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const slug = process.argv[2];
if (!slug) throw new Error('usage: node scripts/check-post.mjs <slug>');
const raw = fs.readFileSync(path.join('content/posts', `${slug}.md`), 'utf8');
const { data, content } = matter(raw);
const errors = [];
const warn = [];
const req = ['title', 'metaTitle', 'description', 'date', 'category', 'focusKeyword', 'imageAlt', 'keywords', 'tags', 'sources', 'faq'];
for (const k of req) if (!data[k] || (Array.isArray(data[k]) && !data[k].length)) errors.push(`missing frontmatter: ${k}`);

const kw = String(data.focusKeyword || '').toLowerCase();
const words = content.split(/\s+/).filter(Boolean).length;
const firstPara = content.split(/\n\s*\n/).find((p) => p.trim() && !p.startsWith('#') && !p.startsWith('>') && !p.startsWith('<')) || '';
const h2s = [...content.matchAll(/^##\s+(.+)$/gm)].map((m) => m[1]);
const internal = [...content.matchAll(/\]\((\/[^)]*)\)/g)].length;
const external = [...content.matchAll(/\]\((https?:\/\/[^)]*)\)/g)].length;

if (data.metaTitle && (data.metaTitle.length < 30 || data.metaTitle.length > 60)) errors.push(`metaTitle length ${data.metaTitle.length} (want 30-60)`);
if (data.description && (data.description.length < 120 || data.description.length > 160)) errors.push(`description length ${data.description.length} (want 120-160)`);
if (kw && !String(data.metaTitle).toLowerCase().includes(kw)) errors.push('focusKeyword not in metaTitle');
if (kw && !String(data.description).toLowerCase().includes(kw)) errors.push('focusKeyword not in description');
if (kw && !firstPara.toLowerCase().includes(kw)) errors.push('focusKeyword not in first paragraph');
if (kw && !h2s.some((h) => h.toLowerCase().includes(kw.split(' ')[0]))) warn.push('focusKeyword (first word) not in any H2');
if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug) || slug.length > 75) errors.push('slug should be lowercase-hyphenated, <= 75 chars');
if (/^#\s/m.test(content)) errors.push('body must not contain an H1 (the title is the H1)');
if (words < 1200) errors.push(`word count ${words} (want >= 1200)`);
if (h2s.length < 4) errors.push(`only ${h2s.length} H2 sections (want >= 4)`);
if (internal < 2) errors.push(`only ${internal} internal links (want >= 2)`);
if (external < 2) errors.push(`only ${external} external source links in body (want >= 2)`);
if ((data.faq || []).length < 3) errors.push('want >= 3 FAQ entries');
if ((data.sources || []).length < 3) errors.push('want >= 3 sources');
const img = data.image || `/images/posts/${slug}.svg`;
if (img.startsWith('/') && !fs.existsSync(path.join('public', img))) errors.push(`featured image missing: public${img}`);
for (const m of content.matchAll(/!\[([^\]]*)\]\(([^)]+)\)/g)) if (!m[1].trim()) errors.push(`image without alt text: ${m[2]}`);
const density = kw ? (content.toLowerCase().split(kw).length - 1) / (words / 100) : 0;
if (density > 2.5) warn.push(`keyword density ${density.toFixed(2)}% looks stuffed`);

console.log(`${slug}: ${words} words, ${h2s.length} H2s, ${internal} internal / ${external} external links, kw density ${density.toFixed(2)}%`);
warn.forEach((w) => console.log('WARN ', w));
errors.forEach((e) => console.log('FAIL ', e));
if (errors.length) process.exit(1);
console.log('PASS');

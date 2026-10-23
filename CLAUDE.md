# TrendPulse Daily

Next.js 15 (App Router) blog. Posts are Markdown files in `content/posts/`, rendered statically.
Deployed on Vercel from the `main` branch (project `trendpulse-daily`).

- Publishing a daily post: follow `DAILY_POST.md` exactly.
- `npm run build` must pass before pushing. `node scripts/check-post.mjs <slug>` is the SEO gate.
- Site config (name, URL, categories): `lib/site.ts`.
- SEO pieces: per-post metadata, NewsArticle + Breadcrumb + FAQ JSON-LD (`app/blog/[slug]/page.tsx`), `app/sitemap.ts`, `app/robots.ts`, `app/feed.xml`, generated OG images.

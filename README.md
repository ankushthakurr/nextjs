# TrendPulse Daily

A blog that publishes one researched, SEO-optimized article every day on a trending topic.

- **Live site:** https://trendpulse-daily-blue.vercel.app
- **Stack:** Next.js 15, Markdown posts, Vercel
- **Daily pipeline:** a scheduled Claude agent follows [`DAILY_POST.md`](DAILY_POST.md): find the top Google Trends topic, research keywords and sources, write the post, generate the cover, run the SEO check and build, then push to `main`.

## Local development
```
npm install
npm run dev
```

## Writing a post by hand
1. Copy an existing file in `content/posts/` and edit the frontmatter and body.
2. `node scripts/make-cover.mjs <slug>` to create the cover image.
3. `node scripts/check-post.mjs <slug>` to run the SEO checklist.
4. Commit and push to `main`.

Set `NEXT_PUBLIC_SITE_URL` in Vercel if you add a custom domain.

# Daily post playbook

This is the exact procedure the daily scheduled agent follows to publish one post.
Pushing to `main` deploys the site on Vercel automatically.

## 1. Sync
```
git checkout main && git pull origin main && npm ci
```

## 2. Find today's trending topic
1. Fetch Google Trends daily RSS with Firecrawl (direct curl is blocked in the cloud sandbox):
   `firecrawl_scrape` url `https://trends.google.com/trending/rss?geo=US`, formats `["rawHtml"]`, `maxAge: 0`.
   Each `<item>` has the search term, `ht:approx_traffic`, and 1-3 related news headlines and URLs.
2. Cross-check with `firecrawl_search` (sources `["news"]`, `tbs: "qdr:d"`) for the strongest 3-4 candidates.
3. List `content/posts/` and skip anything already covered in the last 14 days (unless there is a major new development, then write a fresh angle).
4. Pick ONE topic using this priority:
   - Highest traffic that also has lasting search interest (people will still search it next week).
   - At least 2 reputable sources (major outlets, official sites, league/team/government pages).
   - Prefer a mix of categories across the week (check the last 5 posts' categories).
5. Never pick: rumors about a private person's health or sex life, unverified criminal allegations, graphic tragedies involving minors, gambling/prediction-market picks, puzzle answers (Wordle, Connections), horoscopes, or anything you cannot verify.

## 3. Keyword research
- **Focus keyword**: the phrase people actually type (look at the Trends term and the news headlines), e.g. `AJ Dybantsa injury`.
- 5-8 secondary keywords: related entities, "how long", "what happened", "when is", "who is" variants pulled from headlines and search snippets.
- If SEOcrawl AI has a property for the site, `find_keyword_opportunities` can add ideas; it is optional.

## 4. Research
- Scrape 3-6 sources with `firecrawl_scrape` using `formats: ["query"]` and a `queryOptions.prompt` that asks for facts, numbers, dates and quotes with who said them. This keeps responses small.
- Every number, date and quote in the article must come from a source you read today. Never invent quotes. If sources disagree, use the majority or say they differ.

## 5. Write the post
File: `content/posts/<slug>.md`. Slug: lowercase, hyphenated, contains the focus keyword, <= 75 chars.
Use the existing post in `content/posts/` as the template. Frontmatter fields:

| field | rule |
| --- | --- |
| title | Compelling H1, may be longer than 60 chars |
| metaTitle | 30-60 chars, starts with or contains the focus keyword |
| description | 120-160 chars, contains focus keyword, reads like a promise |
| date | current UTC time, ISO 8601 |
| category | one of technology, business, science, health, sports, entertainment, world, lifestyle |
| focusKeyword, keywords, tags | from step 3 |
| imageAlt | describes the cover graphic |
| imageCredit | `Graphic: TrendPulse Daily (original artwork)` unless you use a licensed photo |
| coverLabel, coverTitle | short label and a <= 70 char headline for the cover art |
| faq | 3-5 real questions people search, concise factual answers |
| sources | every source you used, title + URL |

Body rules (the checker enforces most of them):
- Open with a `> **The short version:**` blockquote (2-3 sentences).
- First paragraph contains the focus keyword naturally.
- 1,200-2,000 words, 5-8 `##` sections, `###` where useful. No `#` H1 in the body.
- At least one table or bulleted list that adds real value.
- At least 2 external links to sources inline, at least 2 internal links: previous related posts (`/blog/<slug>`) when they exist, plus `/category/<category>` and/or `/about`.
- Keyword density under 2.5%; write for people first.
- End with a "What to watch next" style section and a one-line italic note saying when the reporting is current as of.
- Plain, confident, neutral tone. No clickbait, no em dashes.

## 6. Images
- Always run `node scripts/make-cover.mjs <slug>`: this writes an original 1200x630 SVG cover to `public/images/posts/<slug>.svg`. Social share PNGs are generated automatically from the title.
- Optional inline photos: only from Wikimedia Commons with a license that allows reuse (CC BY, CC BY-SA, CC0, public domain). Use the `upload.wikimedia.org` URL, descriptive alt text, and an italic credit line right under the image: `*Photo: Author, CC BY-SA 4.0, via Wikimedia Commons*`. Never use photos from news sites, Getty, AP, or Google image results.

## 7. Verify
```
node scripts/check-post.mjs <slug>   # must print PASS
npm run build                        # must succeed
```
Fix anything that fails and re-run.

## 8. Publish
```
git add content/posts public/images/posts
git commit -m "Daily post: <title>"
git push origin main
```
Then deploy and confirm it is live:

1. Vercel tools, no `teamId` (calls with the team id are rejected): `list_deployments` for project `trendpulse-daily`. If a new production deployment for your commit appears, wait for READY.
2. If none appears, deploy from Git with `create_deployment` and
   `requestBody: { name: "trendpulse-daily", project: "trendpulse-daily", target: "production", gitSource: { type: "github", org: "ankushthakurr", repo: "nextjs", ref: "main", sha: "<commit sha>" }, projectSettings: { framework: "nextjs" } }`
   and `skipAutoDetectionConfirmation: "1"`. This works because the repo is public.
   Only if that fails, deploy the files directly:
   - `node scripts/deploy-bundle.mjs > /tmp/files.json` and pass that array as `files` to `create_deployment` with
     `requestBody: { name: "trendpulse-daily", project: "trendpulse-daily", target: "production", files, projectSettings: { framework: "nextjs" } }`
     and `skipAutoDetectionConfirmation: "1"`.
   - Poll `get_deployment` until `readyState` is READY. If it is ERROR, read the build logs (`list_deployment_events`), fix, commit, push and redeploy.
3. Confirm `https://trendpulse-daily-blue.vercel.app/blog/<slug>` returns the article. The sandbox proxy blocks direct curl to vercel.app, so check with Firecrawl `firecrawl_scrape` (`maxAge: 0`) or Vercel `web_fetch_vercel_url`.

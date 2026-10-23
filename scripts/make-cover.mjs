// Generates an original 1200x630 SVG cover for a post, so every featured image
// is our own work with no licensing questions.
// Usage: node scripts/make-cover.mjs <slug>   (reads content/posts/<slug>.md)
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const palettes = {
  technology: ['#0f172a', '#1e3a8a', '#38bdf8'],
  business: ['#0c1a12', '#14532d', '#4ade80'],
  science: ['#1a1033', '#4c1d95', '#c084fc'],
  health: ['#0b1f1e', '#115e59', '#2dd4bf'],
  sports: ['#1c0f08', '#9a3412', '#fb923c'],
  entertainment: ['#1f0a1a', '#9d174d', '#f472b6'],
  world: ['#0f1720', '#1e40af', '#93c5fd'],
  lifestyle: ['#1f1608', '#a16207', '#facc15'],
};

const slug = process.argv[2];
if (!slug) throw new Error('usage: node scripts/make-cover.mjs <slug>');
const file = path.join('content/posts', `${slug}.md`);
const { data } = matter(fs.readFileSync(file, 'utf8'));
const [bg, mid, hi] = palettes[data.category] ?? palettes.world;
const label = (data.coverLabel || data.category || 'trending').toUpperCase();
const title = data.coverTitle || data.title;

// Seeded randomness so the same slug always yields the same art.
let seed = [...slug].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
const rand = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 2 ** 32);

function wrap(text, max) {
  const lines = [];
  let line = '';
  for (const w of text.split(/\s+/)) {
    if ((line + ' ' + w).trim().length > max) {
      lines.push(line.trim());
      line = w;
    } else line += ' ' + w;
  }
  if (line.trim()) lines.push(line.trim());
  return lines;
}
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const fontSize = title.length > 60 ? 54 : 64;
const lines = wrap(title, title.length > 60 ? 30 : 26).slice(0, 4);

const circles = Array.from({ length: 7 }, () => {
  const r = 40 + rand() * 220;
  return `<circle cx="${(700 + rand() * 520).toFixed(0)}" cy="${(rand() * 630).toFixed(0)}" r="${r.toFixed(0)}" fill="none" stroke="${hi}" stroke-opacity="${(0.12 + rand() * 0.25).toFixed(2)}" stroke-width="${(1 + rand() * 3).toFixed(1)}"/>`;
}).join('');
const pulse = Array.from({ length: 24 }, (_, i) => {
  const x = 640 + i * 24;
  const y = 470 - (i % 6 === 3 ? 120 : i % 6 === 4 ? -60 : rand() * 30);
  return `${x},${y.toFixed(0)}`;
}).join(' ');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-label="${esc(data.imageAlt || title)}">
<defs>
<linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${bg}"/><stop offset="1" stop-color="${mid}"/></linearGradient>
<radialGradient id="r" cx="0.85" cy="0.3" r="0.6"><stop offset="0" stop-color="${hi}" stop-opacity="0.45"/><stop offset="1" stop-color="${hi}" stop-opacity="0"/></radialGradient>
</defs>
<rect width="1200" height="630" fill="url(#g)"/>
<rect width="1200" height="630" fill="url(#r)"/>
${circles}
<polyline points="${pulse}" fill="none" stroke="${hi}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round" opacity="0.85"/>
<text x="72" y="110" font-family="Helvetica, Arial, sans-serif" font-size="26" font-weight="700" letter-spacing="5" fill="${hi}">${esc(label)}</text>
${lines
  .map(
    (l, i) =>
      `<text x="72" y="${200 + i * (fontSize * 1.15)}" font-family="Georgia, 'Times New Roman', serif" font-size="${fontSize}" font-weight="700" fill="#ffffff">${esc(l)}</text>`,
  )
  .join('\n')}
<text x="72" y="570" font-family="Helvetica, Arial, sans-serif" font-size="26" font-weight="700" fill="#ffffff">Trend<tspan fill="${hi}">Pulse</tspan> Daily</text>
</svg>
`;
const out = path.join('public/images/posts', `${slug}.svg`);
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, svg);
console.log(`wrote ${out}`);

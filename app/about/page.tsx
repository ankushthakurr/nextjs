import type { Metadata } from 'next';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'About',
  description: `How ${site.name} picks and writes its daily trending story.`,
  alternates: { canonical: '/about' },
};

export default function About() {
  return (
    <div className="wrap">
      <div className="page prose">
        <h1>About {site.name}</h1>
        <p>
          Every day we look at what people across the U.S. are searching for most, pick the stories with the most lasting
          interest across news, sports, tech, health and entertainment, and publish in-depth articles that explain them:
          what happened, why it matters, and what to watch next.
        </p>
        <h2>How we work</h2>
        <ul>
          <li>Topics come from live search and news trend data.</li>
          <li>Every factual claim is checked against at least two reputable sources, listed at the end of each story.</li>
          <li>Articles are researched and drafted with AI assistance and follow a strict editorial checklist.</li>
          <li>Images are original graphics or openly licensed photos, credited under each image.</li>
        </ul>
        <p>Spotted an error? Corrections are made promptly and noted with an updated date.</p>
      </div>
    </div>
  );
}

export const site = {
  name: 'TrendPulse Daily',
  tagline: 'Deep, well-researched stories on what America is searching for, every day.',
  description:
    'TrendPulse Daily publishes in-depth, fact-checked articles every day on the topics people are searching for most, across news, sports, tech, health and entertainment, with sources, context and what it means for you.',
  url: (process.env.NEXT_PUBLIC_SITE_URL || 'https://trendpulse-daily-blue.vercel.app').replace(/\/$/, ''),
  author: 'TrendPulse Editorial',
  locale: 'en_US',
};

export const categories: Record<string, string> = {
  technology: 'Technology',
  business: 'Business & Finance',
  science: 'Science',
  health: 'Health',
  sports: 'Sports',
  entertainment: 'Entertainment',
  world: 'World',
  lifestyle: 'Lifestyle',
};

export const site = {
  name: 'TrendPulse Daily',
  tagline: 'One deep, well-researched story on what the world is searching for, every day.',
  description:
    'TrendPulse Daily publishes one in-depth, fact-checked article every day on the topic people are searching for most, with sources, context and what it means for you.',
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

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Trending Instagram Hashtags 2026 — By Niche',
  description: 'Discover trending Instagram hashtags for your niche right now. Updated daily. Supports Hindi, Hinglish, and English niches. Find rising, sweet-spot, and saturated hashtags.',
  keywords: ['trending instagram hashtags 2026', 'trending hashtags india', 'trending hashtags hindi creators', 'instagram trending tags today', 'reels trending hashtags', 'hinglish hashtags instagram'],
  alternates: { canonical: 'https://hashtagitnow.com/trending' },
  openGraph: {
    title: 'Trending Instagram Hashtags 2026 — HashtagItNow',
    description: 'Daily-updated trending hashtags by niche. Supports Hindi and Hinglish creators.',
    url: 'https://hashtagitnow.com/trending',
  },
};

export default function TrendingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'HashtagItNow — Trending Hashtags',
            applicationCategory: 'SocialNetworkingApplication',
            operatingSystem: 'Web',
            url: 'https://hashtagitnow.com/trending',
            description: 'Real-time trending Instagram hashtags by niche, updated daily.',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          }),
        }}
      />
      {children}
    </>
  );
}

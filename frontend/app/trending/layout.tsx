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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              { '@type': 'Question', name: 'How do I find trending hashtags for Instagram?', acceptedAnswer: { '@type': 'Answer', text: 'Enter your niche in the trending tool — HashtagItNow scrapes live Instagram data and classifies hashtags as rising, sweet-spot, or saturated for your specific niche. Results update daily.' } },
              { '@type': 'Question', name: 'What is a sweet-spot hashtag?', acceptedAnswer: { '@type': 'Answer', text: 'A sweet-spot hashtag is one with moderate usage frequency — active enough to have an audience but not so oversaturated that your content gets buried. These typically give the best reach-to-competition ratio.' } },
              { '@type': 'Question', name: 'Do trending hashtags work for Hindi creators?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Enter your niche in Hindi or Hinglish and the tool identifies trending hashtags for Indian creators. It understands desi niches like fitness india, comedy hindi, and bollywood that Western tools miss.' } },
              { '@type': 'Question', name: 'How often does the trending data update?', acceptedAnswer: { '@type': 'Answer', text: 'Trending hashtag data is pulled fresh for each search from live Instagram feeds. Results reflect what is actively trending right now, not cached data from weeks ago.' } },
            ],
          }),
        }}
      />
      {children}
    </>
  );
}

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Instagram Hashtag Analyser — Audit & Strategy',
  description: 'Paste any Instagram post URL and get an instant AI-powered hashtag audit. Find which hashtags are hurting your reach and get a tailored 5-hashtag strategy. Free for Indian creators.',
  keywords: ['instagram hashtag analyser', 'hashtag audit tool', 'instagram hashtag strategy', 'best hashtags india', 'hashtag checker instagram', 'instagram reach tool'],
  alternates: { canonical: 'https://hashtagitnow.com/analyze' },
  openGraph: {
    title: 'AI Instagram Hashtag Analyser — HashtagItNow',
    description: 'Instant AI hashtag audit for any Instagram post. Get a tailored strategy in seconds.',
    url: 'https://hashtagitnow.com/analyze',
  },
};

export default function AnalyzeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'HashtagItNow — Hashtag Analyser',
            applicationCategory: 'SocialNetworkingApplication',
            operatingSystem: 'Web',
            url: 'https://hashtagitnow.com/analyze',
            description: 'AI-powered Instagram hashtag audit and strategy tool for creators.',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          }),
        }}
      />
      {children}
    </>
  );
}

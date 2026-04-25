import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Compare Instagram Posts — Find What Drives Views',
  description: 'Compare up to 5 Instagram posts side-by-side. AI identifies which hashtags drove the most views and what to change. Perfect for Indian creators on Reels.',
  keywords: ['compare instagram posts', 'instagram post comparison tool', 'which hashtags get more views', 'instagram reels hashtag comparison', 'instagram analytics india'],
  alternates: { canonical: 'https://hashtagitnow.com/compare' },
  openGraph: {
    title: 'Compare Instagram Posts — HashtagItNow',
    description: 'AI-powered side-by-side Instagram post comparison. Find the hashtag patterns that drive views.',
    url: 'https://hashtagitnow.com/compare',
  },
};

export default function CompareLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'HashtagItNow — Post Comparator',
            applicationCategory: 'SocialNetworkingApplication',
            operatingSystem: 'Web',
            url: 'https://hashtagitnow.com/compare',
            description: 'Compare Instagram posts to find which hashtag strategies drive the most views.',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          }),
        }}
      />
      {children}
    </>
  );
}

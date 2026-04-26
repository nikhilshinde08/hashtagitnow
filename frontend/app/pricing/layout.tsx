import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing — Free & Pro Plans',
  description: 'Start free. Upgrade for unlimited hashtag analysis, post comparisons, and trending research. Built for Indian Instagram creators.',
  keywords: ['hashtag tool pricing', 'hashtagitnow pro', 'instagram hashtag tool free', 'hashtag strategy tool india'],
  alternates: { canonical: 'https://hashtagitnow.com/pricing' },
  openGraph: {
    title: 'Pricing — HashtagItNow',
    description: 'Free and Pro plans for AI-powered Instagram hashtag strategy.',
    url: 'https://hashtagitnow.com/pricing',
  },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

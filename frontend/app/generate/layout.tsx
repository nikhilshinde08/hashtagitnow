import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Hook & Caption Generator — 10 Hooks in 10 Seconds',
  description: 'Generate 10 viral hooks, full captions, and hashtags for Instagram or YouTube in seconds. Uses live trending data. Supports Hindi and Hinglish niches. Free for Indian creators.',
  keywords: ['instagram hook generator', 'caption generator ai', 'viral hook generator', 'instagram caption generator india', 'hinglish content generator', 'hook generator reels'],
  alternates: { canonical: 'https://hashtagitnow.com/generate' },
  openGraph: {
    title: 'AI Hook & Caption Generator — 10 Hooks in 10 Seconds',
    description: 'Generate viral hooks, captions, and hashtags using live trending data. Free for Indian creators.',
    url: 'https://hashtagitnow.com/generate',
  },
};

export default function GenerateLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'HashtagItNow — Hook & Caption Generator',
            applicationCategory: 'SocialNetworkingApplication',
            operatingSystem: 'Web',
            url: 'https://hashtagitnow.com/generate',
            description: 'AI-powered hook, caption, and hashtag generator using live trending data for Instagram and YouTube creators.',
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
              { '@type': 'Question', name: 'How does the AI hook generator work?', acceptedAnswer: { '@type': 'Answer', text: 'Enter your niche (in Hindi, Hinglish, or English), choose a tone and platform. The AI pulls live trending hashtags for your niche and generates 10 unique hooks with full captions and 5 targeted hashtags each.' } },
              { '@type': 'Question', name: 'Is the hook generator free?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Free users get 3 hook generations per day. Each generation produces 10 hooks with full captions and hashtags.' } },
              { '@type': 'Question', name: 'Does it support Hindi and Hinglish niches?', acceptedAnswer: { '@type': 'Answer', text: 'Yes — describe your niche in Hindi, Hinglish, or English. The AI understands all three and generates hooks that resonate with Indian audiences.' } },
              { '@type': 'Question', name: 'What platforms does the hook generator support?', acceptedAnswer: { '@type': 'Answer', text: 'Currently Instagram and YouTube. Instagram hooks are optimised for Reels (under 15 seconds). YouTube hooks target curiosity-gap and search intent.' } },
            ],
          }),
        }}
      />
      {children}
    </>
  );
}

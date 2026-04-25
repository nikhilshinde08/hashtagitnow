import type { Metadata } from 'next';
import Image from 'next/image';
import Script from 'next/script';
import './globals.css';
import Nav from './Nav';

const BASE_URL = 'https://hashtagitnow.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'HashtagItNow — AI Hashtag Strategy Tool for Instagram, YouTube & TikTok',
    template: '%s | HashtagItNow',
  },
  description: 'AI-powered hashtag generator and strategy tool. Analyse Instagram posts, find trending hashtags, compare content performance, and grow your reach on Instagram, YouTube, TikTok and Facebook.',
  keywords: [
    'hashtag generator', 'Instagram hashtag strategy', 'AI hashtag tool',
    'trending hashtags 2026', 'hashtag analyzer', 'Instagram growth tool',
    'best hashtags for Instagram reels', 'hashtag research tool', 'hashtag audit',
    'social media hashtag strategy', 'Instagram reach tool', 'hashtag performance',
    'compare Instagram posts', 'content strategy tool', 'hashtag analytics',
    'TikTok hashtag strategy', 'YouTube hashtag tool', 'Instagram SEO',
    'reels hashtag generator', 'niche hashtag finder',
  ],
  authors: [{ name: 'AIGenixs Labs', url: BASE_URL }],
  creator: 'AIGenixs Labs',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: BASE_URL,
    siteName: 'HashtagItNow',
    title: 'HashtagItNow — AI Hashtag Strategy Tool',
    description: 'AI-powered hashtag generator. Analyse posts, find trending tags, compare performance. Grow your Instagram, YouTube & TikTok reach.',
    images: [{ url: '/logo.png', width: 512, height: 512, alt: 'HashtagItNow Logo' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HashtagItNow — AI Hashtag Strategy Tool',
    description: 'AI-powered hashtag generator and strategy tool for Instagram, YouTube & TikTok.',
    images: ['/logo.png'],
  },
  icons: { icon: '/favicon.png', apple: '/favicon.png' },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  alternates: { canonical: BASE_URL },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#F0F0F0] font-outfit min-h-screen flex flex-col">
        {process.env.NEXT_PUBLIC_API_URL && (
          <Script
            id="keep-alive"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `setInterval(()=>fetch('${process.env.NEXT_PUBLIC_API_URL}/health').catch(()=>{}), 600000)`,
            }}
          />
        )}
        {process.env.NEXT_PUBLIC_ADSENSE_CLIENT && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
        <Nav />
        <div className="flex-1">{children}</div>
        <footer className="bg-[#121212] border-t-4 border-[#121212]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Image
              src="/logo.png"
              alt="HashtagItNow"
              width={140}
              height={40}
              className="h-8 w-auto object-contain brightness-0 invert"
            />
            <p className="text-xs font-bold uppercase tracking-widest text-white/40">
              Developed by <span className="text-[#F0C020]">AIGenixs Labs</span> © 2026
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}

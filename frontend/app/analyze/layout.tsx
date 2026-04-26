import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Instagram Hashtag Analyser & Audit Tool',
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              { '@type': 'Question', name: 'How does the Instagram hashtag analyser work?', acceptedAnswer: { '@type': 'Answer', text: 'Paste any public Instagram post or Reel URL. The AI scrapes the post data, audits every hashtag for relevance and reach, and generates a tailored 5-hashtag strategy for your specific content and niche.' } },
              { '@type': 'Question', name: 'Is the hashtag analyser free?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Free users can analyse Instagram posts without creating an account. Sign up for a free account to save your results and access additional analyses.' } },
              { '@type': 'Question', name: 'What does the hashtag audit show?', acceptedAnswer: { '@type': 'Answer', text: 'The audit categorises every hashtag in your post as: effective (working well), too generic (too broad to drive reach), irrelevant (does not match your content), or missing (important tags you should add). You also get a recommended 5-tag set.' } },
              { '@type': 'Question', name: 'Why only 5 hashtags for Instagram?', acceptedAnswer: { '@type': 'Answer', text: 'Instagram officially recommends 3–5 hashtags in 2026. Using more than 5 no longer increases reach and can suppress distribution. HashtagItNow recommends the optimal 5 tags: one broad, two niche, two low-competition.' } },
            ],
          }),
        }}
      />
      {children}
      <section className="bg-white border-t-4 border-[#121212] px-4 py-12 sm:px-8 lg:px-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-black text-2xl uppercase tracking-tighter text-[#121212] mb-6">
            How the Instagram Hashtag Analyser Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              { step: '01', title: 'Paste Your Post URL', desc: 'Paste any public Instagram post or Reel URL. The AI scrapes engagement data, caption, and existing hashtags automatically.' },
              { step: '02', title: 'AI Audits Every Tag', desc: 'Each hashtag is classified as effective, too generic, irrelevant, or missing. The AI also detects your niche from the content — no manual input needed.' },
              { step: '03', title: 'Get Your 5-Tag Strategy', desc: 'Receive a tailored set of exactly 5 hashtags — the maximum Instagram recommends in 2026 — split across high-reach, niche, and low-competition tiers.' },
            ].map((item) => (
              <div key={item.step} className="border-2 border-[#121212] shadow-[4px_4px_0px_0px_#121212] p-5 bg-[#F0F0F0]">
                <span className="font-black text-3xl text-[#121212]/20">{item.step}</span>
                <p className="font-black text-sm uppercase tracking-tight text-[#121212] mt-2 mb-2">{item.title}</p>
                <p className="text-sm font-medium text-[#121212]/60 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="space-y-4">
            <h3 className="font-black text-lg uppercase tracking-tight text-[#121212]">Frequently Asked Questions</h3>
            {[
              { q: 'How many hashtags should I use on Instagram in 2026?', a: 'Instagram recommends 3–5 hashtags. Using 20–30 tags no longer increases reach and can hurt distribution. The analyser recommends exactly 5 targeted hashtags for every post.' },
              { q: 'Can I analyse Instagram Reels?', a: 'Yes. Paste any public Reel URL and the analyser will extract its caption, hashtags, views, and engagement data for a complete audit.' },
              { q: 'Does it work for Hindi and Hinglish content?', a: 'Yes. Describe your niche in Hindi or Hinglish and the AI understands it. All hashtag recommendations are in English for maximum reach.' },
              { q: 'What if my post has no hashtags?', a: 'No problem. Paste the URL or paste your caption text directly — the analyser will generate a complete 5-hashtag strategy from scratch based on your content.' },
            ].map((faq, i) => (
              <div key={i} className="border-2 border-[#121212] shadow-[3px_3px_0px_0px_#121212] bg-[#F0F0F0]">
                <div className="border-b-2 border-[#121212] px-4 py-3">
                  <p className="font-black text-sm text-[#121212]">{faq.q}</p>
                </div>
                <div className="px-4 py-3">
                  <p className="text-sm font-medium text-[#121212]/70 leading-relaxed">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

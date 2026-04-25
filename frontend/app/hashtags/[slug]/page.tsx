import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { NICHE_PAGES, getPageBySlug, getRelatedPages } from '@/lib/seo-pages';
import { CopyButton, CopyAllButton } from './CopyButton';

export async function generateStaticParams() {
  return NICHE_PAGES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getPageBySlug(slug);
  if (!page) return {};
  return {
    title: page.title,
    description: page.metaDescription,
    keywords: page.hashtags.topPicks.map((t) => `#${t}`).join(', '),
    alternates: { canonical: `https://hashtagitnow.com/hashtags/${page.slug}` },
    openGraph: {
      title: `${page.title} | HashtagItNow`,
      description: page.metaDescription,
      url: `https://hashtagitnow.com/hashtags/${page.slug}`,
    },
  };
}

export default async function HashtagNichePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getPageBySlug(slug);
  if (!page) notFound();

  const related = getRelatedPages(page.relatedSlugs);
  const allRecommended = [
    ...page.hashtags.highReach,
    ...page.hashtags.niche,
    ...page.hashtags.lowCompetition,
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: page.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main className="min-h-screen bg-[#F0F0F0]">

        {/* ── HERO ─────────────────────────────────────────────── */}
        <section className="border-b-4 border-[#121212] bg-[#121212] px-4 py-16 sm:px-8 lg:px-16">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
              <Link
                href="/hashtags"
                className="text-xs font-black uppercase tracking-widest text-white/50 hover:text-white transition-colors"
              >
                ← All Niches
              </Link>
              <span className="text-white/30">/</span>
              <span className="text-xs font-black uppercase tracking-widest text-[#F0C020]">
                {page.niche} · {page.platform}
              </span>
            </div>
            <h1 className="font-black text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tighter text-white leading-tight mb-4">
              {page.h1}
            </h1>
            <p className="text-white/70 font-medium text-lg max-w-2xl leading-relaxed mb-8">
              {page.intro}
            </p>
            <Link
              href="/analyze"
              className="inline-flex items-center gap-2 bg-[#D02020] text-white border-2 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] px-6 py-3 font-black uppercase tracking-widest text-sm hover:bg-[#D02020]/90 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
            >
              Analyse Your Posts Free →
            </Link>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 sm:px-8 lg:px-16 py-12 space-y-16">

          {/* ── TOP 5 PICKS ─────────────────────────────────────── */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <span className="inline-block text-xs font-black uppercase tracking-widest px-3 py-1 border-2 border-[#121212] bg-[#F0C020] text-[#121212] shadow-[2px_2px_0px_0px_#121212]">
                Instagram Recommends
              </span>
              <h2 className="font-black text-xl uppercase tracking-tight text-[#121212]">
                Your Top 5 Hashtags
              </h2>
            </div>
            <div className="bg-white border-4 border-[#121212] shadow-[8px_8px_0px_0px_#121212] p-6 sm:p-8">
              <p className="text-sm font-medium text-[#121212]/60 mb-6">
                Instagram allows <strong>5 hashtags max</strong> for optimal reach. Copy these as your complete set.
              </p>
              <div className="flex flex-wrap gap-3 mb-6">
                {page.hashtags.topPicks.map((tag) => (
                  <CopyButton key={tag} tag={tag} />
                ))}
              </div>
              <CopyAllButton tags={page.hashtags.topPicks} />
            </div>
          </section>

          {/* ── FULL HASHTAG SET ─────────────────────────────────── */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <span className="inline-block text-xs font-black uppercase tracking-widest px-3 py-1 border-2 border-[#121212] bg-[#1040C0] text-white shadow-[2px_2px_0px_0px_#121212]">
                Full Research
              </span>
              <h2 className="font-black text-xl uppercase tracking-tight text-[#121212]">
                Complete Hashtag Set
              </h2>
            </div>
            <p className="text-sm font-medium text-[#121212]/60 mb-6">
              Pick 5 total — one from each tier builds the strongest mix.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { label: 'High Reach', tags: page.hashtags.highReach, color: 'bg-[#D02020]' },
                { label: 'Niche Targeted', tags: page.hashtags.niche, color: 'bg-[#1040C0]' },
                { label: 'Low Competition', tags: page.hashtags.lowCompetition, color: 'bg-[#121212]' },
              ].map(({ label, tags, color }) => (
                <div key={label} className="border-2 border-[#121212] shadow-[4px_4px_0px_0px_#121212] bg-white">
                  <div className={`${color} px-4 py-2 border-b-2 border-[#121212]`}>
                    <span className="text-xs font-black uppercase tracking-widest text-white">{label}</span>
                  </div>
                  <div className="p-4 flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <CopyButton key={tag} tag={tag} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── TIPS ─────────────────────────────────────────────── */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <span className="inline-block text-xs font-black uppercase tracking-widest px-3 py-1 border-2 border-[#121212] bg-[#D02020] text-white shadow-[2px_2px_0px_0px_#121212]">
                Strategy
              </span>
              <h2 className="font-black text-xl uppercase tracking-tight text-[#121212]">
                Tips for {page.niche} on {page.platform}
              </h2>
            </div>
            <div className="space-y-3">
              {page.tips.map((tip, i) => (
                <div
                  key={i}
                  className="flex gap-4 bg-white border-2 border-[#121212] shadow-[4px_4px_0px_0px_#121212] p-4"
                >
                  <span className="font-black text-2xl text-[#121212]/20 leading-none mt-0.5 shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="font-medium text-[#121212] text-sm leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── FAQ ──────────────────────────────────────────────── */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <span className="inline-block text-xs font-black uppercase tracking-widest px-3 py-1 border-2 border-[#121212] bg-[#F0F0F0] text-[#121212] shadow-[2px_2px_0px_0px_#121212]">
                FAQ
              </span>
              <h2 className="font-black text-xl uppercase tracking-tight text-[#121212]">
                Common Questions
              </h2>
            </div>
            <div className="space-y-4">
              {page.faqs.map((faq, i) => (
                <div key={i} className="border-2 border-[#121212] shadow-[4px_4px_0px_0px_#121212] bg-white">
                  <div className="border-b-2 border-[#121212] px-5 py-4">
                    <h3 className="font-black text-sm text-[#121212] uppercase tracking-tight">{faq.q}</h3>
                  </div>
                  <div className="px-5 py-4">
                    <p className="text-sm font-medium text-[#121212]/70 leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── RELATED ──────────────────────────────────────────── */}
          {related.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <span className="inline-block text-xs font-black uppercase tracking-widest px-3 py-1 border-2 border-[#121212] bg-[#121212] text-white shadow-[2px_2px_0px_0px_#121212]">
                  Also Explore
                </span>
                <h2 className="font-black text-xl uppercase tracking-tight text-[#121212]">
                  Related Hashtag Guides
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {related.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/hashtags/${p.slug}`}
                    className="flex items-center justify-between bg-white border-2 border-[#121212] shadow-[4px_4px_0px_0px_#121212] px-5 py-4 hover:bg-[#F0F0F0] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all group"
                  >
                    <div>
                      <p className="font-black text-sm uppercase tracking-tight text-[#121212]">{p.niche}</p>
                      <p className="text-xs font-medium text-[#121212]/50">{p.platform}</p>
                    </div>
                    <span className="font-black text-[#1040C0] group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* ── BOTTOM CTA ───────────────────────────────────────── */}
          <section className="bg-[#121212] border-4 border-[#121212] shadow-[8px_8px_0px_0px_#1040C0] p-8 sm:p-12 text-center">
            <span className="inline-block text-xs font-black uppercase tracking-widest px-3 py-1 border-2 border-white/30 text-white/60 mb-4">
              AI-Powered Analysis
            </span>
            <h2 className="font-black text-2xl sm:text-3xl uppercase tracking-tighter text-white mb-4">
              Ready to Analyse Your Actual Posts?
            </h2>
            <p className="text-white/60 font-medium mb-8 max-w-md mx-auto">
              Paste any Instagram URL and get a personalised hashtag audit tailored to your specific content — not generic advice.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/analyze"
                className="inline-flex items-center justify-center gap-2 bg-[#D02020] text-white border-2 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] px-8 py-4 font-black uppercase tracking-widest text-sm hover:bg-[#D02020]/90 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
              >
                Analyse My Posts →
              </Link>
              <Link
                href="/trending"
                className="inline-flex items-center justify-center gap-2 bg-transparent text-white border-2 border-white/50 px-8 py-4 font-black uppercase tracking-widest text-sm hover:border-white transition-colors"
              >
                See Trending Hashtags
              </Link>
            </div>
          </section>

        </div>
      </main>
    </>
  );
}

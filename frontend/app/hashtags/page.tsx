import type { Metadata } from 'next';
import Link from 'next/link';
import { NICHE_PAGES, PAGE_CATEGORIES } from '@/lib/seo-pages';

export const metadata: Metadata = {
  title: 'Instagram Hashtag Guides by Niche',
  description: 'Free Instagram hashtag guides for every niche. Fitness, food, travel, comedy, beauty, startup and more — with India-specific and Hindi creator tags. Updated 2026.',
  alternates: { canonical: 'https://hashtagitnow.com/hashtags' },
  openGraph: {
    title: '35 Free Instagram Hashtag Guides by Niche',
    description: 'Free hashtag guides for every Instagram niche. Includes Hindi and Indian creator hashtags.',
    url: 'https://hashtagitnow.com/hashtags',
  },
};

export default function HashtagsIndexPage() {
  return (
    <main className="min-h-screen bg-[#F0F0F0]">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="border-b-4 border-[#121212] px-4 py-16 sm:px-8 lg:px-16 bg-[#F0F0F0]">
        <div className="max-w-4xl mx-auto">
          <span className="inline-block text-xs font-black uppercase tracking-widest px-3 py-1 border-2 border-[#121212] bg-[#1040C0] text-white mb-6 shadow-[2px_2px_0px_0px_#121212]">
            {NICHE_PAGES.length} Free Guides
          </span>
          <h1 className="font-black text-4xl sm:text-5xl lg:text-6xl uppercase tracking-tighter text-[#121212] leading-tight mb-4">
            Instagram Hashtag Guides<br />
            <span className="text-[#D02020]">By Niche</span>
          </h1>
          <p className="text-[#121212]/60 font-medium text-lg max-w-2xl mb-8">
            Free hashtag strategy guides for every niche. Each guide includes Instagram&apos;s recommended 5-tag set, full research, tips, and FAQs — with special focus on Indian and Hindi creators.
          </p>
          <Link
            href="/analyze"
            className="inline-flex items-center gap-2 bg-[#D02020] text-white border-2 border-[#121212] shadow-[4px_4px_0px_0px_#121212] px-6 py-3 font-black uppercase tracking-widest text-sm hover:bg-[#D02020]/90 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
          >
            Analyse My Own Posts →
          </Link>
        </div>
      </section>

      {/* ── CATEGORIES ───────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-8 lg:px-16 py-12 space-y-12">
        {Object.entries(PAGE_CATEGORIES).map(([category, slugs]) => {
          const pages = slugs
            .map((s) => NICHE_PAGES.find((p) => p.slug === s))
            .filter((p): p is NonNullable<typeof p> => p !== undefined);

          return (
            <section key={category}>
              <div className="flex items-center gap-3 mb-6">
                <h2 className="font-black text-xl uppercase tracking-tight text-[#121212]">
                  {category}
                </h2>
                <div className="flex-1 h-[2px] bg-[#121212]/20" />
                <span className="text-xs font-bold text-[#121212]/40">{pages.length} guides</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {pages.map((page) => (
                  <Link
                    key={page.slug}
                    href={`/hashtags/${page.slug}`}
                    className="group bg-white border-2 border-[#121212] shadow-[4px_4px_0px_0px_#121212] p-5 hover:bg-[#F0F0F0] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-black text-sm uppercase tracking-tight text-[#121212]">{page.niche}</p>
                        <p className="text-xs font-medium text-[#121212]/50">{page.platform}</p>
                      </div>
                      <span className="font-black text-[#1040C0] group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {page.hashtags.topPicks.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-bold bg-[#F0F0F0] border border-[#121212]/20 px-2 py-0.5 text-[#121212]/60"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}

        {/* ── BOTTOM CTA ─────────────────────────────────────── */}
        <section className="bg-[#121212] border-4 border-[#121212] shadow-[8px_8px_0px_0px_#1040C0] p-8 text-center">
          <h2 className="font-black text-2xl uppercase tracking-tighter text-white mb-3">
            Want Hashtags for Your Specific Post?
          </h2>
          <p className="text-white/60 font-medium mb-6 max-w-md mx-auto text-sm">
            These guides give you a starting point. For hashtags tailored to your exact content, use our AI analyser.
          </p>
          <Link
            href="/analyze"
            className="inline-flex items-center gap-2 bg-[#D02020] text-white border-2 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] px-8 py-4 font-black uppercase tracking-widest text-sm hover:bg-[#D02020]/90 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
          >
            Analyse My Posts Free →
          </Link>
        </section>
      </div>
    </main>
  );
}

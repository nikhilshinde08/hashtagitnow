'use client';

import { useState } from 'react';
import { apiPost } from '@/lib/api';

interface TrendingHashtag {
  tag: string;
  postCount: number;
  reason: string;
  bestFor: string;
}

interface TrendingResponse {
  niche: string;
  normalizedNiches: string[];
  trendingHashtags: {
    rising: TrendingHashtag[];
    sweetSpot: TrendingHashtag[];
    saturated: TrendingHashtag[];
  };
  contentAngles: string[];
  strategy: string;
  error?: boolean;
  message?: string;
}

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toString();
}

function HashtagCard({ item, accent, textAccent }: { item: TrendingHashtag; accent: string; textAccent: string }) {
  return (
    <div className="bg-white border-2 border-[#121212] shadow-[4px_4px_0px_0px_#121212] flex flex-col">
      <div className={`flex items-center justify-between px-4 py-3 border-b-2 border-[#121212] ${accent}`}>
        <span className="font-black text-sm uppercase tracking-wide">#{item.tag}</span>
        <span className={`font-black text-xs tabular-nums px-2 py-0.5 border-2 border-current ${textAccent}`}>
          {item.postCount} recent posts
        </span>
      </div>
      <div className="p-4 space-y-2 flex-1">
        <p className="font-medium text-sm text-[#121212] leading-relaxed">{item.reason}</p>
        <div className="flex gap-2 items-start">
          <span className="flex-shrink-0 text-xs font-black uppercase tracking-widest text-[#121212]/50 mt-0.5">Use for</span>
          <p className="text-xs font-medium text-[#121212]/70 leading-relaxed">{item.bestFor}</p>
        </div>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-6">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-[#121212] animate-spin" style={{ animationDuration: '1s' }} />
        <div className="absolute inset-2 rounded-full border-4 border-[#D02020] animate-spin" style={{ animationDuration: '0.7s', animationDirection: 'reverse' }} />
        <div className="absolute inset-[30%] bg-[#F0C020] border-2 border-[#121212] rotate-45" />
      </div>
      <div className="text-center">
        <p className="font-black uppercase tracking-widest text-sm text-[#121212]">Finding Trends...</p>
        <p className="text-xs text-[#121212]/50 font-medium mt-1">Scraping hashtag data + AI analysis</p>
      </div>
    </div>
  );
}

export default function TrendingPage() {
  const [niche, setNiche] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TrendingResponse | null>(null);
  const [error, setError] = useState('');

  async function handleFetch() {
    if (!niche.trim()) return;
    setLoading(true);
    setResult(null);
    setError('');
    try {
      const data = await apiPost<TrendingResponse>('/trending', { niche: niche.trim() });
      if (data.error) {
        setError(data.message ?? 'Something went wrong.');
      } else {
        setResult(data);
      }
    } catch {
      setError('Could not reach the backend. Make sure it is running on port 4000.');
    } finally {
      setLoading(false);
    }
  }

  const tiers = result
    ? [
        {
          key: 'rising',
          label: 'Rising',
          sub: 'Used in 8+ recent posts — actively trending right now',
          items: result.trendingHashtags.rising,
          bg: 'bg-[#1040C0]',
          headerText: 'text-white',
          cardAccent: 'bg-[#1040C0] text-white',
          cardTextAccent: 'text-white border-white',
          dot: 'bg-[#1040C0]',
          border: 'border-r-4',
        },
        {
          key: 'sweetSpot',
          label: 'Sweet Spot',
          sub: 'Used in 3–7 recent posts — targeted, moderate competition',
          items: result.trendingHashtags.sweetSpot,
          bg: 'bg-[#F0C020]',
          headerText: 'text-[#121212]',
          cardAccent: 'bg-[#F0C020] text-[#121212]',
          cardTextAccent: 'text-[#121212] border-[#121212]',
          dot: 'bg-[#F0C020]',
          border: 'border-r-4',
        },
        {
          key: 'saturated',
          label: 'Saturated',
          sub: 'Rarely in recent posts — low niche activity or oversaturated',
          items: result.trendingHashtags.saturated,
          bg: 'bg-[#D02020]',
          headerText: 'text-white',
          cardAccent: 'bg-[#D02020] text-white',
          cardTextAccent: 'text-white border-white',
          dot: 'bg-[#D02020]',
          border: '',
        },
      ]
    : [];

  return (
    <main>
      {/* HERO */}
      <section className="border-b-4 border-[#121212] grid grid-cols-1 lg:grid-cols-5 min-h-[440px]">
        <div className="lg:col-span-3 bg-[#F0F0F0] p-8 lg:p-16 flex flex-col justify-center">
          <div className="inline-block bg-[#F0C020] text-[#121212] text-xs font-black uppercase tracking-widest px-3 py-1 border-2 border-[#121212] mb-6 shadow-[3px_3px_0px_0px_#121212] w-fit">
            AI Trend Analysis
          </div>
          <h1 className="font-black uppercase leading-[0.9] tracking-tighter mb-6">
            <span className="block text-5xl sm:text-6xl lg:text-7xl xl:text-8xl text-[#121212]">TREND</span>
            <span className="block text-5xl sm:text-6xl lg:text-7xl xl:text-8xl text-[#121212]">ING</span>
            <span className="block text-5xl sm:text-6xl lg:text-7xl xl:text-8xl text-[#F0C020]">NOW</span>
          </h1>
          <p className="font-medium text-lg text-[#121212] leading-relaxed max-w-md">
            Enter your niche in any language. Get AI-ranked trending hashtags split by reach tier — rising, sweet spot, and saturated.
          </p>
        </div>

        {/* Right — Yellow geometric panel */}
        <div className="hidden lg:flex lg:col-span-2 bg-[#F0C020] border-l-4 border-[#121212] relative overflow-hidden items-center justify-center">
          <div className="absolute inset-0 dot-grid opacity-10" />
          <div className="relative flex flex-col items-center gap-5">
            {[
              { label: 'RISING', bg: '#1040C0', text: 'text-white', w: 160 },
              { label: 'SWEET SPOT', bg: '#F0F0F0', text: 'text-[#121212]', w: 120 },
              { label: 'SATURATED', bg: '#D02020', text: 'text-white', w: 80 },
            ].map((bar) => (
              <div key={bar.label} className="flex items-center gap-3">
                <span className="text-xs font-black uppercase tracking-widest text-[#121212] w-24 text-right">{bar.label}</span>
                <div
                  className={`h-8 border-2 border-[#121212] flex items-center px-3 shadow-[3px_3px_0px_0px_#121212] ${bar.text}`}
                  style={{ backgroundColor: bar.bg, width: bar.w }}
                >
                  <span className="font-black text-xs uppercase tracking-widest">#</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEARCH FORM */}
      <section className="bg-[#F0F0F0] border-b-4 border-[#121212] p-8 lg:p-12">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs font-black uppercase tracking-widest text-[#121212] mb-2">Your Niche</p>
          <div className="flex gap-0">
            <input
              type="text"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleFetch()}
              placeholder="e.g. fitness, कॉमेडी, travel photography, business motivation"
              className="flex-1 bg-white border-2 border-r-0 border-[#121212] shadow-[4px_4px_0px_0px_#121212] px-4 py-4 font-medium text-sm text-[#121212] placeholder-[#121212]/40 focus:outline-none focus:shadow-[4px_4px_0px_0px_#F0C020] transition-shadow"
            />
            <button
              onClick={handleFetch}
              disabled={loading || !niche.trim()}
              className="bg-[#F0C020] text-[#121212] border-2 border-[#121212] shadow-[4px_4px_0px_0px_#121212] px-8 py-4 font-black uppercase tracking-widest text-sm hover:bg-[#F0C020]/90 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {loading ? '...' : 'Find Trends →'}
            </button>
          </div>
          <p className="mt-3 text-xs font-medium text-[#121212]/50">
            Supports English, Hindi, Hinglish, or mixed — e.g. "gym aur fitness tips"
          </p>
        </div>
      </section>

      {/* LOADING */}
      {loading && (
        <div className="max-w-7xl mx-auto px-4">
          <LoadingState />
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="bg-[#D02020] border-4 border-[#121212] shadow-[8px_8px_0px_0px_#121212] p-6">
            <p className="font-black uppercase tracking-wider text-white text-sm">Error</p>
            <p className="text-white font-medium mt-2">{error}</p>
          </div>
        </div>
      )}

      {/* RESULTS */}
      {result && !loading && (
        <div className="border-t-4 border-[#121212]">

          {/* Meta — what niches were detected */}
          <div className="bg-[#121212] px-8 py-4 flex flex-wrap items-center gap-4 border-b-4 border-[#121212]">
            <p className="text-xs font-black uppercase tracking-widest text-white/60">Niche detected as</p>
            <div className="flex flex-wrap gap-2">
              {result.normalizedNiches.map((n) => (
                <span key={n} className="text-xs font-black uppercase tracking-widest px-3 py-1 border-2 border-[#F0C020] text-[#F0C020]">
                  {n}
                </span>
              ))}
            </div>
          </div>

          {/* THREE TIER SECTIONS */}
          {tiers.map((tier) => (
            <section key={tier.key} className="border-b-4 border-[#121212]">
              {/* Tier header */}
              <div className={`${tier.bg} border-b-4 border-[#121212] px-8 lg:px-12 py-6 flex items-center justify-between`}>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <div className={`w-3 h-3 rounded-full ${tier.dot} border-2 border-[#121212]`} />
                    <p className={`font-black text-lg uppercase tracking-widest ${tier.headerText}`}>{tier.label}</p>
                  </div>
                  <p className={`text-xs font-medium ${tier.headerText} opacity-70`}>{tier.sub}</p>
                </div>
                <span className={`font-black text-4xl ${tier.headerText}`}>{tier.items.length}</span>
              </div>

              {/* Cards */}
              {tier.items.length === 0 ? (
                <div className="bg-[#F0F0F0] px-8 py-8">
                  <p className="text-sm font-medium text-[#121212]/50 uppercase tracking-wider">No hashtags identified in this tier</p>
                </div>
              ) : (
                <div className="bg-[#F0F0F0] p-8 lg:p-12">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto">
                    {tier.items.map((item) => (
                      <HashtagCard
                        key={item.tag}
                        item={item}
                        accent={tier.cardAccent}
                        textAccent={tier.cardTextAccent}
                      />
                    ))}
                  </div>
                </div>
              )}
            </section>
          ))}

          {/* CONTENT ANGLES — Black */}
          {result.contentAngles.length > 0 && (
            <section className="bg-[#121212] border-b-4 border-[#121212] p-8 lg:p-12">
              <div className="max-w-7xl mx-auto">
                <span className="inline-block text-xs font-black uppercase tracking-widest px-3 py-1 border-2 border-[#F0C020] text-[#F0C020] mb-6">
                  Content Angles
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.contentAngles.map((angle, i) => (
                    <div key={i} className="border-2 border-[#333] bg-[#1C1C1C] p-5 shadow-[4px_4px_0px_0px_#F0C020]">
                      <div className="flex gap-3 items-start">
                        <span className="flex-shrink-0 w-7 h-7 bg-[#F0C020] text-[#121212] font-black text-xs flex items-center justify-center border-2 border-[#F0C020]">
                          {i + 1}
                        </span>
                        <p className="text-white font-medium text-sm leading-relaxed">{angle}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* STRATEGY — Yellow */}
          <section className="bg-[#F0C020] p-8 lg:p-12">
            <div className="max-w-7xl mx-auto">
              <span className="inline-block text-xs font-black uppercase tracking-widest px-3 py-1 border-2 border-[#121212] bg-[#121212] text-white mb-4">
                Trend Strategy
              </span>
              <div className="border-4 border-[#121212] bg-white shadow-[8px_8px_0px_0px_#121212] p-6 lg:p-8 relative">
                <div className="absolute top-0 right-0 w-8 h-8 bg-[#1040C0] border-l-4 border-b-4 border-[#121212]" />
                <p className="font-medium text-lg leading-relaxed text-[#121212] max-w-4xl">{result.strategy}</p>
              </div>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

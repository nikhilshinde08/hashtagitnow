'use client';

import { useState } from 'react';
import type { CompareResponse, PerPostRecommendation, RankedPost } from '@/types';
import { apiPost } from '@/lib/api';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

function TagChip({ tag, color }: { tag: string; color: string }) {
  return (
    <span className={`inline-block text-xs font-bold uppercase tracking-wide px-2 py-1 border-2 border-[#121212] ${color}`}>
      #{tag}
    </span>
  );
}

function SectionLabel({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <span className={`inline-block text-xs font-black uppercase tracking-widest px-3 py-1 border-2 border-[#121212] ${color} mb-4`}>
      {children}
    </span>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-6">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 border-4 border-[#121212] animate-spin" style={{ animationDuration: '1.2s' }} />
        <div className="absolute inset-3 rounded-full border-4 border-[#1040C0] animate-spin" style={{ animationDuration: '0.8s', animationDirection: 'reverse' }} />
        <div className="absolute" style={{ inset: '30%', backgroundColor: '#F0C020', border: '2px solid #121212', transform: 'rotate(45deg)' }} />
      </div>
      <p className="font-black uppercase tracking-widest text-sm text-[#121212]">Comparing Posts...</p>
    </div>
  );
}

function PerformanceBadge({ level }: { level: 'high' | 'medium' | 'low' }) {
  const map = {
    high: 'bg-[#1040C0] text-white',
    medium: 'bg-[#F0C020] text-[#121212]',
    low: 'bg-[#D02020] text-white',
  };
  return (
    <span className={`inline-block text-xs font-black uppercase tracking-widest px-2 py-1 border-2 border-[#121212] ${map[level]}`}>
      {level}
    </span>
  );
}

function shortUrl(url: string) {
  const m = url.match(/\/(p|reel|tv)\/([A-Za-z0-9_-]+)/);
  return m ? `/${m[1]}/${m[2].slice(0, 8)}…` : url.slice(0, 24) + '…';
}

function EngagementBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-2 w-full">
      <div className="flex-1 h-2 bg-[#E0E0E0] border border-[#121212]">
        <div className={`h-full ${color} transition-all duration-300`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-black text-[#121212] w-16 text-right tabular-nums">
        {value.toLocaleString()}
      </span>
    </div>
  );
}

function CompareResults({ data }: { data: CompareResponse }) {
  const c = data.comparison;
  const posts = c.rankedPosts;

  const maxViews   = Math.max(...posts.map((p) => p.videoViews), 1);
  const maxLikes   = Math.max(...posts.map((p) => p.likes), 1);
  const maxComments = Math.max(...posts.map((p) => p.comments), 1);

  const perfColor: Record<string, string> = {
    high: 'bg-[#1040C0] text-white',
    medium: 'bg-[#F0C020] text-[#121212]',
    low: 'bg-[#D02020] text-white',
  };
  const rankAccent = ['bg-[#F0C020] text-[#121212]', 'bg-[#E0E0E0] text-[#121212]', 'bg-[#D0A000] text-white'];

  return (
    <div className="border-t-4 border-[#121212]">

      {/* ── RANKED POSTS ─────────────────────────────────────── */}
      <section className="bg-[#F0C020] border-b-4 border-[#121212] p-8 lg:p-12">
        <div className="max-w-7xl mx-auto">
          <SectionLabel color="bg-[#121212] text-white">Performance Ranking</SectionLabel>
          <div className="space-y-3">
            {posts.map((post, i) => (
              <div
                key={post.url}
                className="bg-white border-2 border-[#121212] shadow-[4px_4px_0px_0px_#121212] flex flex-col sm:flex-row"
              >
                {/* Rank badge */}
                <div className={`flex-shrink-0 w-full sm:w-16 flex items-center justify-center py-3 sm:py-0 border-b-2 sm:border-b-0 sm:border-r-2 border-[#121212] ${rankAccent[i] ?? 'bg-[#F0F0F0] text-[#121212]'}`}>
                  <span className="font-black text-2xl">#{post.rank}</span>
                </div>

                {/* Content */}
                <div className="flex-1 p-4 space-y-3">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="font-black text-sm uppercase tracking-wide text-[#121212]">{post.shortCaption}</p>
                      <a href={post.url} target="_blank" rel="noopener noreferrer"
                        className="text-xs text-[#1040C0] font-medium hover:underline break-all">
                        {shortUrl(post.url)}
                      </a>
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest px-2 py-1 border-2 border-[#121212] bg-[#F0F0F0]">
                      {post.hashtagCount} tags
                    </span>
                  </div>

                  {/* Engagement bars */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black uppercase tracking-widest text-[#121212] w-20 flex-shrink-0">Views</span>
                      <EngagementBar value={post.videoViews} max={maxViews} color="bg-[#1040C0]" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black uppercase tracking-widest text-[#121212] w-20 flex-shrink-0">Likes</span>
                      <EngagementBar value={post.likes} max={maxLikes} color="bg-[#D02020]" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black uppercase tracking-widest text-[#121212] w-20 flex-shrink-0">Comments</span>
                      <EngagementBar value={post.comments} max={maxComments} color="bg-[#F0C020]" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TOP / BOTTOM PERFORMER ───────────────────────────── */}
      <section className="bg-[#F0F0F0] border-b-4 border-[#121212] p-8 lg:p-12">
        <div className="max-w-7xl mx-auto">
          <SectionLabel color="bg-[#121212] text-white">Performer Analysis</SectionLabel>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#1040C0] border-4 border-[#121212] shadow-[8px_8px_0px_0px_#121212] p-6 relative">
              <div className="absolute top-0 right-0 w-8 h-8 bg-[#F0C020] border-l-4 border-b-4 border-[#121212]" />
              <p className="text-xs font-black uppercase tracking-widest text-white mb-1">Top Performer</p>
              <a href={c.topPerformer.url} target="_blank" rel="noopener noreferrer"
                className="block font-black text-xs text-[#F0C020] uppercase tracking-wide hover:underline mb-3 break-all">
                {shortUrl(c.topPerformer.url)}
              </a>
              <p className="text-white font-medium leading-relaxed text-sm">{c.topPerformer.reason}</p>
            </div>
            <div className="bg-[#D02020] border-4 border-[#121212] shadow-[8px_8px_0px_0px_#121212] p-6 relative">
              <div className="absolute top-0 right-0 w-8 h-8 bg-[#121212] border-l-4 border-b-4 border-[#D02020]" />
              <p className="text-xs font-black uppercase tracking-widest text-white mb-1">Bottom Performer</p>
              <a href={c.bottomPerformer.url} target="_blank" rel="noopener noreferrer"
                className="block font-black text-xs text-[#F0C020] uppercase tracking-wide hover:underline mb-3 break-all">
                {shortUrl(c.bottomPerformer.url)}
              </a>
              <p className="text-white font-medium leading-relaxed text-sm">{c.bottomPerformer.reason}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── HASHTAG PATTERNS ─────────────────────────────────── */}
      <section className="border-b-4 border-[#121212]">
        <div className="grid grid-cols-1 md:grid-cols-3">
          {[
            {
              label: 'Use These', sub: 'Found in high-performing posts',
              tags: c.hashtagPatterns.workingTags,
              bg: 'bg-[#1040C0]', border: 'md:border-r-4',
              countColor: 'text-[#F0C020]', chipColor: 'bg-white text-[#1040C0]',
              labelColor: 'text-white', subColor: 'text-white/70',
            },
            {
              label: 'Avoid These', sub: 'Common in low-performing posts',
              tags: c.hashtagPatterns.avoidTags,
              bg: 'bg-[#D02020]', border: 'md:border-r-4',
              countColor: 'text-[#F0C020]', chipColor: 'bg-white text-[#D02020]',
              labelColor: 'text-white', subColor: 'text-white/70',
            },
            {
              label: 'Add These', sub: "Top posts use them, low posts don't",
              tags: c.hashtagPatterns.missingFromLow,
              bg: 'bg-[#F0C020]', border: '',
              countColor: 'text-[#121212]', chipColor: 'bg-[#121212] text-white',
              labelColor: 'text-[#121212]', subColor: 'text-[#121212]/60',
            },
          ].map((col) => (
            <div key={col.label} className={`${col.bg} ${col.border} border-b-4 md:border-b-0 border-[#121212] p-6 lg:p-8`}>
              <p className={`font-black text-xs uppercase tracking-widest ${col.labelColor} mb-0.5`}>{col.label}</p>
              <p className={`text-xs font-medium ${col.subColor} mb-2`}>{col.sub}</p>
              <p className={`font-black text-4xl ${col.countColor} mb-4`}>{col.tags.length}</p>
              <div className="flex flex-wrap gap-2">
                {col.tags.length === 0
                  ? <p className={`text-xs font-medium ${col.subColor} uppercase tracking-wider`}>None identified</p>
                  : col.tags.map((tag) => (
                      <TagChip key={tag} tag={tag} color={col.chipColor} />
                    ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── KEY INSIGHTS ─────────────────────────────────────── */}
      <section className="bg-[#121212] border-b-4 border-[#121212] p-8 lg:p-12">
        <div className="max-w-7xl mx-auto">
          <SectionLabel color="bg-[#F0C020] text-[#121212]">Key Insights</SectionLabel>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {c.keyInsights.map((insight, i) => (
              <div key={i} className="border-2 border-[#333] bg-[#1C1C1C] p-5 shadow-[4px_4px_0px_0px_#1040C0]">
                <div className="flex gap-3 items-start">
                  <span className={`flex-shrink-0 w-7 h-7 font-black text-sm flex items-center justify-center border-2 border-[#121212] ${
                    i === 0 ? 'bg-[#F0C020] text-[#121212]' : i === 1 ? 'bg-[#D02020] text-white' : 'bg-[#1040C0] text-white'
                  }`}>
                    {i + 1}
                  </span>
                  <p className="text-white font-medium text-sm leading-relaxed">{insight}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PER-POST RECOMMENDATIONS ─────────────────────────── */}
      <section className="bg-[#F0F0F0] border-b-4 border-[#121212] p-8 lg:p-12">
        <div className="max-w-7xl mx-auto">
          <SectionLabel color="bg-[#121212] text-white">Per-Post Actions</SectionLabel>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {c.perPostRecommendations.map((rec: PerPostRecommendation, i: number) => (
              <div key={i} className="border-2 border-[#121212] bg-white shadow-[4px_4px_0px_0px_#121212]">
                <div className={`flex items-center gap-3 px-4 py-3 border-b-2 border-[#121212] ${perfColor[rec.currentPerformance] ?? 'bg-[#F0F0F0] text-[#121212]'}`}>
                  <span className="font-black text-xs uppercase tracking-widest border-2 border-current px-2 py-0.5">
                    {rec.currentPerformance}
                  </span>
                  <a href={rec.url} target="_blank" rel="noopener noreferrer"
                    className="font-bold text-xs hover:underline uppercase tracking-wide break-all opacity-90">
                    {shortUrl(rec.url)}
                  </a>
                </div>
                <ul className="p-4 space-y-2">
                  {rec.actions.map((action, j) => (
                    <li key={j} className="flex gap-2 text-[#121212]">
                      <span className="flex-shrink-0 w-5 h-5 bg-[#121212] text-white font-black text-xs flex items-center justify-center mt-0.5">→</span>
                      <p className="font-medium text-sm leading-relaxed">{action}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OVERALL STRATEGY ─────────────────────────────────── */}
      <section className="bg-[#1040C0] p-8 lg:p-12">
        <div className="max-w-7xl mx-auto">
          <SectionLabel color="bg-white text-[#121212]">Overall Strategy</SectionLabel>
          <div className="border-4 border-white p-6 lg:p-8 relative shadow-[8px_8px_0px_0px_rgba(255,255,255,0.25)]">
            <div className="absolute top-0 right-0 w-10 h-10 bg-[#F0C020] border-l-4 border-b-4 border-white" />
            <p className="font-medium text-lg leading-relaxed text-white max-w-4xl">{c.overallStrategy}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function ComparePage() {
  const [urls, setUrls] = useState<string[]>(['', '']);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CompareResponse | null>(null);
  const [error, setError] = useState('');

  function updateUrl(i: number, value: string) {
    setUrls((prev) => prev.map((u, idx) => (idx === i ? value : u)));
  }

  function addUrl() {
    if (urls.length < 10) setUrls((prev) => [...prev, '']);
  }

  function removeUrl(i: number) {
    if (urls.length > 2) setUrls((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function handleCompare() {
    const validUrls = urls.filter((u) => u.trim());
    if (validUrls.length < 2) return;
    setLoading(true);
    setResult(null);
    setError('');
    try {
      const data = await apiPost<CompareResponse>('/compare', { urls: validUrls });
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

  const validCount = urls.filter((u) => u.trim()).length;

  return (
    <main>
      {/* HERO */}
      <section className="border-b-4 border-[#121212] grid grid-cols-1 lg:grid-cols-5 min-h-[440px]">
        {/* Left */}
        <div className="lg:col-span-3 bg-[#F0F0F0] p-8 lg:p-16 flex flex-col justify-center">
          <div className="inline-block bg-[#1040C0] text-white text-xs font-black uppercase tracking-widest px-3 py-1 border-2 border-[#121212] mb-6 shadow-[3px_3px_0px_0px_#121212] w-fit">
            Post Comparison
          </div>
          <h1 className="font-black uppercase leading-[0.9] tracking-tighter mb-6">
            <span className="block text-5xl sm:text-6xl lg:text-7xl xl:text-8xl text-[#121212]">COM</span>
            <span className="block text-5xl sm:text-6xl lg:text-7xl xl:text-8xl text-[#121212]">PARE</span>
            <span className="block text-5xl sm:text-6xl lg:text-7xl xl:text-8xl text-[#1040C0]">POSTS</span>
          </h1>
          <p className="font-medium text-lg text-[#121212] leading-relaxed max-w-md">
            Add 2–10 Instagram post URLs. Discover which hashtag strategies drive the most views and engagement.
          </p>
        </div>

        {/* Right — Blue panel */}
        <div className="hidden lg:flex lg:col-span-2 bg-[#121212] border-l-4 border-[#121212] relative overflow-hidden items-center justify-center">
          <div className="absolute inset-0 dot-grid-white opacity-30" />
          <div className="relative flex flex-col items-center gap-6">
            {[
              { bg: '#D02020', text: '#1', shadow: '#F0C020' },
              { bg: '#1040C0', text: '#2', shadow: '#D02020' },
              { bg: '#F0C020', text: '#3', shadow: '#1040C0' },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-4">
                <div
                  className="w-16 h-16 border-4 border-white flex items-center justify-center"
                  style={{ backgroundColor: item.bg, boxShadow: `6px 6px 0px 0px ${item.shadow}` }}
                >
                  <span className="font-black text-2xl text-white">{item.text}</span>
                </div>
                <div className="w-32 h-3 bg-white opacity-20" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FORM */}
      <section className="bg-[#F0F0F0] border-b-4 border-[#121212] p-8 lg:p-12">
        <div className="max-w-3xl mx-auto">
          <SectionLabel color="bg-[#121212] text-white">Instagram URLs</SectionLabel>

          <div className="space-y-3 mb-6">
            {urls.map((url, i) => (
              <div key={i} className="flex gap-3 items-stretch">
                <div className="flex-shrink-0 w-8 h-full bg-[#121212] text-white font-black text-xs flex items-center justify-center border-2 border-[#121212] shadow-[3px_3px_0px_0px_#1040C0] self-stretch min-h-[44px]">
                  {i + 1}
                </div>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => updateUrl(i, e.target.value)}
                  placeholder={`https://www.instagram.com/reel/...`}
                  className="flex-1 bg-white border-2 border-[#121212] shadow-[4px_4px_0px_0px_#121212] px-4 py-3 font-medium text-sm text-[#121212] placeholder-[#121212]/40 focus:outline-none focus:shadow-[4px_4px_0px_0px_#1040C0] transition-shadow"
                />
                {urls.length > 2 && (
                  <button
                    onClick={() => removeUrl(i)}
                    className="flex-shrink-0 w-10 h-full bg-[#D02020] text-white border-2 border-[#121212] shadow-[3px_3px_0px_0px_#121212] font-black text-lg active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all self-stretch min-h-[44px]"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-4">
            {urls.length < 10 && (
              <button
                onClick={addUrl}
                className="bg-[#F0F0F0] text-[#121212] border-2 border-[#121212] shadow-[4px_4px_0px_0px_#121212] px-5 py-3 font-black uppercase tracking-widest text-xs hover:bg-[#E0E0E0] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
              >
                + Add URL
              </button>
            )}
            <button
              onClick={handleCompare}
              disabled={loading || validCount < 2}
              className="bg-[#1040C0] text-white border-2 border-[#121212] shadow-[4px_4px_0px_0px_#121212] px-8 py-3 font-black uppercase tracking-widest text-sm hover:bg-[#1040C0]/90 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? 'Comparing...' : `Compare ${validCount >= 2 ? validCount : ''} Posts →`}
            </button>
          </div>

          {validCount < 2 && (
            <p className="mt-4 text-xs font-medium uppercase tracking-wider text-[#121212]/50">
              Add at least 2 URLs to compare
            </p>
          )}
        </div>
      </section>

      {/* RESULTS */}
      {loading && (
        <div className="max-w-7xl mx-auto px-4">
          <LoadingSpinner />
        </div>
      )}

      {error && (
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="bg-[#D02020] border-4 border-[#121212] shadow-[8px_8px_0px_0px_#121212] p-6">
            <p className="font-black uppercase tracking-wider text-white text-sm">Error</p>
            <p className="text-white font-medium mt-2">{error}</p>
          </div>
        </div>
      )}

      {result && !loading && <CompareResults data={result} />}
    </main>
  );
}

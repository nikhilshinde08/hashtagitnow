'use client';

import { useState } from 'react';
import type { AnalyzeResponse } from '@/types';
import { apiPost } from '@/lib/api';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

function TagChip({ tag, color }: { tag: string; color: string }) {
  return (
    <span
      className={`inline-block text-xs font-bold uppercase tracking-wider px-2 py-1 border-2 border-[#121212] ${color} shadow-[2px_2px_0px_0px_#121212] tag-animate`}
    >
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
    <div className="flex flex-col items-center justify-center py-20 gap-6">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-[#121212] animate-spin" style={{ animationDuration: '1s' }} />
        <div className="absolute inset-2 rounded-full border-4 border-[#D02020] animate-spin" style={{ animationDuration: '0.7s', animationDirection: 'reverse' }} />
        <div className="absolute inset-4 w-4 h-4 bg-[#F0C020] border-2 border-[#121212] rotate-45" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(45deg)' }} />
      </div>
      <p className="font-black uppercase tracking-widest text-sm text-[#121212]">Analysing...</p>
    </div>
  );
}

function ErrorCard({ message }: { message: string }) {
  return (
    <div className="bg-[#D02020] border-4 border-[#121212] shadow-[8px_8px_0px_0px_#121212] p-6">
      <p className="font-black uppercase tracking-wider text-white text-sm">Error</p>
      <p className="text-white font-medium mt-2">{message}</p>
    </div>
  );
}

function AnalyzeResults({ data }: { data: AnalyzeResponse }) {
  return (
    <div className="mt-0 space-y-0 border-t-4 border-[#121212]">

      {/* POST SUMMARY — Yellow */}
      <section className="bg-[#F0C020] border-b-4 border-[#121212] p-8 lg:p-12">
        <div className="max-w-7xl mx-auto">
          <SectionLabel color="bg-[#121212] text-white">Post Summary</SectionLabel>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <p className="font-black text-2xl lg:text-3xl uppercase tracking-tight text-[#121212] leading-tight">
                {data.postSummary.topic}
              </p>
              <div className="flex items-center gap-3 mt-4">
                <span className="inline-block bg-[#121212] text-white text-xs font-black uppercase tracking-widest px-3 py-1">
                  {data.postSummary.niche}
                </span>
                <span className="text-sm font-bold uppercase tracking-wider text-[#121212]">
                  {data.postSummary.mediaType}
                </span>
              </div>
              <p className="mt-4 font-medium text-[#121212] leading-relaxed">{data.postSummary.engagementNote}</p>
            </div>
            <div className="flex flex-col gap-3">
              {data.postSummary.likes > 0 && (
                <div className="bg-[#121212] p-4 border-2 border-[#121212] shadow-[4px_4px_0px_0px_#D02020]">
                  <p className="text-3xl font-black text-white">{data.postSummary.likes.toLocaleString()}</p>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#F0C020] mt-1">Likes</p>
                </div>
              )}
              {data.postSummary.comments > 0 && (
                <div className="bg-[#121212] p-4 border-2 border-[#121212] shadow-[4px_4px_0px_0px_#1040C0]">
                  <p className="text-3xl font-black text-white">{data.postSummary.comments.toLocaleString()}</p>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#F0C020] mt-1">Comments</p>
                </div>
              )}
            </div>
          </div>

          {/* Detected Hashtags */}
          {data.detectedHashtags.length > 0 && (
            <div className="mt-8 pt-6 border-t-4 border-[#121212]">
              <p className="text-xs font-black uppercase tracking-widest text-[#121212] mb-3">
                Detected Hashtags ({data.detectedHashtags.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {data.detectedHashtags.map((tag) => (
                  <TagChip key={tag} tag={tag} color="bg-white" />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* HASHTAG AUDIT — White */}
      <section className="bg-[#F0F0F0] border-b-4 border-[#121212] p-8 lg:p-12">
        <div className="max-w-7xl mx-auto">
          <SectionLabel color="bg-[#121212] text-white">Hashtag Audit</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border-2 border-[#121212] shadow-[8px_8px_0px_0px_#121212]">
            {[
              { label: 'Effective', tags: data.hashtagAudit.effective, headerColor: 'bg-[#1040C0] text-white', chipColor: 'bg-[#1040C0] text-white' },
              { label: 'Too Generic', tags: data.hashtagAudit.tooGeneric, headerColor: 'bg-[#F0C020] text-[#121212]', chipColor: 'bg-[#F0C020]' },
              { label: 'Irrelevant', tags: data.hashtagAudit.irrelevant, headerColor: 'bg-[#D02020] text-white', chipColor: 'bg-[#D02020] text-white' },
              { label: 'Missing', tags: data.hashtagAudit.missing, headerColor: 'bg-[#121212] text-white', chipColor: 'bg-white' },
            ].map((col, i) => (
              <div key={col.label} className={`border-[#121212] ${i < 3 ? 'border-r-2' : ''} flex flex-col`}>
                <div className={`${col.headerColor} px-4 py-3 border-b-2 border-[#121212]`}>
                  <p className="font-black text-xs uppercase tracking-widest">{col.label}</p>
                  <p className="font-black text-2xl">{col.tags.length}</p>
                </div>
                <div className="p-4 flex flex-wrap gap-2 flex-1">
                  {col.tags.length === 0 ? (
                    <p className="text-xs font-medium text-[#121212] opacity-40 uppercase tracking-wider">None</p>
                  ) : (
                    col.tags.map((tag) => (
                      <span key={tag} className={`inline-block text-xs font-bold uppercase tracking-wide px-2 py-1 border-2 border-[#121212] ${col.chipColor}`}>
                        #{tag}
                      </span>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RECOMMENDED HASHTAGS — Blue */}
      <section className="bg-[#1040C0] border-b-4 border-[#121212] p-8 lg:p-12 dot-grid-white">
        <div className="max-w-7xl mx-auto">
          <SectionLabel color="bg-white text-[#121212]">Recommended Hashtags</SectionLabel>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-2 border-white shadow-[8px_8px_0px_0px_rgba(255,255,255,0.3)]">
            {[
              { label: 'High Reach', tags: data.recommendedHashtags.highReach, accent: '#F0C020' },
              { label: 'Niche', tags: data.recommendedHashtags.niche, accent: '#D02020' },
              { label: 'Low Competition', tags: data.recommendedHashtags.lowCompetition, accent: '#F0F0F0' },
            ].map((tier, i) => (
              <div key={tier.label} className={`border-white ${i < 2 ? 'border-r-2' : ''}`}>
                <div className="px-4 py-3 border-b-2 border-white" style={{ backgroundColor: tier.accent }}>
                  <p className="font-black text-xs uppercase tracking-widest text-[#121212]">{tier.label}</p>
                  <p className="font-black text-2xl text-[#121212]">{tier.tags.length} tags</p>
                </div>
                <div className="p-4 flex flex-wrap gap-2">
                  {tier.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-block text-xs font-bold uppercase tracking-wide px-2 py-1 border-2 border-white text-white cursor-pointer hover:bg-white hover:text-[#1040C0] transition-colors duration-150"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ISSUES & SUGGESTIONS — Red */}
      <section className="bg-[#D02020] border-b-4 border-[#121212] p-8 lg:p-12">
        <div className="max-w-7xl mx-auto">
          <SectionLabel color="bg-white text-[#121212]">Issues & Suggestions</SectionLabel>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-2 border-[#121212] shadow-[8px_8px_0px_0px_#121212]">
            <div className="border-r-2 border-[#121212]">
              <div className="bg-[#121212] px-4 py-3 border-b-2 border-[#121212]">
                <p className="font-black text-xs uppercase tracking-widest text-white">Issues ({data.analysis.issues.length})</p>
              </div>
              <ul className="p-4 space-y-3">
                {data.analysis.issues.map((issue, i) => (
                  <li key={i} className="flex gap-3 text-white">
                    <span className="flex-shrink-0 w-5 h-5 bg-white text-[#D02020] font-black text-xs flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    <p className="font-medium text-sm leading-relaxed">{issue}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="bg-[#F0C020] px-4 py-3 border-b-2 border-[#121212]">
                <p className="font-black text-xs uppercase tracking-widest text-[#121212]">Suggestions ({data.analysis.suggestions.length})</p>
              </div>
              <ul className="p-4 space-y-3">
                {data.analysis.suggestions.map((s, i) => (
                  <li key={i} className="flex gap-3 text-white">
                    <span className="flex-shrink-0 w-5 h-5 bg-[#F0C020] text-[#121212] font-black text-xs flex items-center justify-center mt-0.5">→</span>
                    <p className="font-medium text-sm leading-relaxed">{s}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* EXPLANATION — Off-white */}
      <section className="bg-[#F0F0F0] p-8 lg:p-12">
        <div className="max-w-7xl mx-auto">
          <SectionLabel color="bg-[#121212] text-white">Strategy Verdict</SectionLabel>
          <div className="border-4 border-[#121212] bg-white shadow-[8px_8px_0px_0px_#121212] p-6 lg:p-8 relative">
            <div className="absolute top-0 right-0 w-6 h-6 bg-[#D02020] border-l-4 border-b-4 border-[#121212]" />
            <p className="font-medium text-lg leading-relaxed text-[#121212]">{data.explanation}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function AnalyzePage() {
  const [inputType, setInputType] = useState<'caption' | 'url'>('url');
  const [content, setContent] = useState('');
  const [niche, setNiche] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [error, setError] = useState('');

  async function handleAnalyse() {
    if (!content.trim()) return;
    setLoading(true);
    setResult(null);
    setError('');
    try {
      const data = await apiPost<AnalyzeResponse>('/analyze', {
        inputType, content: content.trim(), niche: niche.trim() || undefined,
      });
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

  return (
    <main>
      {/* HERO */}
      <section className="border-b-4 border-[#121212] min-h-[480px] lg:min-h-[560px] grid grid-cols-1 lg:grid-cols-5">
        {/* Left — Text + Form */}
        <div className="lg:col-span-3 bg-[#F0F0F0] p-8 lg:p-16 flex flex-col justify-center">
          <div className="mb-8">
            <div className="inline-block bg-[#D02020] text-white text-xs font-black uppercase tracking-widest px-3 py-1 border-2 border-[#121212] mb-6 shadow-[3px_3px_0px_0px_#121212]">
              AI Hashtag Intelligence
            </div>
            <h1 className="font-black uppercase leading-[0.9] tracking-tighter">
              <span className="block text-5xl sm:text-6xl lg:text-7xl xl:text-8xl text-[#121212]">HASH</span>
              <span className="block text-5xl sm:text-6xl lg:text-7xl xl:text-8xl text-[#121212]">TAG</span>
              <span className="block text-5xl sm:text-6xl lg:text-7xl xl:text-8xl text-[#D02020]">INTEL</span>
            </h1>
            <p className="mt-6 font-medium text-lg text-[#121212] leading-relaxed max-w-md">
              Paste a caption or Instagram URL. Get a full hashtag audit, ranked recommendations, and a growth strategy.
            </p>
          </div>

          {/* Input Type Toggle */}
          <div className="flex border-2 border-[#121212] shadow-[4px_4px_0px_0px_#121212] w-fit mb-6">
            {(['url', 'caption'] as const).map((type) => (
              <button
                key={type}
                onClick={() => { setInputType(type); setContent(''); }}
                className={`px-6 py-2 text-xs font-black uppercase tracking-widest transition-colors duration-150 ${
                  inputType === type
                    ? 'bg-[#121212] text-white'
                    : 'bg-[#F0F0F0] text-[#121212] hover:bg-[#E0E0E0]'
                } ${type === 'caption' ? 'border-l-2 border-[#121212]' : ''}`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Content Input */}
          <div className="space-y-4 max-w-xl">
            {inputType === 'url' ? (
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-[#121212] mb-2">
                  Instagram URL
                </label>
                <input
                  type="url"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="https://www.instagram.com/reel/..."
                  className="w-full bg-white border-2 border-[#121212] shadow-[4px_4px_0px_0px_#121212] px-4 py-3 font-medium text-sm text-[#121212] placeholder-[#121212]/40 focus:outline-none focus:shadow-[4px_4px_0px_0px_#1040C0] transition-shadow"
                />
              </div>
            ) : (
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-[#121212] mb-2">
                  Caption
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Paste your Instagram caption here..."
                  rows={4}
                  className="w-full bg-white border-2 border-[#121212] shadow-[4px_4px_0px_0px_#121212] px-4 py-3 font-medium text-sm text-[#121212] placeholder-[#121212]/40 focus:outline-none focus:shadow-[4px_4px_0px_0px_#1040C0] transition-shadow resize-none"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-[#121212] mb-2">
                Niche <span className="font-medium normal-case tracking-normal opacity-50">(optional)</span>
              </label>
              <input
                type="text"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                placeholder="e.g. fitness and yoga, कॉमेडी, travel photography"
                className="w-full bg-white border-2 border-[#121212] shadow-[4px_4px_0px_0px_#121212] px-4 py-3 font-medium text-sm text-[#121212] placeholder-[#121212]/40 focus:outline-none focus:shadow-[4px_4px_0px_0px_#F0C020] transition-shadow"
              />
            </div>

            <button
              onClick={handleAnalyse}
              disabled={loading || !content.trim()}
              className="w-full bg-[#D02020] text-white border-2 border-[#121212] shadow-[4px_4px_0px_0px_#121212] px-6 py-4 font-black uppercase tracking-widest text-sm hover:bg-[#D02020]/90 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? 'Analysing...' : 'Analyse →'}
            </button>
          </div>
        </div>

        {/* Right — Blue Geometric Panel */}
        <div className="hidden lg:flex lg:col-span-2 bg-[#1040C0] border-l-4 border-[#121212] relative overflow-hidden items-center justify-center dot-grid-white">
          {/* Large background circle */}
          <div className="absolute top-[-60px] right-[-60px] w-64 h-64 rounded-full border-4 border-white opacity-20" />
          {/* Background rotated square */}
          <div className="absolute bottom-[-40px] left-[-40px] w-48 h-48 border-4 border-white opacity-20 rotate-45" />

          {/* Central composition */}
          <div className="relative flex flex-col items-center gap-4">
            <div className="w-32 h-32 rounded-full bg-white border-4 border-[#121212] shadow-[8px_8px_0px_0px_#121212] flex items-center justify-center">
              <span className="font-black text-3xl text-[#1040C0]">#</span>
            </div>
            <div className="w-20 h-20 bg-[#F0C020] border-4 border-[#121212] shadow-[6px_6px_0px_0px_#121212] rotate-45 flex items-center justify-center">
              <span className="font-black text-xl text-[#121212] -rotate-45">★</span>
            </div>
            <div
              className="w-16 h-16 bg-[#D02020] border-4 border-[#121212] shadow-[4px_4px_0px_0px_#121212]"
              style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
            />
          </div>

          {/* Corner label */}
          <div className="absolute bottom-6 right-6 border-2 border-white px-3 py-2">
            <p className="text-white font-black text-xs uppercase tracking-widest">AI Powered</p>
          </div>
        </div>
      </section>

      {/* RESULTS */}
      {loading && (
        <div className="max-w-7xl mx-auto px-4 py-16">
          <LoadingSpinner />
        </div>
      )}

      {error && (
        <div className="max-w-7xl mx-auto px-4 py-12">
          <ErrorCard message={error} />
        </div>
      )}

      {result && !loading && <AnalyzeResults data={result} />}

      {/* Empty state footer */}
      {!result && !loading && !error && (
        <div className="bg-[#121212] border-t-4 border-[#121212] py-16">
          <div className="max-w-7xl mx-auto px-4 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <p className="font-black text-3xl uppercase tracking-tighter text-white leading-tight">
                Stop guessing.<br />
                <span className="text-[#F0C020]">Start knowing.</span>
              </p>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-[#D02020] border-2 border-white shadow-[4px_4px_0px_0px_#D02020]" />
              <div className="w-12 h-12 bg-[#1040C0] border-2 border-white shadow-[4px_4px_0px_0px_#1040C0]" />
              <div className="w-12 h-12 bg-[#F0C020] border-2 border-white shadow-[4px_4px_0px_0px_#F0C020]"
                style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { apiPost } from '@/lib/api';

type Tone = 'funny' | 'educational' | 'inspirational';
type Platform = 'instagram' | 'youtube';

interface GeneratedHook {
  hook: string;
  caption: string;
  hashtags: string[];
  overlay: string;
}

interface GenerateResponse {
  niche: string;
  tone: Tone;
  platform: Platform;
  hooks: GeneratedHook[];
}

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="inline-flex items-center gap-1 bg-white border-2 border-[#121212] shadow-[2px_2px_0px_0px_#121212] px-3 py-1.5 text-xs font-bold text-[#121212] hover:bg-[#F0F0F0] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
    >
      #{text} {copied ? '✓' : '⎘'}
    </button>
  );
}

function HookCard({ hook, index }: { hook: GeneratedHook; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const [captionCopied, setCaptionCopied] = useState(false);

  const colors = ['#D02020', '#1040C0', '#121212', '#D02020', '#1040C0', '#121212', '#D02020', '#1040C0', '#121212', '#D02020'];
  const accent = colors[index % colors.length];

  return (
    <div className="border-2 border-[#121212] shadow-[4px_4px_0px_0px_#121212] bg-white overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-5 hover:bg-[#F0F0F0] transition-colors group"
      >
        <div className="flex items-start gap-4">
          <div
            className="w-8 h-8 border-2 border-[#121212] flex items-center justify-center font-black text-sm text-white shrink-0 mt-0.5"
            style={{ backgroundColor: accent }}
          >
            {String(index + 1).padStart(2, '0')}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm text-[#121212] leading-snug">{hook.hook}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[10px] font-black uppercase tracking-widest border border-[#121212]/30 px-2 py-0.5 text-[#121212]/50">
                {hook.overlay}
              </span>
            </div>
          </div>
          <span className={`font-black text-[#121212]/30 text-lg transition-transform shrink-0 ${expanded ? 'rotate-90' : ''}`}>→</span>
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="border-t-2 border-[#121212]">

          {/* First-frame overlay */}
          <div className="px-5 py-4 border-b-2 border-[#121212]" style={{ backgroundColor: accent }}>
            <p className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-1">First-Frame Overlay</p>
            <p className="font-black text-lg text-white uppercase tracking-tight">{hook.overlay}</p>
          </div>

          {/* Caption */}
          <div className="px-5 py-4 border-b-2 border-[#121212] bg-[#FAFAFA]">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-black uppercase tracking-widest text-[#121212]/50">Full Caption</p>
              <button
                onClick={async () => {
                  await navigator.clipboard.writeText(hook.caption);
                  setCaptionCopied(true);
                  setTimeout(() => setCaptionCopied(false), 2000);
                }}
                className="text-xs font-black uppercase tracking-widest border-2 border-[#121212] px-3 py-1 shadow-[2px_2px_0px_0px_#121212] hover:bg-[#F0F0F0] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
              >
                {captionCopied ? '✓ Copied' : 'Copy ⎘'}
              </button>
            </div>
            <p className="text-sm font-medium text-[#121212] leading-relaxed whitespace-pre-line">{hook.caption}</p>
          </div>

          {/* Hashtags */}
          <div className="px-5 py-4">
            <p className="text-xs font-black uppercase tracking-widest text-[#121212]/50 mb-3">5 Hashtags</p>
            <div className="flex flex-wrap gap-2">
              {hook.hashtags.map((tag) => (
                <CopyBtn key={tag} text={tag} />
              ))}
            </div>
            <button
              onClick={async () => {
                await navigator.clipboard.writeText(hook.hashtags.map((t) => `#${t}`).join(' '));
              }}
              className="mt-3 text-xs font-black uppercase tracking-widest border-2 border-[#121212] bg-[#121212] text-white px-4 py-2 shadow-[3px_3px_0px_0px_#1040C0] hover:bg-[#121212]/90 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
            >
              Copy All Hashtags
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Skeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="border-2 border-[#121212] shadow-[4px_4px_0px_0px_#121212] bg-white p-5 animate-pulse">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-[#E0E0E0] border-2 border-[#121212] shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-[#E0E0E0] rounded w-full" />
              <div className="h-3 bg-[#E0E0E0] rounded w-2/3" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

const DAILY_LIMIT = 3;

function getUsageToday(): number {
  if (typeof window === 'undefined') return 0;
  const today = new Date().toDateString();
  const stored = JSON.parse(localStorage.getItem('gen_usage') || '{}') as Record<string, number>;
  return stored[today] ?? 0;
}

function incrementUsage(): number {
  const today = new Date().toDateString();
  const stored = JSON.parse(localStorage.getItem('gen_usage') || '{}') as Record<string, number>;
  const next = (stored[today] ?? 0) + 1;
  localStorage.setItem('gen_usage', JSON.stringify({ ...stored, [today]: next }));
  return next;
}

export default function GeneratePage() {
  const [niche, setNiche] = useState('');
  const [tone, setTone] = useState<Tone>('inspirational');
  const [platform, setPlatform] = useState<Platform>('instagram');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerateResponse | null>(null);
  const [error, setError] = useState('');
  const [usedToday, setUsedToday] = useState(0);

  useEffect(() => { setUsedToday(getUsageToday()); }, []);

  const remaining = Math.max(0, DAILY_LIMIT - usedToday);
  const limitReached = remaining === 0;

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!niche.trim() || limitReached) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const data = await apiPost<GenerateResponse>('/generate', { niche: niche.trim(), tone, platform });
      setResult(data);
      setUsedToday(incrementUsage());
    } catch (err) {
      setError((err as Error).message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  const tones: { value: Tone; label: string; emoji: string }[] = [
    { value: 'inspirational', label: 'Inspirational', emoji: '★' },
    { value: 'funny', label: 'Funny', emoji: '😂' },
    { value: 'educational', label: 'Educational', emoji: '📚' },
  ];

  return (
    <main className="min-h-screen bg-[#F0F0F0]">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="border-b-4 border-[#121212] bg-[#121212] px-4 py-12 sm:px-8">
        <div className="max-w-3xl mx-auto">
          <span className="inline-block text-xs font-black uppercase tracking-widest px-3 py-1 border-2 border-[#F0C020] text-[#F0C020] mb-4 shadow-[2px_2px_0px_0px_rgba(240,192,32,0.3)]">
            AI Hook Generator
          </span>
          <h1 className="font-black text-4xl sm:text-5xl uppercase tracking-tighter text-white leading-tight mb-3">
            Get Your Next<br />
            <span className="text-[#D02020]">Viral Post</span> in 10 Seconds
          </h1>
          <p className="text-white/60 font-medium text-base max-w-xl">
            10 hooks + full captions + hashtags, powered by live trending data. Supports Hindi, Hinglish, and English niches.
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-8 py-10 space-y-10">

        {/* ── FORM ─────────────────────────────────────────────── */}
        <form onSubmit={handleGenerate} className="space-y-6">

          {/* Niche input */}
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-[#121212] mb-2">
              Your Niche <span className="text-[#121212]/40 normal-case font-medium">(Hindi / Hinglish / English)</span>
            </label>
            <input
              type="text"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              placeholder="e.g. fitness india, desi comedy, travel reels, yoga hindi…"
              required
              className="w-full bg-white border-2 border-[#121212] shadow-[4px_4px_0px_0px_#121212] px-4 py-3 font-medium text-sm text-[#121212] placeholder-[#121212]/30 focus:outline-none focus:shadow-[4px_4px_0px_0px_#1040C0] transition-shadow"
            />
          </div>

          {/* Tone + Platform row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

            {/* Tone */}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-[#121212] mb-2">Tone</label>
              <div className="flex gap-2">
                {tones.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setTone(t.value)}
                    className={`flex-1 py-2 px-3 text-xs font-black uppercase tracking-widest border-2 border-[#121212] transition-all ${
                      tone === t.value
                        ? 'bg-[#121212] text-white shadow-[3px_3px_0px_0px_#D02020]'
                        : 'bg-white text-[#121212] shadow-[3px_3px_0px_0px_#121212] hover:bg-[#F0F0F0]'
                    }`}
                  >
                    {t.emoji} {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Platform */}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-[#121212] mb-2">Platform</label>
              <div className="flex gap-2">
                {(['instagram', 'youtube'] as Platform[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPlatform(p)}
                    className={`flex-1 py-2 px-3 text-xs font-black uppercase tracking-widest border-2 border-[#121212] transition-all ${
                      platform === p
                        ? 'bg-[#1040C0] text-white shadow-[3px_3px_0px_0px_#121212]'
                        : 'bg-white text-[#121212] shadow-[3px_3px_0px_0px_#121212] hover:bg-[#F0F0F0]'
                    }`}
                  >
                    {p === 'instagram' ? '📸' : '▷'} {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Usage counter */}
          <div className="flex items-center justify-between border-2 border-[#121212] px-4 py-3 bg-white shadow-[3px_3px_0px_0px_#121212]">
            <div className="flex items-center gap-2">
              {Array.from({ length: DAILY_LIMIT }).map((_, i) => (
                <div
                  key={i}
                  className={`w-4 h-4 border-2 border-[#121212] ${i < usedToday ? 'bg-[#D02020]' : 'bg-[#F0F0F0]'}`}
                />
              ))}
              <span className="text-xs font-black uppercase tracking-widest text-[#121212]/60 ml-2">
                {remaining} free generation{remaining !== 1 ? 's' : ''} left today
              </span>
            </div>
            <a href="/pricing" className="text-xs font-black uppercase tracking-widest text-[#1040C0] hover:underline">
              Go Pro →
            </a>
          </div>

          {error && (
            <p className="text-xs font-bold text-[#D02020] border-2 border-[#D02020] px-3 py-2">{error}</p>
          )}

          {limitReached ? (
            <div className="bg-[#121212] border-2 border-[#121212] shadow-[4px_4px_0px_0px_#D02020] p-6 text-center">
              <p className="font-black text-white uppercase tracking-tight text-lg mb-2">Daily Limit Reached</p>
              <p className="text-white/60 font-medium text-sm mb-4">You&apos;ve used all 3 free generations for today. Resets at midnight.</p>
              <a
                href="/pricing"
                className="inline-flex items-center gap-2 bg-[#D02020] text-white border-2 border-white px-6 py-3 font-black uppercase tracking-widest text-sm hover:bg-[#D02020]/90 transition-all"
              >
                Upgrade for Unlimited →
              </a>
            </div>
          ) : (
            <button
              type="submit"
              disabled={loading || !niche.trim()}
              className="w-full bg-[#D02020] text-white border-2 border-[#121212] shadow-[4px_4px_0px_0px_#121212] px-6 py-4 font-black uppercase tracking-widest text-sm hover:bg-[#D02020]/90 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all disabled:opacity-50"
            >
              {loading ? 'Generating 10 Hooks…' : `Generate Hooks → (${remaining} left)`}
            </button>
          )}
        </form>

        {/* ── RESULTS ──────────────────────────────────────────── */}
        {loading && <Skeleton />}

        {result && (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <span className="inline-block text-xs font-black uppercase tracking-widest px-3 py-1 border-2 border-[#121212] bg-[#D02020] text-white shadow-[2px_2px_0px_0px_#121212]">
                {result.hooks.length} Hooks
              </span>
              <p className="text-sm font-bold text-[#121212]/60 uppercase tracking-widest">
                {result.niche} · {result.tone} · {result.platform}
              </p>
            </div>
            <p className="text-xs font-medium text-[#121212]/40 mb-4">Click any hook to expand caption, hashtags and overlay text.</p>
            <div className="space-y-3">
              {result.hooks.map((hook, i) => (
                <HookCard key={i} hook={hook} index={i} />
              ))}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}

'use client';

import { useState } from 'react';

export function CopyButton({ tag }: { tag: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(`#${tag}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1 bg-white border-2 border-[#121212] shadow-[2px_2px_0px_0px_#121212] px-3 py-1.5 text-xs font-bold text-[#121212] hover:bg-[#F0F0F0] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
    >
      <span>#{tag}</span>
      <span className="text-[10px]">{copied ? '✓' : '⎘'}</span>
    </button>
  );
}

export function CopyAllButton({ tags }: { tags: string[] }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(tags.map((t) => `#${t}`).join(' '));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-2 bg-[#1040C0] text-white border-2 border-[#121212] shadow-[4px_4px_0px_0px_#121212] px-5 py-3 font-black uppercase tracking-widest text-sm hover:bg-[#1040C0]/90 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
    >
      {copied ? '✓ Copied!' : 'Copy All 5 Hashtags'}
    </button>
  );
}

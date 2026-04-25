'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Suspense } from 'react';

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get('next') ?? '/analyze';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const supabase = createClient();
    if (!supabase) { setError('Auth not configured.'); setLoading(false); return; }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push(next);
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      {[
        { label: 'Email Address', value: email, setter: setEmail, type: 'email', placeholder: 'you@example.com' },
        { label: 'Password', value: password, setter: setPassword, type: 'password', placeholder: 'Your password' },
      ].map((f) => (
        <div key={f.label}>
          <label className="block text-xs font-black uppercase tracking-widest text-[#121212] mb-2">{f.label}</label>
          <input
            type={f.type}
            value={f.value}
            onChange={(e) => f.setter(e.target.value)}
            placeholder={f.placeholder}
            required
            className="w-full bg-white border-2 border-[#121212] shadow-[4px_4px_0px_0px_#121212] px-4 py-3 font-medium text-sm text-[#121212] placeholder-[#121212]/40 focus:outline-none focus:shadow-[4px_4px_0px_0px_#1040C0] transition-shadow"
          />
        </div>
      ))}

      {error && <p className="text-xs font-bold text-[#D02020] border-2 border-[#D02020] px-3 py-2">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#1040C0] text-white border-2 border-[#121212] shadow-[4px_4px_0px_0px_#121212] px-6 py-4 font-black uppercase tracking-widest text-sm hover:bg-[#1040C0]/90 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all disabled:opacity-50"
      >
        {loading ? 'Signing In...' : 'Sign In →'}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#F0F0F0] flex">
      <div className="hidden lg:flex lg:w-1/2 bg-[#121212] border-r-4 border-[#121212] flex-col items-center justify-center p-16 relative overflow-hidden dot-grid-white">
        <div className="absolute top-10 right-10 w-32 h-32 rounded-full border-4 border-white opacity-10" />
        <div className="absolute bottom-10 left-10 w-24 h-24 border-4 border-white opacity-10 rotate-45" />
        <Image src="/logo.png" alt="HashtagItNow" width={280} height={80} className="w-64 h-auto object-contain mb-8 brightness-0 invert" />
        <p className="text-white/60 font-medium text-lg text-center leading-relaxed max-w-sm">
          AI-powered hashtag strategy for Instagram, YouTube, TikTok & more.
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <Image src="/logo.png" alt="HashtagItNow" width={200} height={56} className="h-12 w-auto object-contain" />
          </div>

          <div className="mb-8">
            <span className="inline-block text-xs font-black uppercase tracking-widest px-3 py-1 border-2 border-[#121212] bg-[#1040C0] text-white mb-4 shadow-[2px_2px_0px_0px_#121212]">Welcome Back</span>
            <h1 className="font-black text-4xl uppercase tracking-tighter text-[#121212]">Sign In</h1>
            <p className="font-medium text-[#121212]/60 mt-2">Access your hashtag strategy dashboard.</p>
          </div>

          <Suspense>
            <LoginForm />
          </Suspense>

          <p className="mt-6 text-sm font-medium text-[#121212]/60 text-center">
            No account yet?{' '}
            <Link href="/auth/signup" className="font-black text-[#D02020] hover:underline">Create one free</Link>
          </p>
        </div>
      </div>
    </main>
  );
}

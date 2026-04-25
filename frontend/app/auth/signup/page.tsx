'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import type { Metadata } from 'next';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const supabase = createClient();
    if (!supabase) { setError('Auth not configured.'); setLoading(false); return; }
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: `${window.location.origin}/onboarding`,
      },
    });
    if (error) {
      setError(error.message);
    } else {
      setDone(true);
    }
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#F0F0F0] flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#121212] border-r-4 border-[#121212] flex-col items-center justify-center p-16 relative overflow-hidden dot-grid-white">
        <div className="absolute top-10 right-10 w-32 h-32 rounded-full border-4 border-white opacity-10" />
        <div className="absolute bottom-10 left-10 w-24 h-24 border-4 border-white opacity-10 rotate-45" />
        <Image src="/logo.png" alt="HashtagItNow" width={280} height={80} className="w-64 h-auto object-contain mb-8 brightness-0 invert" />
        <p className="text-white/60 font-medium text-lg text-center leading-relaxed max-w-sm">
          AI-powered hashtag strategy for Instagram, YouTube, TikTok & more.
        </p>
        <div className="flex gap-3 mt-8">
          {['#D02020', '#1040C0', '#F0C020'].map((c) => (
            <div key={c} className="w-3 h-3 rounded-full border-2 border-white/30" style={{ backgroundColor: c }} />
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <Image src="/logo.png" alt="HashtagItNow" width={200} height={56} className="h-12 w-auto object-contain" />
          </div>

          {done ? (
            <div className="bg-[#1040C0] border-4 border-[#121212] shadow-[8px_8px_0px_0px_#121212] p-8 text-center">
              <p className="font-black text-2xl uppercase tracking-tight text-white mb-3">Check Your Email</p>
              <p className="text-white/80 font-medium">We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account.</p>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <span className="inline-block text-xs font-black uppercase tracking-widest px-3 py-1 border-2 border-[#121212] bg-[#D02020] text-white mb-4 shadow-[2px_2px_0px_0px_#121212]">Create Account</span>
                <h1 className="font-black text-4xl uppercase tracking-tighter text-[#121212]">Get Started</h1>
                <p className="font-medium text-[#121212]/60 mt-2">Create your free account. Cancel anytime.</p>
              </div>

              <form onSubmit={handleSignup} className="space-y-4">
                {[
                  { label: 'Full Name', value: name, setter: setName, type: 'text', placeholder: 'Your name' },
                  { label: 'Email Address', value: email, setter: setEmail, type: 'email', placeholder: 'you@example.com' },
                  { label: 'Password', value: password, setter: setPassword, type: 'password', placeholder: 'Min 8 characters' },
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
                  className="w-full bg-[#D02020] text-white border-2 border-[#121212] shadow-[4px_4px_0px_0px_#121212] px-6 py-4 font-black uppercase tracking-widest text-sm hover:bg-[#D02020]/90 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all disabled:opacity-50"
                >
                  {loading ? 'Creating Account...' : 'Create Account →'}
                </button>
              </form>

              <p className="mt-6 text-sm font-medium text-[#121212]/60 text-center">
                Already have an account?{' '}
                <Link href="/auth/login" className="font-black text-[#1040C0] hover:underline">Sign In</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

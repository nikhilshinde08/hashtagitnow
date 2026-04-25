'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';

function GoogleButton() {
  const [loading, setLoading] = useState(false);

  async function handleGoogle() {
    setLoading(true);
    const supabase = createClient();
    if (!supabase) return;
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/analyze`,
      },
    });
  }

  return (
    <button
      type="button"
      onClick={handleGoogle}
      disabled={loading}
      className="w-full flex items-center justify-center gap-3 bg-white border-2 border-[#121212] shadow-[4px_4px_0px_0px_#121212] px-6 py-3 font-black uppercase tracking-widest text-sm text-[#121212] hover:bg-[#F0F0F0] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all disabled:opacity-50"
    >
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
        <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
        <path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
        <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 6.293C4.672 4.166 6.656 3.58 9 3.58z" fill="#EA4335"/>
      </svg>
      {loading ? 'Redirecting...' : 'Continue with Google'}
    </button>
  );
}

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

              <div className="mb-4">
                <GoogleButton />
                <div className="flex items-center gap-3 mt-4">
                  <div className="flex-1 h-[2px] bg-[#121212]/20" />
                  <span className="text-xs font-black uppercase tracking-widest text-[#121212]/40">or</span>
                  <div className="flex-1 h-[2px] bg-[#121212]/20" />
                </div>
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

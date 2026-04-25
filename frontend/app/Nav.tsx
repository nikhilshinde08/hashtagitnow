'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    if (!supabase) return;
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  }

  const linkClass = (href: string) =>
    `text-sm font-bold tracking-widest uppercase px-4 py-2 border-2 border-[#121212] transition-all duration-200 ${
      pathname === href
        ? 'bg-[#121212] text-white shadow-[3px_3px_0px_0px_#D02020]'
        : 'bg-transparent text-[#121212] hover:bg-[#121212] hover:text-white shadow-[3px_3px_0px_0px_#121212] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none'
    }`;

  const isHidden = pathname.startsWith('/auth/');

  return (
    <nav className="bg-[#F0F0F0] border-b-4 border-[#121212] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-32">

          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <Image src="/logo.png" alt="HashtagItNow" width={480} height={120} className="h-28 w-auto object-contain" priority />
          </Link>

          {!isHidden && (
            <>
              {/* Desktop Links */}
              <div className="hidden md:flex items-center gap-3">
                <Link href="/analyze" className={linkClass('/analyze')}>Analyse</Link>
                <Link href="/compare" className={linkClass('/compare')}>Compare</Link>
                <Link href="/trending" className={linkClass('/trending')}>Trending</Link>
                {user ? (
                  <button
                    onClick={handleSignOut}
                    className="text-sm font-bold tracking-widest uppercase px-4 py-2 border-2 border-[#121212] bg-[#D02020] text-white shadow-[3px_3px_0px_0px_#121212] hover:bg-[#D02020]/90 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                  >
                    Sign Out
                  </button>
                ) : (
                  <>
                    <Link href="/auth/login" className={linkClass('/auth/login')}>Login</Link>
                    <Link
                      href="/auth/signup"
                      className="text-sm font-bold tracking-widest uppercase px-4 py-2 border-2 border-[#121212] bg-[#D02020] text-white shadow-[3px_3px_0px_0px_#121212] hover:bg-[#D02020]/90 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                    >
                      Start Free →
                    </Link>
                  </>
                )}
              </div>

              {/* Mobile Hamburger */}
              <button
                className="md:hidden flex flex-col gap-1.5 p-2 border-2 border-[#121212] bg-[#F0F0F0] shadow-[3px_3px_0px_0px_#121212] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                onClick={() => setOpen(!open)}
                aria-label="Toggle menu"
              >
                <span className={`block w-5 h-0.5 bg-[#121212] transition-all duration-200 ${open ? 'rotate-45 translate-y-2' : ''}`} />
                <span className={`block w-5 h-0.5 bg-[#121212] transition-all duration-200 ${open ? 'opacity-0' : ''}`} />
                <span className={`block w-5 h-0.5 bg-[#121212] transition-all duration-200 ${open ? '-rotate-45 -translate-y-2' : ''}`} />
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        {open && !isHidden && (
          <div className="md:hidden border-t-4 border-[#121212] py-4 flex flex-col gap-3">
            <Link href="/analyze" className={linkClass('/analyze')} onClick={() => setOpen(false)}>Analyse</Link>
            <Link href="/compare" className={linkClass('/compare')} onClick={() => setOpen(false)}>Compare</Link>
            <Link href="/trending" className={linkClass('/trending')} onClick={() => setOpen(false)}>Trending</Link>
            {user ? (
              <button onClick={handleSignOut} className="text-sm font-bold tracking-widest uppercase px-4 py-2 border-2 border-[#121212] bg-[#D02020] text-white text-left">Sign Out</button>
            ) : (
              <>
                <Link href="/auth/login" className={linkClass('/auth/login')} onClick={() => setOpen(false)}>Login</Link>
                <Link href="/auth/signup" className="text-sm font-bold tracking-widest uppercase px-4 py-2 border-2 border-[#121212] bg-[#D02020] text-white" onClick={() => setOpen(false)}>Start Free →</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

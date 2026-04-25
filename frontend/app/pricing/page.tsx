'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: '₹0',
    period: 'forever',
    priceId: '',
    color: 'bg-[#F0F0F0]',
    headerColor: 'bg-[#121212] text-white',
    btnColor: 'bg-[#121212] text-white',
    shadow: 'shadow-[6px_6px_0px_0px_#121212]',
    features: [
      'Unlimited hashtag analyses',
      'Hashtag audit + strategy',
      'Hindi / Hinglish support',
      'AI niche detection',
    ],
    locked: [
      'Post comparison (locked)',
      'Live trending hashtags (locked)',
    ],
    popular: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '₹999',
    period: '/month',
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID ?? '',
    color: 'bg-[#1040C0]',
    headerColor: 'bg-[#F0C020] text-[#121212]',
    btnColor: 'bg-[#F0C020] text-[#121212]',
    shadow: 'shadow-[8px_8px_0px_0px_#F0C020]',
    features: [
      'Everything in Free',
      'Compare up to 10 posts',
      'Live trend intelligence',
      'Instagram account connect',
      'Priority support',
      'Early access to new features',
    ],
    locked: [],
    popular: true,
  },
];

export default function PricingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState('');

  async function handleCheckout(priceId: string, planId: string) {
    setLoading(planId);
    setError('');

    const supabase = createClient();
    const user = supabase ? (await supabase.auth.getUser()).data.user : null;

    if (!user) {
      router.push('/auth/signup');
      return;
    }

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, userId: user.id, email: user.email }),
      });
      const { url, error: err } = await res.json();
      if (err) throw new Error(err);
      window.location.href = url;
    } catch (e) {
      setError((e as Error).message);
      setLoading(null);
    }
  }

  return (
    <main>
      {/* Hero */}
      <section className="bg-[#F0F0F0] border-b-4 border-[#121212] p-8 lg:p-16 text-center">
        <span className="inline-block text-xs font-black uppercase tracking-widest px-3 py-1 border-2 border-[#121212] bg-[#D02020] text-white mb-6 shadow-[2px_2px_0px_0px_#121212]">
          Simple Pricing
        </span>
        <h1 className="font-black uppercase leading-[0.9] tracking-tighter text-[#121212] text-5xl lg:text-7xl mb-6">
          CHOOSE YOUR<br /><span className="text-[#D02020]">PLAN</span>
        </h1>
        <p className="font-medium text-xl text-[#121212]/70 max-w-lg mx-auto">
          Cancel anytime. No hidden fees.
        </p>
      </section>

      {/* Plans */}
      <section className="bg-[#F0F0F0] p-8 lg:p-16">
        <div className="max-w-4xl mx-auto">
          {error && (
            <div className="bg-[#D02020] border-2 border-[#121212] shadow-[4px_4px_0px_0px_#121212] p-4 mb-8 text-white font-bold text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PLANS.map((plan) => (
              <div key={plan.id} className={`${plan.color} border-4 border-[#121212] ${plan.shadow} flex flex-col relative`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#D02020] text-white text-xs font-black uppercase tracking-widest px-4 py-1 border-2 border-[#121212]">
                    Most Popular
                  </div>
                )}
                <div className={`${plan.headerColor} border-b-4 border-[#121212] px-6 py-5`}>
                  <p className="font-black text-xs uppercase tracking-widest mb-1">{plan.name}</p>
                  <div className="flex items-end gap-1">
                    <span className="font-black text-4xl">{plan.price}</span>
                    <span className="font-bold text-sm mb-1 opacity-70">{plan.period}</span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col gap-6">
                  <ul className="space-y-3">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-3">
                        <span className={`flex-shrink-0 w-5 h-5 border-2 border-[#121212] flex items-center justify-center font-black text-xs mt-0.5 ${plan.id === 'pro' ? 'bg-[#F0C020] text-[#121212]' : 'bg-[#121212] text-white'}`}>✓</span>
                        <span className={`font-medium text-sm ${plan.id === 'pro' ? 'text-white' : 'text-[#121212]'}`}>{f}</span>
                      </li>
                    ))}
                    {plan.locked.map((f) => (
                      <li key={f} className="flex items-start gap-3 opacity-40">
                        <span className="flex-shrink-0 w-5 h-5 border-2 border-[#121212] flex items-center justify-center font-black text-xs mt-0.5 bg-[#E0E0E0] text-[#121212]">✕</span>
                        <span className="font-medium text-sm text-[#121212]">{f}</span>
                      </li>
                    ))}
                  </ul>

                  {plan.id === 'free' ? (
                    <a
                      href="/analyze"
                      className={`${plan.btnColor} border-2 border-[#121212] shadow-[3px_3px_0px_0px_#121212] px-6 py-4 font-black uppercase tracking-widest text-sm hover:opacity-90 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all mt-auto text-center`}
                    >
                      Start Free →
                    </a>
                  ) : (
                    <button
                      onClick={() => handleCheckout(plan.priceId, plan.id)}
                      disabled={loading === plan.id}
                      className={`${plan.btnColor} border-2 border-[#121212] shadow-[3px_3px_0px_0px_#121212] px-6 py-4 font-black uppercase tracking-widest text-sm hover:opacity-90 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all disabled:opacity-50 mt-auto`}
                    >
                      {loading === plan.id ? 'Redirecting...' : 'Get Pro →'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-xs font-medium text-[#121212]/50 mt-8 uppercase tracking-widest">
            Payments secured by Stripe · Cancel any time from your dashboard
          </p>
        </div>
      </section>
    </main>
  );
}

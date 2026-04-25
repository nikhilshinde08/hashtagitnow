import Link from 'next/link';

export default function SuccessPage() {
  return (
    <main className="min-h-[60vh] flex items-center justify-center p-8">
      <div className="max-w-lg w-full text-center">
        <div className="bg-[#1040C0] border-4 border-[#121212] shadow-[8px_8px_0px_0px_#F0C020] p-10 relative">
          <div className="absolute top-0 right-0 w-10 h-10 bg-[#F0C020] border-l-4 border-b-4 border-[#121212]" />
          <div className="w-16 h-16 rounded-full bg-[#F0C020] border-4 border-[#121212] flex items-center justify-center mx-auto mb-6 shadow-[4px_4px_0px_0px_#121212]">
            <span className="font-black text-2xl text-[#121212]">✓</span>
          </div>
          <p className="font-black text-3xl uppercase tracking-tighter text-white mb-3">You&apos;re In!</p>
          <p className="text-white/70 font-medium leading-relaxed mb-8">
            Your Pro subscription is active. Start analysing your content and growing your reach.
          </p>
          <Link
            href="/analyze"
            className="inline-block bg-[#F0C020] text-[#121212] border-2 border-[#121212] shadow-[4px_4px_0px_0px_#121212] px-8 py-4 font-black uppercase tracking-widest text-sm hover:opacity-90 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
          >
            Start Analysing →
          </Link>
        </div>
      </div>
    </main>
  );
}

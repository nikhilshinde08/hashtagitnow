import Link from 'next/link';

function GeoDot({ color }: { color: string }) {
  return <div className={`w-3 h-3 rounded-full ${color} border-2 border-[#121212]`} />;
}

export default function LandingPage() {
  return (
    <main>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="border-b-4 border-[#121212] grid grid-cols-1 lg:grid-cols-5 min-h-[600px]">
        {/* Left */}
        <div className="lg:col-span-3 bg-[#F0F0F0] p-8 lg:p-16 flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 mb-8 w-fit">
            <GeoDot color="bg-[#D02020]" />
            <GeoDot color="bg-[#1040C0]" />
            <div className="w-3 h-3 bg-[#F0C020] border-0" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
            <span className="text-xs font-black uppercase tracking-widest text-[#121212] ml-1 border-2 border-[#121212] px-3 py-1 shadow-[2px_2px_0px_0px_#121212]">
              AI-Powered
            </span>
          </div>

          <h1 className="font-black uppercase leading-[0.88] tracking-tighter mb-6">
            <span className="block text-4xl sm:text-5xl lg:text-6xl xl:text-[72px] text-[#121212]">GET YOUR NEXT</span>
            <span className="block text-4xl sm:text-5xl lg:text-6xl xl:text-[72px] text-[#D02020]">VIRAL POST</span>
            <span className="block text-4xl sm:text-5xl lg:text-6xl xl:text-[72px] text-[#121212]">IN 10 SECONDS</span>
          </h1>

          <p className="font-medium text-lg text-[#121212]/60 uppercase tracking-widest mb-2 text-sm">
            Free AI Hashtag Generator for Instagram, YouTube &amp; TikTok
          </p>

          <p className="font-medium text-xl text-[#121212] leading-relaxed max-w-lg mb-6">
            Hooks. Captions. Hashtags — using live trending data. Built for Indian creators. Supports Hindi &amp; Hinglish.
          </p>
          <div className="flex flex-wrap gap-2 mb-8">
            <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest px-3 py-1.5 border-2 border-[#121212] bg-white shadow-[2px_2px_0px_0px_#121212]">
              <span className="w-2 h-2 rounded-full bg-[#D02020]" /> Instagram
            </span>
            {[
              { label: 'YouTube', dot: 'bg-[#D02020]' },
              { label: 'Facebook', dot: 'bg-[#1040C0]' },
              { label: 'TikTok', dot: 'bg-[#121212]' },
              { label: 'Snapchat', dot: 'bg-[#F0C020]' },
              { label: 'X / Twitter', dot: 'bg-[#121212]' },
            ].map((p) => (
              <span key={p.label} className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest px-3 py-1.5 border-2 border-[#121212] bg-[#F0F0F0] opacity-60">
                <span className={`w-2 h-2 rounded-full ${p.dot} border border-[#121212]`} /> {p.label}
                <span className="text-[8px] font-black tracking-widest text-[#D02020] border border-[#D02020] px-1">SOON</span>
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/generate"
              className="bg-[#D02020] text-white border-2 border-[#121212] shadow-[4px_4px_0px_0px_#121212] px-8 py-4 font-black uppercase tracking-widest text-sm hover:bg-[#D02020]/90 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
            >
              Generate Hooks Free →
            </Link>
            <Link
              href="/analyze"
              className="bg-[#F0F0F0] text-[#121212] border-2 border-[#121212] shadow-[4px_4px_0px_0px_#121212] px-8 py-4 font-black uppercase tracking-widest text-sm hover:bg-[#E0E0E0] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
            >
              Analyse a Post →
            </Link>
          </div>
        </div>

        {/* Right — Blue geometric panel */}
        <div className="lg:col-span-2 bg-[#1040C0] border-t-4 lg:border-t-0 lg:border-l-4 border-[#121212] relative overflow-hidden flex items-center justify-center min-h-[300px] dot-grid-white">
          <div className="absolute top-[-40px] right-[-40px] w-48 h-48 rounded-full border-4 border-white opacity-10" />
          <div className="absolute bottom-[-30px] left-[-30px] w-40 h-40 border-4 border-white opacity-10 rotate-45" />
          <div className="relative grid grid-cols-2 gap-4 p-8">
            {[
              { label: 'ANALYSE', icon: '#', bg: 'bg-white', text: 'text-[#1040C0]', shadow: 'shadow-[6px_6px_0px_0px_#F0C020]' },
              { label: 'COMPARE', icon: '≡', bg: 'bg-[#F0C020]', text: 'text-[#121212]', shadow: 'shadow-[6px_6px_0px_0px_white]' },
              { label: 'TRENDING', icon: '↑', bg: 'bg-[#D02020]', text: 'text-white', shadow: 'shadow-[6px_6px_0px_0px_white]' },
              { label: 'STRATEGY', icon: '★', bg: 'bg-[#121212]', text: 'text-[#F0C020]', shadow: 'shadow-[6px_6px_0px_0px_#F0C020]' },
            ].map((card) => (
              <div key={card.label} className={`${card.bg} ${card.shadow} border-2 border-white p-4 flex flex-col items-center gap-2`}>
                <span className={`font-black text-3xl ${card.text}`}>{card.icon}</span>
                <span className={`font-black text-xs uppercase tracking-widest ${card.text}`}>{card.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT YOU CAN ANALYSE ─────────────────────────────── */}
      <section className="bg-[#F0C020] border-b-4 border-[#121212] p-8 lg:p-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
            <div>
              <span className="inline-block text-xs font-black uppercase tracking-widest px-3 py-1 border-2 border-[#121212] bg-[#121212] text-white mb-4">Input Sources</span>
              <h2 className="font-black uppercase leading-[0.9] tracking-tighter text-[#121212]">
                <span className="block text-4xl lg:text-6xl">ANALYSE</span>
                <span className="block text-4xl lg:text-6xl">ANYTHING</span>
              </h2>
            </div>
            <p className="font-medium text-lg text-[#121212] max-w-md leading-relaxed">
              No account needed to start. Paste a URL or type a caption — the AI does the rest.
            </p>
          </div>

          {/* Live now */}
          <p className="text-xs font-black uppercase tracking-widest text-[#121212] mb-3">Live Now</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border-2 border-[#121212] shadow-[8px_8px_0px_0px_#121212] mb-6">
            {[
              { icon: '▶', title: 'Instagram Reels', desc: 'Paste any public Reel URL. Get engagement metrics and a full hashtag audit.', color: 'bg-white', iconBg: 'bg-[#D02020] text-white' },
              { icon: '□', title: 'Posts & Carousels', desc: 'Single images and multi-slide carousels with caption and hashtag analysis.', color: 'bg-[#F0F0F0]', iconBg: 'bg-[#1040C0] text-white' },
              { icon: 'T', title: 'Plain Caption', desc: 'No URL needed. Paste your draft caption and get a strategy before you post.', color: 'bg-white', iconBg: 'bg-[#F0C020] text-[#121212]' },
              { icon: '◎', title: 'Instagram Account', desc: 'Connect your Business account via OAuth for strategy from your own post history.', color: 'bg-[#F0F0F0]', iconBg: 'bg-[#121212] text-white' },
            ].map((item, i) => (
              <div key={item.title} className={`${item.color} border-r-0 ${i < 3 ? 'sm:border-r-2' : ''} border-b-2 sm:border-b-0 border-[#121212] p-6 flex flex-col gap-4`}>
                <div className={`w-12 h-12 ${item.iconBg} border-2 border-[#121212] flex items-center justify-center font-black text-xl shadow-[3px_3px_0px_0px_#121212]`}>
                  {item.icon}
                </div>
                <div>
                  <p className="font-black text-base uppercase tracking-wide text-[#121212] mb-2">{item.title}</p>
                  <p className="font-medium text-sm text-[#121212]/70 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Coming soon platforms */}
          <p className="text-xs font-black uppercase tracking-widest text-[#121212] mb-3">Coming Soon</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-0 border-2 border-[#121212] border-dashed opacity-70">
            {[
              { icon: '▷', platform: 'YouTube', title: 'YouTube Videos & Shorts', desc: 'Analyse tags, titles, and descriptions. Get recommendations to rank in search and suggested feeds.', iconBg: 'bg-[#D02020] text-white' },
              { icon: 'f', platform: 'Facebook', title: 'Facebook Posts & Reels', desc: 'Connect your Page to analyse performance and get strategies tailored to Facebook\'s algorithm.', iconBg: 'bg-[#1040C0] text-white' },
              { icon: '♪', platform: 'TikTok', title: 'TikTok Videos', desc: 'Analyse sounds, hashtags, and captions on TikTok. Find what\'s trending in your niche right now.', iconBg: 'bg-[#121212] text-white' },
              { icon: '👻', platform: 'Snapchat', title: 'Snapchat Content', desc: 'Strategy for Snapchat Spotlight and Stories. Reach younger audiences with the right content signals.', iconBg: 'bg-[#F0C020] text-[#121212]' },
              { icon: 'X', platform: 'X / Twitter', title: 'X (Twitter) Posts', desc: 'Analyse hashtags and keywords on X. Find trending topics and optimise your posts for maximum reach.', iconBg: 'bg-[#121212] text-white' },
            ].map((item, i) => (
              <div key={item.platform} className={`bg-[#F0F0F0] ${i < 4 ? 'border-b-2 lg:border-b-0 lg:border-r-2' : ''} border-[#121212] p-6 flex flex-col gap-4 relative`}>
                <div className="absolute top-3 right-3 bg-[#D02020] text-white text-[10px] font-black uppercase tracking-widest px-2 py-0.5">
                  Soon
                </div>
                <div className={`w-12 h-12 ${item.iconBg} border-2 border-[#121212] flex items-center justify-center font-black text-xl`}>
                  {item.icon}
                </div>
                <div>
                  <p className="font-black text-sm uppercase tracking-wide text-[#121212] mb-2">{item.title}</p>
                  <p className="font-medium text-sm text-[#121212]/70 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <section className="bg-[#121212] border-b-4 border-[#121212] p-8 lg:p-16">
        <div className="max-w-7xl mx-auto">
          <span className="inline-block text-xs font-black uppercase tracking-widest px-3 py-1 border-2 border-[#F0C020] text-[#F0C020] mb-8">How It Works</span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-2 border-[#333]">
            {[
              {
                step: '01',
                title: 'Input Your Content',
                desc: 'Paste an Instagram URL or your caption text. Optionally describe your niche in any language — Hindi, Hinglish, or English.',
                accent: '#D02020',
                details: ['Reel / Post / Carousel URL', 'Raw caption text', 'Niche description (optional)'],
              },
              {
                step: '02',
                title: 'AI Analyses Everything',
                desc: 'Claude detects your niche, audits every hashtag for relevance and reach, pulls real trending data from Instagram, and compares against top performers.',
                accent: '#F0C020',
                details: ['Niche auto-detection', 'Hashtag relevance audit', 'Live Apify data scrape'],
              },
              {
                step: '03',
                title: 'Get Your Strategy',
                desc: 'Receive a tiered hashtag set (high reach / niche / low competition), issues to fix, and a plain-English strategy verdict tailored to your account size.',
                accent: '#1040C0',
                details: ['20–30 recommended tags', 'Issues + fixes', 'Strategy explanation'],
              },
            ].map((item, i) => (
              <div key={item.step} className={`border-b-2 md:border-b-0 ${i < 2 ? 'md:border-r-2' : ''} border-[#333] p-8`}>
                <div
                  className="w-14 h-14 border-4 border-white flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]"
                  style={{ backgroundColor: item.accent }}
                >
                  <span className="font-black text-lg text-white">{item.step}</span>
                </div>
                <p className="font-black text-xl uppercase tracking-tight text-white mb-3">{item.title}</p>
                <p className="font-medium text-sm text-white/60 leading-relaxed mb-5">{item.desc}</p>
                <ul className="space-y-2">
                  {item.details.map((d) => (
                    <li key={d} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.accent }} />
                      <span className="text-xs font-bold uppercase tracking-wider text-white/50">{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── THREE TOOLS ──────────────────────────────────────── */}
      <section className="bg-[#F0F0F0] border-b-4 border-[#121212] p-8 lg:p-16">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <span className="inline-block text-xs font-black uppercase tracking-widest px-3 py-1 border-2 border-[#121212] bg-[#121212] text-white mb-4">Three Tools. One Platform.</span>
            <h2 className="font-black uppercase leading-[0.9] tracking-tighter text-[#121212] text-4xl lg:text-6xl">
              EVERYTHING YOUR<br />CONTENT NEEDS
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                href: '/analyze',
                label: 'Analyse',
                headline: 'HASHTAG AUDIT + STRATEGY',
                desc: 'Deep-dive audit of any Instagram post. Finds what hashtags are working, what\'s dead weight, and builds a custom 25-tag strategy for your niche and account size.',
                cta: 'Start Analysing',
                bg: 'bg-[#D02020]',
                shadow: 'shadow-[8px_8px_0px_0px_#121212]',
                textColor: 'text-white',
                btnBg: 'bg-white text-[#D02020]',
                corner: 'bg-[#F0C020]',
              },
              {
                href: '/compare',
                label: 'Compare',
                headline: 'POST PERFORMANCE COMPARISON',
                desc: 'Compare 2–10 Instagram posts side by side. Discover which hashtag combos drive the most views, and get per-post recommendations to fix underperformers.',
                cta: 'Compare Posts',
                bg: 'bg-[#1040C0]',
                shadow: 'shadow-[8px_8px_0px_0px_#121212]',
                textColor: 'text-white',
                btnBg: 'bg-white text-[#1040C0]',
                corner: 'bg-[#D02020]',
              },
              {
                href: '/trending',
                label: 'Trending',
                headline: 'LIVE TREND INTELLIGENCE',
                desc: 'Real-time hashtag trends pulled from Instagram\'s live feed. AI classifies what\'s rising, what\'s in the sweet spot, and what\'s already saturated — for your exact niche.',
                cta: 'See Trends',
                bg: 'bg-[#F0C020]',
                shadow: 'shadow-[8px_8px_0px_0px_#121212]',
                textColor: 'text-[#121212]',
                btnBg: 'bg-[#121212] text-white',
                corner: 'bg-[#1040C0]',
              },
            ].map((tool) => (
              <div key={tool.label} className={`${tool.bg} ${tool.shadow} border-2 border-[#121212] p-6 lg:p-8 flex flex-col relative`}>
                <div className={`absolute top-0 right-0 w-8 h-8 ${tool.corner} border-l-2 border-b-2 border-[#121212]`} />
                <span className={`inline-block text-xs font-black uppercase tracking-widest px-2 py-1 border-2 border-current ${tool.textColor} mb-4 w-fit`}>
                  {tool.label}
                </span>
                <p className={`font-black text-lg uppercase tracking-tight ${tool.textColor} mb-3 leading-tight`}>{tool.headline}</p>
                <p className={`font-medium text-sm leading-relaxed mb-8 flex-1 ${tool.textColor} opacity-80`}>{tool.desc}</p>
                <Link
                  href={tool.href}
                  className={`${tool.btnBg} border-2 border-[#121212] shadow-[3px_3px_0px_0px_#121212] px-5 py-3 font-black uppercase tracking-widest text-xs hover:opacity-90 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all w-fit`}
                >
                  {tool.cta} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRENDING + GUIDES STRIP ──────────────────────────── */}
      <section className="bg-[#F0C020] border-b-4 border-[#121212] p-8 lg:p-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Trending */}
          <Link
            href="/trending"
            className="group bg-[#121212] border-2 border-[#121212] shadow-[6px_6px_0px_0px_#D02020] p-8 flex items-center justify-between hover:shadow-[8px_8px_0px_0px_#D02020] transition-all"
          >
            <div>
              <span className="inline-block text-xs font-black uppercase tracking-widest px-2 py-1 border-2 border-[#D02020] text-[#D02020] mb-3">Live Now</span>
              <p className="font-black text-2xl uppercase tracking-tighter text-white leading-tight">
                See What&apos;s<br />
                <span className="text-[#F0C020]">Trending</span>
              </p>
              <p className="text-white/50 font-medium text-sm mt-2">Real-time hashtags for your niche →</p>
            </div>
            <span className="font-black text-5xl text-[#D02020] group-hover:translate-x-2 transition-transform">↑</span>
          </Link>

          {/* Hashtag Guides */}
          <Link
            href="/hashtags"
            className="group bg-white border-2 border-[#121212] shadow-[6px_6px_0px_0px_#121212] p-8 flex items-center justify-between hover:shadow-[8px_8px_0px_0px_#121212] transition-all"
          >
            <div>
              <span className="inline-block text-xs font-black uppercase tracking-widest px-2 py-1 border-2 border-[#121212] text-[#121212] mb-3">35 Free Guides</span>
              <p className="font-black text-2xl uppercase tracking-tighter text-[#121212] leading-tight">
                Hashtag Guides<br />
                <span className="text-[#1040C0]">By Niche</span>
              </p>
              <p className="text-[#121212]/50 font-medium text-sm mt-2">Fitness, food, travel, Hindi creators →</p>
            </div>
            <span className="font-black text-5xl text-[#1040C0] group-hover:translate-x-2 transition-transform">#</span>
          </Link>

        </div>
      </section>

      {/* ── AI CAPABILITIES ──────────────────────────────────── */}
      <section className="bg-[#D02020] border-b-4 border-[#121212] p-8 lg:p-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block text-xs font-black uppercase tracking-widest px-3 py-1 border-2 border-white text-white mb-6">AI-Powered</span>
              <h2 className="font-black uppercase leading-[0.9] tracking-tighter text-white text-4xl lg:text-6xl mb-6">
                UNDERSTANDS<br />YOUR NICHE
              </h2>
              <p className="font-medium text-lg text-white/80 leading-relaxed max-w-lg">
                Describe your content in any language. The AI understands Hindi, Hinglish, English, and mixed-language niches — and generates strategies that match your exact audience.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Hindi', example: 'फिटनेस और योग', color: 'bg-white text-[#D02020]' },
                { label: 'Hinglish', example: 'gym aur workout tips', color: 'bg-[#F0C020] text-[#121212]' },
                { label: 'English', example: 'travel photography', color: 'bg-[#121212] text-white' },
                { label: 'Mixed', example: 'comedy और entertainment', color: 'bg-[#1040C0] text-white' },
              ].map((lang) => (
                <div key={lang.label} className={`${lang.color} border-2 border-[#121212] shadow-[4px_4px_0px_0px_#121212] p-4`}>
                  <p className="font-black text-xs uppercase tracking-widest mb-2 opacity-60">{lang.label}</p>
                  <p className="font-bold text-sm">&quot;{lang.example}&quot;</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTENT STRATEGY SECTION ─────────────────────────── */}
      <section className="bg-[#F0F0F0] border-b-4 border-[#121212] p-8 lg:p-16">
        <div className="max-w-7xl mx-auto">
          <span className="inline-block text-xs font-black uppercase tracking-widest px-3 py-1 border-2 border-[#121212] bg-[#121212] text-white mb-8">What You Get</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 border-2 border-[#121212] shadow-[8px_8px_0px_0px_#121212]">
            {[
              { num: '01', title: 'Hashtag Audit', desc: 'Every hashtag you\'re using is rated: effective, too generic, irrelevant, or missing.', accent: 'bg-[#D02020]' },
              { num: '02', title: 'Tiered Recommendations', desc: '20–30 tags split into high reach, niche targeting, and low competition tiers.', accent: 'bg-[#1040C0]' },
              { num: '03', title: 'Trend Intelligence', desc: 'Real hashtags from Instagram\'s live feed — what\'s rising, sweet spot, and saturated.', accent: 'bg-[#F0C020]' },
              { num: '04', title: 'Niche Detection', desc: 'AI reads your content and identifies your exact niche — no manual tagging needed.', accent: 'bg-[#121212]' },
              { num: '05', title: 'Competitor Analysis', desc: 'Compare up to 10 posts to find which hashtag patterns drive the most views.', accent: 'bg-[#D02020]' },
              { num: '06', title: 'Strategy Verdict', desc: 'A plain-English summary explaining exactly what to fix and why it will grow your reach.', accent: 'bg-[#1040C0]' },
            ].map((item, i) => (
              <div key={item.num} className={`bg-white border-r-0 border-b-2 lg:border-b-0 ${i % 3 < 2 ? 'lg:border-r-2' : ''} ${i % 2 === 0 ? 'sm:border-r-2' : ''} border-[#121212] p-6 flex gap-4`}>
                <div className={`flex-shrink-0 w-8 h-8 ${item.accent} border-2 border-[#121212] flex items-center justify-center shadow-[2px_2px_0px_0px_#121212]`}>
                  <span className="font-black text-xs text-white">{item.num}</span>
                </div>
                <div>
                  <p className="font-black text-sm uppercase tracking-wide text-[#121212] mb-1">{item.title}</p>
                  <p className="font-medium text-xs text-[#121212]/60 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMING SOON ─────────────────────────────────────── */}
      <section className="bg-[#121212] border-b-4 border-[#121212] p-8 lg:p-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
            <div>
              <span className="inline-block text-xs font-black uppercase tracking-widest px-3 py-1 border-2 border-[#D02020] text-[#D02020] mb-4">On The Roadmap</span>
              <h2 className="font-black uppercase leading-[0.9] tracking-tighter text-white text-4xl lg:text-6xl">
                MORE<br /><span className="text-[#F0C020]">COMING SOON</span>
              </h2>
            </div>
            <p className="font-medium text-lg text-white/50 max-w-md leading-relaxed">
              We're building the most complete content strategy platform for creators. Here's what's next.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                icon: '◎',
                title: 'Connect Your Instagram',
                desc: 'Link your Business or Creator account. Get personalised hashtag strategy built from your actual post history and what\'s worked for you.',
                accent: '#D02020',
                tag: 'Account Intelligence',
              },
              {
                icon: '▷',
                title: 'YouTube Channel Analysis',
                desc: 'Connect your YouTube channel. Analyse tags, titles, and descriptions across your videos. Get recommendations to rank in search and suggested.',
                accent: '#D02020',
                tag: 'YouTube',
              },
              {
                icon: 'f',
                title: 'Facebook Page Strategy',
                desc: 'Connect your Facebook Page. Understand which post formats and hashtags drive reach on Facebook\'s algorithm in 2025.',
                accent: '#1040C0',
                tag: 'Facebook',
              },
              {
                icon: '📊',
                title: 'Cross-Platform Dashboard',
                desc: 'One view across Instagram, YouTube, and Facebook. See which content performs best on which platform and why.',
                accent: '#F0C020',
                tag: 'Multi-Platform',
              },
              {
                icon: '🤖',
                title: 'AI Caption Generator',
                desc: 'Beyond hashtags — generate full captions with built-in hashtag strategy for your niche, tone, and account size.',
                accent: '#D02020',
                tag: 'AI Writing',
              },
              {
                icon: '📅',
                title: 'Best Time to Post',
                desc: 'AI analyses your audience activity and tells you the exact days and times to post for maximum reach — per platform.',
                accent: '#1040C0',
                tag: 'Scheduling Intel',
              },
              {
                icon: '♪',
                title: 'TikTok Strategy',
                desc: 'Connect your TikTok account. Analyse sounds, hashtags, and video performance. Get a strategy for what\'s trending on For You pages right now.',
                accent: '#121212',
                tag: 'TikTok',
              },
              {
                icon: '👻',
                title: 'Snapchat Spotlight',
                desc: 'Analyse your Snapchat Spotlight and Stories performance. Get content and hashtag recommendations to grow on Snapchat\'s discovery feed.',
                accent: '#F0C020',
                tag: 'Snapchat',
              },
              {
                icon: 'X',
                title: 'X (Twitter) Strategy',
                desc: 'Connect your X account. Analyse hashtag and keyword performance, find trending topics, and get a posting strategy to grow your X presence.',
                accent: '#121212',
                tag: 'X / Twitter',
              },
            ].map((item) => (
              <div key={item.title} className="border-2 border-[#333] bg-[#1C1C1C] p-6 flex flex-col gap-4 relative group hover:-translate-y-1 transition-transform duration-200">
                <div className="flex items-start justify-between">
                  <div
                    className="w-11 h-11 border-2 border-[#333] flex items-center justify-center font-black text-lg"
                    style={{ backgroundColor: item.accent }}
                  >
                    <span className="text-white text-base">{item.icon}</span>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 border border-[#333] text-white/40">
                    {item.tag}
                  </span>
                </div>
                <div>
                  <p className="font-black text-sm uppercase tracking-wide text-white mb-2">{item.title}</p>
                  <p className="font-medium text-xs text-white/50 leading-relaxed">{item.desc}</p>
                </div>
                <div className="mt-auto pt-4 border-t border-[#333]">
                  <span className="text-xs font-black uppercase tracking-widest text-[#D02020]">Coming Soon</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EDUCATIONAL: WHAT IS A HASHTAG GENERATOR ────────── */}
      <section className="bg-white border-b-4 border-[#121212] p-8 lg:p-16">
        <div className="max-w-4xl mx-auto">
          <span className="inline-block text-xs font-black uppercase tracking-widest px-3 py-1 border-2 border-[#121212] bg-[#F0C020] text-[#121212] mb-6 shadow-[2px_2px_0px_0px_#121212]">Learn</span>
          <h2 className="font-black text-3xl lg:text-4xl uppercase tracking-tighter text-[#121212] mb-8">
            What is an AI Hashtag Generator?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="font-medium text-[#121212]/70 leading-relaxed mb-4">
                A <strong className="text-[#121212]">hashtag generator</strong> is a tool that suggests relevant hashtags for your social media posts. Unlike generic hashtag tools, an <strong className="text-[#121212]">AI hashtag generator</strong> understands your specific content, niche, and audience — then recommends hashtags that actually drive reach.
              </p>
              <p className="font-medium text-[#121212]/70 leading-relaxed mb-4">
                HashtagItNow goes further: it pulls <strong className="text-[#121212]">live trending data</strong> from Instagram before generating recommendations. So instead of recycled tag lists, you get hashtags that are performing right now — for your exact niche.
              </p>
              <p className="font-medium text-[#121212]/70 leading-relaxed">
                For <strong className="text-[#121212]">Indian creators</strong>, we support Hindi, Hinglish, and English input. Describe your niche in any language — our AI understands it all.
              </p>
            </div>
            <div className="space-y-4">
              {[
                { title: 'Instagram Hashtag Generator', desc: 'Get 5 perfectly targeted hashtags for any Instagram post, Reel or caption. Includes trending + niche + low-competition tiers.' },
                { title: 'YouTube Hashtag Generator', desc: 'Generate hashtags and hook ideas that improve YouTube search visibility and suggested video placement.' },
                { title: 'Hindi Hashtag Generator', desc: 'The only AI hashtag tool that understands Hinglish and Hindi niches. Built for Indian creators from day one.' },
                { title: 'Trending Hashtag Finder', desc: 'See what\'s rising, what\'s saturated, and what\'s in the sweet spot — for your specific niche, updated daily.' },
              ].map((item) => (
                <div key={item.title} className="border-2 border-[#121212] shadow-[3px_3px_0px_0px_#121212] p-4 bg-[#F0F0F0]">
                  <p className="font-black text-sm text-[#121212] mb-1">{item.title}</p>
                  <p className="text-xs font-medium text-[#121212]/60 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section className="bg-[#F0F0F0] border-b-4 border-[#121212] p-8 lg:p-16">
        <div className="max-w-4xl mx-auto">
          <span className="inline-block text-xs font-black uppercase tracking-widest px-3 py-1 border-2 border-[#121212] bg-[#121212] text-white mb-6 shadow-[2px_2px_0px_0px_#121212]">FAQ</span>
          <h2 className="font-black text-3xl lg:text-4xl uppercase tracking-tighter text-[#121212] mb-8">
            Hashtag Generator — Common Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: 'How many hashtags should I use on Instagram in 2026?',
                a: 'Instagram officially recommends 3–5 hashtags in 2026. Using 20–30 hashtags no longer increases reach and can suppress distribution. HashtagItNow recommends exactly 5 targeted hashtags — one broad, two niche, two low-competition.',
              },
              {
                q: 'Is this hashtag generator free?',
                a: 'Yes. You get 3 free AI generations per day — including hooks, captions, and hashtags. Free accounts also get full access to the hashtag analyser, post comparator, and trending hashtag finder.',
              },
              {
                q: 'Does this work for Hindi and Hinglish creators?',
                a: 'Yes — this is our biggest differentiator. You can describe your niche in Hindi, Hinglish, or English and the AI understands it perfectly. We specifically built for Indian creators who are underserved by Western tools.',
              },
              {
                q: 'What makes this better than other hashtag generators?',
                a: 'Three things: (1) Live trending data — we pull real Instagram hashtag frequency before generating, so recommendations reflect what\'s working now, not last year. (2) Indian niche support — Hindi and Hinglish understanding. (3) Full content strategy — not just hashtags, but hooks and captions too.',
              },
              {
                q: 'Can I use this for YouTube hashtags?',
                a: 'Yes. Select YouTube as your platform and the generator optimises for YouTube search visibility and suggested video placement. YouTube hashtags work differently from Instagram — our AI accounts for that.',
              },
              {
                q: 'What is the best hashtag generator for Instagram in India?',
                a: 'HashtagItNow is built specifically for Indian creators — it understands Hindi, Hinglish, regional niches, Bollywood references, and desi content culture. No other hashtag tool does this.',
              },
            ].map((faq, i) => (
              <div key={i} className="border-2 border-[#121212] shadow-[4px_4px_0px_0px_#121212] bg-white">
                <div className="border-b-2 border-[#121212] px-6 py-4">
                  <h3 className="font-black text-sm text-[#121212] uppercase tracking-tight">{faq.q}</h3>
                </div>
                <div className="px-6 py-4">
                  <p className="text-sm font-medium text-[#121212]/70 leading-relaxed">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────── */}
      <section className="bg-[#F0C020] p-8 lg:p-20 relative overflow-hidden">
        <div className="absolute top-[-60px] right-[-60px] w-64 h-64 rounded-full border-4 border-[#121212] opacity-10" />
        <div className="absolute bottom-[-40px] left-[-40px] w-48 h-48 border-4 border-[#121212] opacity-10 rotate-45" />
        <div className="max-w-7xl mx-auto relative flex flex-col lg:flex-row items-center justify-between gap-10">
          <div>
            <h2 className="font-black uppercase leading-[0.88] tracking-tighter text-[#121212] text-4xl sm:text-5xl lg:text-7xl">
              STOP GUESSING.<br />
              <span className="text-[#D02020]">START GROWING.</span>
            </h2>
            <p className="font-medium text-lg text-[#121212]/70 mt-4 max-w-md leading-relaxed">
              Every post deserves the right hashtags. Start with a URL or caption — no account needed.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0">
            <Link
              href="/analyze"
              className="bg-[#121212] text-white border-2 border-[#121212] shadow-[4px_4px_0px_0px_#D02020] px-10 py-5 font-black uppercase tracking-widest text-base hover:bg-[#121212]/90 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all text-center"
            >
              Analyse a Post →
            </Link>
            <Link
              href="/trending"
              className="bg-white text-[#121212] border-2 border-[#121212] shadow-[4px_4px_0px_0px_#121212] px-10 py-5 font-black uppercase tracking-widest text-base hover:bg-[#F0F0F0] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all text-center"
            >
              See Trends →
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}

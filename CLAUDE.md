# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repo structure

Monorepo with two independent apps sharing a Railway (backend) + Vercel (frontend) deployment:

```
/backend    — Express + TypeScript API (Railway)
/frontend   — Next.js 14 App Router (Vercel)
```

## Commands

### Backend (`/backend`)
```bash
npm run dev        # nodemon + ts-node (hot reload)
npm run build      # tsc → dist/
npm run typecheck  # tsc --noEmit (no emit, just type check)
npm start          # node dist/server.js (production)
```

### Frontend (`/frontend`)
```bash
npm run dev        # next dev
npm run build      # next build (also verifies all pages compile)
npm start          # next start
```

**Always run both `npm run typecheck` (backend) and `npm run build` (frontend) before committing.**

---

## Backend architecture

**Entry:** `src/server.ts` — Express app, CORS, rate limiter, route registration.

**Routes → Controllers → Services pattern:**

| Route | Controller | Purpose |
|-------|-----------|---------|
| `POST /analyze` | `analyze.controller` | Scrape Instagram post + AI hashtag audit |
| `POST /compare` | `compare.controller` | Compare multiple posts side-by-side |
| `POST /trending` | `trending.controller` | Live trending hashtags for a niche |
| `POST /generate` | `generate.controller` | Generate 10 hooks + captions + hashtags |

**Key services:**
- `apify.service.ts` — Instagram scraping via Apify actor (`apify~instagram-scraper`). Falls back to `data/fallback-hashtags.json` if token missing.
- `llm.service.ts` — All Claude calls via Azure AI Foundry SDK (`@anthropic-ai/foundry-sdk`). Single `callLLM()` helper. **LLM timeout is 20s** (`config.llm.timeoutMs`) — generate endpoint needs more tokens (4000) so timeout may need raising for that route.
- `supabase.service.ts` — User auth from JWT, trending cache (1hr TTL), event logging.

**Config:** `src/config/env.ts` loads `.env` then falls back to root `.env.local`. All env vars are optional with fallbacks except nothing hard-fails at startup — missing keys just disable features.

**Rate limiting:** 30 requests / 15 min per IP, global across all routes.

**CORS:** Reads `FRONTEND_URL` env var (set in Railway). Also allows any `*.vercel.app` subdomain and `http://localhost:3000`. Adding a new production domain = add it to Railway env vars, not hardcoded.

---

## Frontend architecture

**Framework:** Next.js 14 App Router. All pages in `app/`. No Pages Router.

**Auth:** Supabase SSR. `lib/supabase/client.ts` (browser) and `lib/supabase/server.ts` (server components). `middleware.ts` protects `/compare`, `/trending`, `/onboarding` — redirects unauthenticated users to `/auth/login?next=<path>`.

**Auth-gated pages:** `/compare`, `/trending`, `/onboarding`. `/analyze` and `/generate` are currently public.

**Google OAuth:** Callback route at `app/auth/callback/route.ts` — exchanges Supabase code for session.

**API calls:** All backend calls go through `lib/api.ts` → `apiPost()`. Uses `NEXT_PUBLIC_API_URL` env var (defaults to `http://localhost:4000`).

**Design system:** Neobrutalist. Fixed palette: `#121212` (black), `#F0F0F0` (bg), `#D02020` (red), `#1040C0` (blue), `#F0C020` (yellow). Border pattern: `border-2 border-[#121212] shadow-[4px_4px_0px_0px_#121212]`. All new UI must match this exactly.

**Programmatic SEO pages:** `app/hashtags/[slug]/page.tsx` — statically generated from `lib/seo-pages.ts`. To add new niche pages, add entries to `NICHE_PAGES` array in that file and update `PAGE_CATEGORIES`. Sitemap auto-includes all slugs.

**Rate limiting (generate page):** Client-side only via `localStorage` key `gen_usage` — 3 free generations/day. Keyed by `new Date().toDateString()`.

---

## Environment variables

### Backend (Railway)
| Variable | Purpose |
|----------|---------|
| `ANTHROPIC_FOUNDRY_API_KEY` | Azure AI Foundry key for Claude |
| `ANTHROPIC_FOUNDRY_RESOURCE` | Azure resource name |
| `ANTHROPIC_FOUNDRY_DEPLOYMENT` | Model name (default: `claude-haiku-4-5`) |
| `APIFY_API_TOKEN` | Instagram scraping |
| `SUPABASE_URL` / `SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY` | Auth + cache |
| `FRONTEND_URL` | Must be set to `https://hashtagitnow.com` for CORS |

### Frontend (Vercel)
| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_API_URL` | Backend URL (Railway) |
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Auth |
| `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` | Payments |
| `NEXT_PUBLIC_STRIPE_PRO_PRICE_ID` | Stripe price ID |

---

## Deployment

- **Backend → Railway:** Auto-deploys on push to `main`. Builder: Nixpacks. Restart policy: on failure, max 3 retries.
- **Frontend → Vercel:** Auto-deploys on push to `main`. `hashtagitnow.vercel.app` 301-redirects to `hashtagitnow.com` (configured in `next.config.mjs`).
- **CI:** `.github/workflows/ci.yml` runs backend typecheck + build and frontend build in parallel on every push/PR to `main`.

## LLM prompt locations

All prompts live in `backend/src/services/llm.service.ts`:
- `SYSTEM_PROMPT` — hashtag audit
- `NICHE_SYSTEM` — niche normalisation to English seeds
- `COMPARE_SYSTEM_PROMPT` — post comparison
- `TRENDING_SYSTEM` — trending classification
- `GENERATE_SYSTEM` — hook + caption generation (uses live trending data as context)

**Instagram rule baked into all prompts:** 5 hashtags max — never recommend more.

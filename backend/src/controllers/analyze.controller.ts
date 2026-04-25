import type { Request, Response, NextFunction } from 'express';
import NodeCache from 'node-cache';
import { fetchInstagramPost, getTopHashtagsForNiches } from '../services/apify.service';
import { auditAndGenerateStrategy, normaliseNicheToEnglish } from '../services/llm.service';
import { getUserFromToken, saveAnalysis } from '../services/supabase.service';
import { extractHashtags, analyzeHashtagSet } from '../utils/hashtag.util';
import { createError } from '../middleware/errorHandler';
import type { AnalyzeRequest, AnalyzeResponse, ScrapedPost } from '../types';

const IG_URL_RE = /^https?:\/\/(www\.)?instagram\.com\/(p|reel|tv)\/[A-Za-z0-9_-]+/;
const MAX_CONTENT_LENGTH = 5000;
const MAX_NICHE_LENGTH = 200;

// Cache URL analyses for 30 minutes
const analyzeCache = new NodeCache({ stdTTL: 1800 });

export async function analyzePost(
  req: Request<object, object, AnalyzeRequest>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const startMs = Date.now();
  try {
    const { inputType, content, niche } = req.body;
    const token = req.headers.authorization?.replace('Bearer ', '');
    const userId = token ? await getUserFromToken(token) : null;

    // Return cached result for same URL + niche combo
    if (inputType === 'url') {
      const cacheKey = `${content.trim()}::${niche?.trim() ?? ''}`;
      const cached = analyzeCache.get<AnalyzeResponse>(cacheKey);
      if (cached) {
        console.log(`[Analyze] Cache hit for ${content.trim()}`);
        res.json(cached);
        return;
      }
    }

    // ── Validation ────────────────────────────────────────────────────────
    if (!inputType || !content) {
      return next(createError('Both "inputType" and "content" are required.', 400));
    }
    if (inputType !== 'caption' && inputType !== 'url') {
      return next(createError('"inputType" must be "caption" or "url".', 400));
    }
    if (content.trim().length === 0) {
      return next(createError('"content" must not be empty.', 400));
    }
    if (content.length > MAX_CONTENT_LENGTH) {
      return next(createError(`"content" must not exceed ${MAX_CONTENT_LENGTH} characters.`, 400));
    }
    if (niche && niche.length > MAX_NICHE_LENGTH) {
      return next(createError(`"niche" must not exceed ${MAX_NICHE_LENGTH} characters.`, 400));
    }
    if (inputType === 'url' && !IG_URL_RE.test(content.trim())) {
      return next(createError('Only instagram.com post, reel, or TV URLs are accepted.', 400));
    }

    // ── Step 1: resolve post data ─────────────────────────────────────────
    let post: ScrapedPost;

    if (inputType === 'caption') {
      const caption = content;
      post = {
        caption,
        hashtags: extractHashtags(caption),
        likes: 0,
        comments: 0,
        videoViews: 0,
        videoPlays: 0,
        mediaType: 'caption',
      };
    } else {
      // Parallelise: scrape post + normalise niche simultaneously
      console.log(`[Analyze] Scraping URL + normalising niche in parallel...`);
      const [scraped, nicheSeeds] = await Promise.all([
        fetchInstagramPost(content),
        niche?.trim() ? normaliseNicheToEnglish(niche.trim()) : Promise.resolve(null),
      ]);
      post = scraped;
      console.log(`[Analyze] Scraped: ${post.likes} likes, ${post.comments} comments, ${post.hashtags.length} hashtags`);

      // Resolve seeds — niche from user (already normalised above) or auto-detect from caption
      const resolvedSeeds = nicheSeeds ?? [guessSeedNiche(post.caption)];
      const researchedHashtags = await getTopHashtagsForNiches(resolvedSeeds);
      console.log(`[Analyze] Seed niches: [${resolvedSeeds.join(', ')}]`);

      const baseAnalysis = analyzeHashtagSet(post.hashtags);
      const strategy = await auditAndGenerateStrategy({
        caption: post.caption,
        detectedHashtags: post.hashtags,
        researchedHashtags,
        likes: post.likes,
        comments: post.comments,
        videoViews: post.videoViews,
        videoPlays: post.videoPlays,
        mediaType: post.mediaType,
        niche: niche?.trim(),
      });

      const mergedAnalysis = {
        issues: dedupe([...baseAnalysis.issues, ...strategy.analysis.issues]),
        suggestions: dedupe([...baseAnalysis.suggestions, ...strategy.analysis.suggestions]),
      };

      const response: AnalyzeResponse = {
        input: content.length > 300 ? content.slice(0, 300) + '…' : content,
        postSummary: strategy.postSummary,
        detectedHashtags: post.hashtags,
        hashtagAudit: strategy.hashtagAudit,
        analysis: mergedAnalysis,
        recommendedHashtags: strategy.recommendedHashtags,
        explanation: strategy.explanation,
      };

      // Only cache if LLM actually ran (not a fallback)
      if (response.explanation && !response.explanation.includes('LLM enrichment skipped')) {
        analyzeCache.set(`${content.trim()}::${niche?.trim() ?? ''}`, response);
      }

      if (userId) {
        saveAnalysis(userId, { inputType, content, niche, normalizedNiches: resolvedSeeds }, response, Date.now() - startMs)
          .catch((e) => console.warn('[Analyze] DB save failed:', e.message));
      }

      res.json(response);
      return;
    }

    // ── Caption-only path ─────────────────────────────────────────────────
    // ── Step 2: static hashtag checks ────────────────────────────────────
    const baseAnalysis = analyzeHashtagSet(post.hashtags);

    // ── Step 3: niche + hashtag research ─────────────────────────────────
    const seedNiches = niche?.trim()
      ? await normaliseNicheToEnglish(niche.trim())
      : [guessSeedNiche(post.caption)];
    const researchedHashtags = await getTopHashtagsForNiches(seedNiches);
    console.log(`[Analyze] Seed niches: "${niche?.trim() ?? '(auto)'}" → [${seedNiches.join(', ')}]`);

    // ── Step 4: LLM audit ────────────────────────────────────────────────
    const strategy = await auditAndGenerateStrategy({
      caption: post.caption,
      detectedHashtags: post.hashtags,
      researchedHashtags,
      likes: post.likes,
      comments: post.comments,
      videoViews: post.videoViews,
      videoPlays: post.videoPlays,
      mediaType: post.mediaType,
      niche: niche?.trim(),
    });

    // Merge static issues with LLM issues (deduplicated)
    const mergedAnalysis = {
      issues: dedupe([...baseAnalysis.issues, ...strategy.analysis.issues]),
      suggestions: dedupe([...baseAnalysis.suggestions, ...strategy.analysis.suggestions]),
    };

    const response: AnalyzeResponse = {
      input: content.length > 300 ? content.slice(0, 300) + '…' : content,
      postSummary: strategy.postSummary,
      detectedHashtags: post.hashtags,
      hashtagAudit: strategy.hashtagAudit,
      analysis: mergedAnalysis,
      recommendedHashtags: strategy.recommendedHashtags,
      explanation: strategy.explanation,
    };

    // Save to DB in background — don't block response
    if (userId) {
      saveAnalysis(
        userId,
        { inputType, content, niche, normalizedNiches: seedNiches },
        response,
        Date.now() - startMs,
      ).catch((e) => console.warn('[Analyze] DB save failed:', e.message));
    }

    res.json(response);
  } catch (err) {
    next(err);
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────

function dedupe(arr: string[]): string[] {
  return Array.from(new Set(arr));
}

// Broad seed so getTopHashtags has a real niche to query Apify with.
// The LLM determines the real niche independently from the caption.
const SEED_KEYWORDS: [string, string[]][] = [
  ['fitness',  ['gym', 'workout', 'fitness', 'exercise', 'training', 'muscle', 'cardio', 'lift']],
  ['food',     ['recipe', 'food', 'eat', 'cook', 'meal', 'restaurant', 'diet', 'bake']],
  ['travel',   ['travel', 'trip', 'explore', 'adventure', 'vacation', 'destination', 'wanderlust']],
  ['fashion',  ['fashion', 'style', 'outfit', 'ootd', 'clothes', 'wear', 'trend']],
  ['beauty',   ['makeup', 'skincare', 'beauty', 'cosmetics', 'glow', 'moisturizer']],
  ['business', ['business', 'entrepreneur', 'startup', 'marketing', 'brand', 'sales', 'growth']],
];

function guessSeedNiche(text: string): string {
  const lower = text.toLowerCase();
  let best = 'default';
  let bestScore = 0;

  for (const [niche, keywords] of SEED_KEYWORDS) {
    const score = keywords.filter((kw) => lower.includes(kw)).length;
    if (score > bestScore) {
      bestScore = score;
      best = niche;
    }
  }
  return best;
}


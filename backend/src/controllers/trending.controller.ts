import type { Request, Response, NextFunction } from 'express';
import { getRawHashtagsForNiches } from '../services/apify.service';
import { normaliseNicheToEnglish, getTrendingStrategy } from '../services/llm.service';
import { getUserFromToken, getCachedTrending, saveTrendingCache } from '../services/supabase.service';
import { createError } from '../middleware/errorHandler';
import type { TrendingRequest } from '../types';

export async function getTrending(
  req: Request<object, object, TrendingRequest>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { niche } = req.body;

    if (!niche || niche.trim().length === 0) {
      return next(createError('"niche" is required.', 400));
    }
    if (niche.length > 200) {
      return next(createError('"niche" must not exceed 200 characters.', 400));
    }

    const trimmed = niche.trim();
    const token = req.headers.authorization?.replace('Bearer ', '');
    const userId = token ? await getUserFromToken(token) : null;

    // Step 1: Check DB cache first (saves Apify calls)
    const cached = await getCachedTrending(trimmed);
    if (cached) {
      console.log(`[Trending] Cache hit for "${trimmed}"`);
      res.json(cached);
      return;
    }

    // Step 2: Normalise to English seeds
    const normalizedNiches = await normaliseNicheToEnglish(trimmed);
    console.log(`[Trending] "${trimmed}" → seeds: [${normalizedNiches.join(', ')}]`);

    // Step 3: Scrape raw hashtags from Apify
    let rawHashtags: Array<{ tag: string; postCount: number }> = [];
    try {
      rawHashtags = await getRawHashtagsForNiches(normalizedNiches);
      console.log(`[Trending] Scraped ${rawHashtags.length} hashtags`);
    } catch (err) {
      console.warn('[Trending] Apify scrape failed, using empty set:', (err as Error).message);
    }

    // Step 4: LLM trend analysis
    const result = await getTrendingStrategy(trimmed, normalizedNiches, rawHashtags);

    // Step 5: Save to DB cache + log event (non-blocking)
    saveTrendingCache(result).catch((e) => console.warn('[Trending] Cache save failed:', e.message));

    res.json(result);
  } catch (err) {
    next(err);
  }
}

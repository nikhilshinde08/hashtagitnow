import type { Request, Response, NextFunction } from 'express';
import { fetchMultipleInstagramPosts } from '../services/apify.service';
import { comparePostsStrategy } from '../services/llm.service';
import { getUserFromToken, saveComparison } from '../services/supabase.service';
import { createError } from '../middleware/errorHandler';
import type { CompareRequest, CompareResponse } from '../types';

const MAX_URLS = 20;
const MIN_URLS = 2;

// Basic Instagram URL validator
const IG_URL_RE = /^https?:\/\/(www\.)?instagram\.com\/(p|reel|tv)\/[A-Za-z0-9_-]+/;

export async function comparePosts(
  req: Request<object, object, CompareRequest>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const startMs = Date.now();
  try {
    const { urls } = req.body;
    const token = req.headers.authorization?.replace('Bearer ', '');
    const userId = token ? await getUserFromToken(token) : null;

    // ── Validation ────────────────────────────────────────────────────────
    if (!Array.isArray(urls) || urls.length === 0) {
      return next(createError('"urls" must be a non-empty array.', 400));
    }
    if (urls.length < MIN_URLS) {
      return next(createError(`Provide at least ${MIN_URLS} URLs to compare.`, 400));
    }
    if (urls.length > MAX_URLS) {
      return next(createError(`Maximum ${MAX_URLS} URLs allowed per request.`, 400));
    }

    const invalid = urls.filter((u) => typeof u !== 'string' || !IG_URL_RE.test(u));
    if (invalid.length > 0) {
      return next(
        createError(
          `Invalid Instagram URLs: ${invalid.slice(0, 3).join(', ')}${invalid.length > 3 ? ` (+${invalid.length - 3} more)` : ''}`,
          400,
        ),
      );
    }

    // Deduplicate
    const uniqueUrls = [...new Set(urls)];
    console.log(`[Compare] Scraping ${uniqueUrls.length} posts…`);

    // ── Step 1: batch scrape all posts ────────────────────────────────────
    const posts = await fetchMultipleInstagramPosts(uniqueUrls);

    const successful = posts.filter((p) => !p.scrapeError);
    const failed = posts.filter((p) => !!p.scrapeError);

    console.log(`[Compare] Scraped ${successful.length} OK, ${failed.length} failed`);

    if (successful.length < MIN_URLS) {
      return next(
        createError(
          `Could only scrape ${successful.length} post(s) successfully. Need at least ${MIN_URLS} to compare. Failed: ${failed.map((p) => p.url).join(', ')}`,
          422,
        ),
      );
    }

    // ── Step 2: LLM comparison ────────────────────────────────────────────
    const comparison = await comparePostsStrategy(posts);

    const response: CompareResponse = {
      totalRequested: uniqueUrls.length,
      totalAnalyzed: successful.length,
      failed: failed.length,
      posts,
      comparison,
    };

    if (userId) {
      saveComparison(userId, uniqueUrls, response, Date.now() - startMs)
        .catch((e) => console.warn('[Compare] DB save failed:', e.message));
    }

    res.json(response);
  } catch (err) {
    next(err);
  }
}

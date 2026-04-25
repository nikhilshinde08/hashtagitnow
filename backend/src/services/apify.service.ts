import { config } from '../config/env';
import { extractHashtags } from '../utils/hashtag.util';
import type { ApifyInstagramItem, HashtagCategories, PostMetrics, ScrapedPost } from '../types';
import fallbackData from '../data/fallback-hashtags.json';

const APIFY_BASE = 'https://api.apify.com/v2';

// ─── Instagram post scraper ───────────────────────────────────────────────

export async function fetchInstagramPost(url: string): Promise<ScrapedPost> {
  if (!config.apify.token) {
    throw new Error('APIFY_API_TOKEN is not configured.');
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), config.apify.timeoutMs);

  try {
    // Strip share-tracking params (igsh, img_index) that confuse the scraper
    const cleanUrl = url.split('?')[0].replace(/\/$/, '') + '/';

    const response = await fetch(
      `${APIFY_BASE}/acts/${config.apify.instagramActorId}/run-sync-get-dataset-items?token=${config.apify.token}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // directUrls works for individual post/reel pages; startUrls is for profile/hashtag pages
        body: JSON.stringify({ directUrls: [cleanUrl], resultsLimit: 1 }),
        signal: controller.signal,
      },
    );

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Apify returned ${response.status}: ${body.slice(0, 200)}`);
    }

    const items = (await response.json()) as ApifyInstagramItem[];
    if (!items.length) throw new Error('Apify returned no results for this URL.');

    const item = items[0];
    const caption = item.caption ?? '';
    const hashtags = item.hashtags?.map((h) => h.toLowerCase()) ?? extractHashtags(caption);
    const mediaType = item.type ?? item.mediaType ?? 'unknown';

    return {
      caption,
      hashtags,
      likes: item.likesCount ?? 0,
      comments: item.commentsCount ?? 0,
      videoViews: item.videoViewCount ?? 0,
      videoPlays: item.videoPlayCount ?? 0,
      mediaType,
    };
  } finally {
    clearTimeout(timer);
  }
}

// ─── Hashtag research (niche-aware, LLM-detected niche) ───────────────────

const hashtagCache = new Map<string, { data: HashtagCategories; expiresAt: number }>();

export async function getTopHashtags(niche: string): Promise<HashtagCategories> {
  const cacheKey = niche.toLowerCase().trim();

  const cached = hashtagCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.data;
  }

  try {
    const data = await scrapeHashtagsForNiche(niche);
    hashtagCache.set(cacheKey, {
      data,
      expiresAt: Date.now() + config.cache.hashtagTtlSeconds * 1000,
    });
    return data;
  } catch (err) {
    console.warn(`[ApifyService] Hashtag scrape failed for "${niche}", using fallback:`, (err as Error).message);
    return getFallback(niche);
  }
}

async function scrapeHashtagsForNiche(niche: string): Promise<HashtagCategories> {
  if (!config.apify.token) throw new Error('No Apify token – skipping live scrape.');

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), config.apify.timeoutMs);

  try {
    const response = await fetch(
      `${APIFY_BASE}/acts/apify~instagram-hashtag-scraper/run-sync-get-dataset-items?token=${config.apify.token}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hashtags: [niche], resultsLimit: 30 }),
        signal: controller.signal,
      },
    );

    if (!response.ok) throw new Error(`Apify hashtag scraper returned ${response.status}`);

    const items = (await response.json()) as Array<{ name?: string; postsCount?: number }>;
    if (!items.length) throw new Error('Empty response from hashtag scraper');

    const sorted = items
      .filter((i) => i.name)
      .map((i) => ({ tag: (i.name as string).toLowerCase(), posts: i.postsCount ?? 0 }))
      .sort((a, b) => b.posts - a.posts);

    const third = Math.ceil(sorted.length / 3);
    return {
      highReach: sorted.slice(0, third).map((i) => i.tag),
      niche: sorted.slice(third, third * 2).map((i) => i.tag),
      lowCompetition: sorted.slice(third * 2).map((i) => i.tag),
    };
  } finally {
    clearTimeout(timer);
  }
}

// Geographic/personal noise tags that appear in niche feeds but are never useful
const GEO_NOISE = new Set([
  'pakistan','india','usa','uk','uae','dubai','karachi','lahore','islamabad',
  'mumbai','delhi','bangalore','hyderabad','chennai','kolkata','pune',
  'london','newyork','nyc','california','texas','canada','australia',
  'nigeria','ghana','kenya','southafrica','egypt','turkey','iran','iraq',
  'bangladesh','srilanka','nepal','afghanistan','indonesia','malaysia',
  'philippines','singapore','thailand','vietnam','china','japan','korea',
  'germany','france','italy','spain','brazil','mexico','argentina',
  'follow','followme','followback','like4like','likeforlike','comment',
  'instagood','instalike','instadaily','photooftheday','picoftheday',
  'love','life','happy','beautiful','fun','amazing','cool','awesome','viral',
  'repost','share','tag','dm','link','bio','check',
]);

// The instagram-hashtag-scraper returns posts from a hashtag feed.
// We extract all hashtags used in those posts and rank by frequency —
// how many recent posts use a tag = its trending signal.
export async function getRawHashtagsForNiches(
  niches: string[],
): Promise<Array<{ tag: string; postCount: number }>> {
  if (!config.apify.token) throw new Error('APIFY_API_TOKEN is not configured.');

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), config.apify.timeoutMs);

  try {
    const response = await fetch(
      `${APIFY_BASE}/acts/apify~instagram-hashtag-scraper/run-sync-get-dataset-items?token=${config.apify.token}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hashtags: niches, resultsLimit: 30 }),
        signal: controller.signal,
      },
    );
    if (!response.ok) throw new Error(`Apify hashtag scraper returned ${response.status}`);

    const posts = (await response.json()) as Array<{ hashtags?: string[]; caption?: string }>;

    const freq = new Map<string, number>();
    for (const post of posts) {
      const tags: string[] =
        post.hashtags?.map((h) => h.toLowerCase().replace(/^#/, '')) ??
        (post.caption?.match(/#[a-zA-Z][a-zA-Z0-9_]+/g) ?? []).map((h) => h.slice(1).toLowerCase());

      const unique = [...new Set(tags)];
      for (const tag of unique) {
        // Skip: non-Latin scripts, geo/noise tags, seed tags, very short tags
        if (!/^[a-z][a-z0-9_]+$/.test(tag)) continue;
        if (tag.length < 3) continue;
        if (GEO_NOISE.has(tag)) continue;
        freq.set(tag, (freq.get(tag) ?? 0) + 1);
      }
    }

    const seedSet = new Set(niches.map((n) => n.toLowerCase()));
    return Array.from(freq.entries())
      .filter(([tag]) => !seedSet.has(tag))
      .map(([tag, count]) => ({ tag, postCount: count }))
      .sort((a, b) => b.postCount - a.postCount)
      .slice(0, 60);
  } finally {
    clearTimeout(timer);
  }
}

export async function getTopHashtagsForNiches(niches: string[]): Promise<HashtagCategories> {
  if (niches.length === 1) return getTopHashtags(niches[0]);

  const results = await Promise.all(niches.map((n) => getTopHashtags(n)));

  const merge = (key: keyof HashtagCategories): string[] => {
    const seen = new Set<string>();
    const merged: string[] = [];
    for (const r of results) {
      for (const tag of r[key]) {
        if (!seen.has(tag)) { seen.add(tag); merged.push(tag); }
      }
    }
    return merged;
  };

  return {
    highReach: merge('highReach'),
    niche: merge('niche'),
    lowCompetition: merge('lowCompetition'),
  };
}

// ─── Batch scrape (for /compare) ─────────────────────────────────────────

const BATCH_TIMEOUT_MS = 120_000; // 2 min — enough for 20 posts in one run
const BATCH_SIZE = 10;            // Apify processes up to 10 directUrls per run reliably

export async function fetchMultipleInstagramPosts(urls: string[]): Promise<PostMetrics[]> {
  if (!config.apify.token) throw new Error('APIFY_API_TOKEN is not configured.');

  // Clean all URLs first
  const cleanUrls = urls.map((u) => u.split('?')[0].replace(/\/$/, '') + '/');

  // Split into chunks so we don't overload a single Apify run
  const results: PostMetrics[] = [];
  for (let i = 0; i < cleanUrls.length; i += BATCH_SIZE) {
    const cleanChunk = cleanUrls.slice(i, i + BATCH_SIZE);
    const originalChunk = urls.slice(i, i + BATCH_SIZE);
    const chunkResults = await scrapeChunk(cleanChunk, originalChunk);
    results.push(...chunkResults);
  }

  return results;
}

async function scrapeChunk(cleanUrls: string[], originalUrls: string[]): Promise<PostMetrics[]> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), BATCH_TIMEOUT_MS);

  try {
    const response = await fetch(
      `${APIFY_BASE}/acts/${config.apify.instagramActorId}/run-sync-get-dataset-items?token=${config.apify.token}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ directUrls: cleanUrls, resultsLimit: cleanUrls.length }),
        signal: controller.signal,
      },
    );

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Apify batch returned ${response.status}: ${body.slice(0, 200)}`);
    }

    // Apify returns `inputUrl` matching what we sent in directUrls — use that for reliable mapping
    const apifyItems = (await response.json()) as Array<ApifyInstagramItem & { inputUrl?: string }>;

    // Build a map: cleanUrl → original URL
    const cleanToOriginal = new Map<string, string>();
    cleanUrls.forEach((clean, i) => cleanToOriginal.set(clean, originalUrls[i] ?? clean));

    // Index scraped items by their inputUrl (normalised)
    const scrapedByClean = new Map<string, ApifyInstagramItem & { inputUrl?: string }>();
    for (const item of apifyItems) {
      const key = (item.inputUrl ?? '').replace(/\/$/, '') + '/';
      scrapedByClean.set(key, item);
    }

    // Build one PostMetrics per input URL, in order
    return cleanUrls.map((clean, i) => {
      const item = scrapedByClean.get(clean);
      const originalUrl = cleanToOriginal.get(clean) ?? clean;

      if (!item) {
        return {
          url: originalUrl,
          caption: '',
          hashtags: [],
          likes: 0,
          comments: 0,
          videoViews: 0,
          videoPlays: 0,
          mediaType: 'unknown',
          scrapeError: 'No data returned — post may be private or deleted.',
        };
      }

      const caption = item.caption ?? '';
      const hashtags = item.hashtags?.map((h) => h.toLowerCase()) ?? extractHashtags(caption);
      return {
        url: originalUrl,
        caption,
        hashtags,
        likes: item.likesCount ?? 0,
        comments: item.commentsCount ?? 0,
        videoViews: item.videoViewCount ?? 0,
        videoPlays: item.videoPlayCount ?? 0,
        mediaType: item.type ?? item.mediaType ?? 'unknown',
      };
    });
  } finally {
    clearTimeout(timer);
  }
}

// ─── Fallback ─────────────────────────────────────────────────────────────

function getFallback(niche: string): HashtagCategories {
  const key = niche.toLowerCase();
  const entry = (fallbackData as Record<string, HashtagCategories>)[key];
  return entry ?? (fallbackData as Record<string, HashtagCategories>)['default'];
}

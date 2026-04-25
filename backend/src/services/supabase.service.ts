import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from '../config/env';
import type { AnalyzeResponse, CompareResponse, TrendingResponse } from '../types';

// Service-role client — bypasses RLS, used for all server-side writes
let _client: SupabaseClient | null = null;

function getClient(): SupabaseClient | null {
  if (!config.supabase.url || !config.supabase.serviceRoleKey ||
      config.supabase.serviceRoleKey === 'your_service_role_key_here') {
    return null;
  }
  if (!_client) {
    _client = createClient(config.supabase.url, config.supabase.serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }
  return _client;
}

// Anon client — used only to verify user JWTs
let _anonClient: SupabaseClient | null = null;

function getAnonClient(): SupabaseClient | null {
  if (!config.supabase.url || !config.supabase.anonKey) return null;
  if (!_anonClient) {
    _anonClient = createClient(config.supabase.url, config.supabase.anonKey);
  }
  return _anonClient;
}

// ─── Auth ─────────────────────────────────────────────────────

export async function getUserFromToken(token: string): Promise<string | null> {
  const client = getAnonClient();
  if (!client) return null;
  const { data, error } = await client.auth.getUser(token);
  if (error || !data.user) return null;
  return data.user.id;
}

// ─── Analyses ────────────────────────────────────────────────

export async function saveAnalysis(
  userId: string,
  input: { inputType: string; content: string; niche?: string; normalizedNiches?: string[] },
  result: AnalyzeResponse,
  processingMs: number,
): Promise<void> {
  const db = getClient();
  if (!db || !userId) return;

  await db.from('analyses').insert({
    user_id: userId,
    input_type: input.inputType,
    input_content: input.content.slice(0, 1000),
    niche: input.niche ?? null,
    normalized_niches: input.normalizedNiches ?? [],
    post_url: input.inputType === 'url' ? input.content : null,
    post_caption: result.postSummary?.topic ?? null,
    post_media_type: result.postSummary?.mediaType ?? null,
    post_likes: result.postSummary?.likes ?? 0,
    post_comments: result.postSummary?.comments ?? 0,
    detected_hashtags: result.detectedHashtags ?? [],
    post_summary: result.postSummary,
    hashtag_audit: result.hashtagAudit,
    recommended_hashtags: result.recommendedHashtags,
    analysis_issues: result.analysis?.issues ?? [],
    analysis_suggestions: result.analysis?.suggestions ?? [],
    explanation: result.explanation,
    processing_ms: processingMs,
  });

  // Increment usage counter
  db.rpc('increment_analyses_used', { p_user_id: userId }).then(() => null, () => null);
  await logEvent(userId, 'analyze', { inputType: input.inputType, niche: input.niche });
}

// ─── Comparisons ─────────────────────────────────────────────

export async function saveComparison(
  userId: string,
  urls: string[],
  result: CompareResponse,
  processingMs: number,
): Promise<void> {
  const db = getClient();
  if (!db || !userId) return;

  const c = result.comparison;
  await db.from('comparisons').insert({
    user_id: userId,
    urls,
    total_requested: result.totalRequested,
    total_analyzed: result.totalAnalyzed,
    failed: result.failed,
    ranked_posts: c.rankedPosts,
    top_performer: c.topPerformer,
    bottom_performer: c.bottomPerformer,
    hashtag_patterns: c.hashtagPatterns,
    key_insights: c.keyInsights,
    per_post_recs: c.perPostRecommendations,
    overall_strategy: c.overallStrategy,
    processing_ms: processingMs,
  });

  await logEvent(userId, 'compare', { urlCount: urls.length });
}

// ─── Trending cache ───────────────────────────────────────────

export async function getCachedTrending(niche: string): Promise<TrendingResponse | null> {
  const db = getClient();
  if (!db) return null;

  const { data } = await db
    .from('trending_searches')
    .select('*')
    .eq('niche', niche.toLowerCase().trim())
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data) return null;

  // Bump search count
  await db.from('trending_searches').update({ search_count: (data.search_count ?? 1) + 1 }).eq('id', data.id);

  return {
    niche: data.niche,
    normalizedNiches: data.normalized_niches ?? [],
    trendingHashtags: {
      rising: data.rising_hashtags ?? [],
      sweetSpot: data.sweet_spot_hashtags ?? [],
      saturated: data.saturated_hashtags ?? [],
    },
    contentAngles: data.content_angles ?? [],
    strategy: data.strategy ?? '',
  };
}

export async function saveTrendingCache(result: TrendingResponse): Promise<void> {
  const db = getClient();
  if (!db) return;

  await db.from('trending_searches').insert({
    niche: result.niche.toLowerCase().trim(),
    normalized_niches: result.normalizedNiches,
    rising_hashtags: result.trendingHashtags.rising,
    sweet_spot_hashtags: result.trendingHashtags.sweetSpot,
    saturated_hashtags: result.trendingHashtags.saturated,
    content_angles: result.contentAngles,
    strategy: result.strategy,
  });
}

// ─── Usage events ─────────────────────────────────────────────

async function logEvent(userId: string, eventType: string, metadata: object): Promise<void> {
  const db = getClient();
  if (!db) return;
  db.from('usage_events').insert({ user_id: userId, event_type: eventType, metadata }).then(() => null, () => null);
}

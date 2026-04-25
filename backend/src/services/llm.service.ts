import AnthropicFoundry from '@anthropic-ai/foundry-sdk';
import { config } from '../config/env';
import type {
  HashtagCategories,
  LLMAuditInput,
  LLMAuditOutput,
  PostSummary,
  HashtagAudit,
  HashtagAnalysis,
  PostMetrics,
  ComparisonInsights,
  TrendingResponse,
} from '../types';

let _client: AnthropicFoundry | null = null;

function getClient(): AnthropicFoundry {
  if (!_client) {
    if (!config.llm.foundryApiKey || !config.llm.foundryResource) {
      throw new Error('NO_LLM_KEY');
    }
    _client = new AnthropicFoundry({
      apiKey: config.llm.foundryApiKey,
      resource: config.llm.foundryResource,
    });
  }
  return _client;
}

// ─── Core LLM call ────────────────────────────────────────────────────────

async function callLLM(system: string, userPrompt: string, maxTokens = 900): Promise<string> {
  const client = getClient();

  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('LLM_TIMEOUT')), config.llm.timeoutMs),
  );

  const response = await Promise.race([
    client.messages.create({
      model: config.llm.foundryDeployment,
      max_tokens: maxTokens,
      system,
      messages: [{ role: 'user', content: userPrompt }],
    }),
    timeout,
  ]);

  const block = response.content[0];
  if (block.type !== 'text') throw new Error('Unexpected LLM response type.');
  return block.text;
}

// ─── System prompt ────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are an expert Instagram growth analyst and hashtag strategist.
Your job is to:
1. Read an Instagram post (caption + engagement data)
2. Understand what the post is actually about — detect its true topic and niche from the content
3. Audit the existing hashtags: are they relevant, effective, too generic, or missing the mark?
4. Recommend an optimised hashtag set tailored to this specific post

MULTILINGUAL SUPPORT: The creator's niche description may be in any language — Hindi, Hinglish, English, or mixed.
Understand the niche accurately regardless of language. All recommended hashtags must be in English
(as English hashtags have global reach on Instagram) unless the niche is explicitly region-specific.

Respond ONLY with valid JSON — no markdown, no code fences, no extra text.`;

// ─── Niche normaliser ─────────────────────────────────────────────────────

const NICHE_SYSTEM = `You are a niche classifier for Instagram hashtag research.
Given a content creator's niche description in ANY language (English, Hindi, Hinglish, or mixed),
extract all distinct niches and return them as a JSON array of lowercase English keywords (1–3 items).
Examples:
  "fitness and food photography"        → ["fitness", "food", "photography"]
  "फिटनेस और ट्रैवल"                    → ["fitness", "travel"]
  "business motivation for entrepreneurs" → ["business", "motivation"]
  "yoga"                                 → ["yoga"]
Return ONLY the JSON array — no explanation, no extra text.`;

export async function normaliseNicheToEnglish(niche: string): Promise<string[]> {
  try {
    const result = await callLLM(NICHE_SYSTEM, niche, 30);
    const cleaned = result.trim().replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
    const parsed = JSON.parse(cleaned);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed
        .filter((n): n is string => typeof n === 'string')
        .map((n) => n.toLowerCase().replace(/[^a-z]/g, ''))
        .filter(Boolean)
        .slice(0, 3);
    }
    return ['default'];
  } catch {
    return ['default'];
  }
}

// ─── Main audit function ──────────────────────────────────────────────────

export async function auditAndGenerateStrategy(input: LLMAuditInput): Promise<LLMAuditOutput> {
  const hasEngagement = input.likes || input.comments || input.videoViews;
  const engagementLine = hasEngagement
    ? [
        `Likes: ${input.likes}`,
        `Comments: ${input.comments}`,
        input.videoViews ? `Video Views: ${input.videoViews}` : null,
        input.videoPlays ? `Video Plays: ${input.videoPlays}` : null,
        `Media: ${input.mediaType}`,
      ]
        .filter(Boolean)
        .join(' | ')
    : 'Engagement data not available (caption-only mode)';

  const currentTags = input.detectedHashtags.length
    ? input.detectedHashtags.map((h) => `#${h}`).join(' ')
    : '(none — no hashtags in this post)';

  const nicheContext = input.niche
    ? `\nCREATOR NICHE (self-described — may be in Hindi, Hinglish, or English): "${input.niche}"
Treat this as the primary signal for what the creator builds content around. Use it to inform hashtag tier selection, tone, and community tags even if the caption doesn't fully reflect the niche.\n`
    : '';

  const userPrompt = `
Analyse this Instagram post and produce a full hashtag audit + strategy.

POST DETAILS:
${engagementLine}
${nicheContext}CAPTION:
"""
${input.caption}
"""

CURRENT HASHTAGS USED (${input.detectedHashtags.length}):
${currentTags}

REFERENCE HASHTAGS FOR THIS SPACE (use as context, not as a fixed list):
- High Reach: ${input.researchedHashtags.highReach.map((h) => `#${h}`).join(' ')}
- Niche:      ${input.researchedHashtags.niche.map((h) => `#${h}`).join(' ')}
- Low Competition: ${input.researchedHashtags.lowCompetition.map((h) => `#${h}`).join(' ')}

INSTRUCTIONS:
1. Detect the true niche/topic of this post from its caption — do NOT assume from the reference list
2. Audit each currently used hashtag: is it effective for THIS post specifically?
3. Identify hashtags that are too generic, irrelevant, or missing
4. Recommend 20-30 total hashtags across three tiers, tailored to this post's actual content

Return this exact JSON shape:
{
  "postSummary": {
    "topic": "one-line description of what the post is about",
    "niche": "detected niche (e.g. 'fitness', 'travel photography', 'vegan cooking')",
    "likes": ${input.likes},
    "comments": ${input.comments},
    "mediaType": "${input.mediaType}",
    "engagementNote": "brief observation about engagement vs hashtag strategy"
  },
  "hashtagAudit": {
    "effective":   ["tags", "that", "work", "for", "this", "post"],
    "tooGeneric":  ["tags", "too", "broad"],
    "irrelevant":  ["tags", "that", "dont", "match", "content"],
    "missing":     ["important", "tags", "absent", "from", "post"]
  },
  "recommendedHashtags": {
    "highReach":      ["5-8 high volume tags — no #"],
    "niche":          ["8-12 targeted tags specific to this post's topic"],
    "lowCompetition": ["6-10 long-tail tags for this specific post"]
  },
  "analysis": {
    "issues":      ["specific problem with the current hashtag set"],
    "suggestions": ["actionable fix"]
  },
  "explanation": "2-3 sentences summarising the audit verdict and strategy rationale"
}

Rules:
- All tags lowercase, no '#' prefix in arrays
- hashtagAudit must only reference tags that were actually in the current hashtag list
- recommendedHashtags must reflect the actual content of THIS post, not generic tags
`.trim();

  let raw: string;
  try {
    raw = await callLLM(SYSTEM_PROMPT, userPrompt, 2500);
  } catch (err) {
    if ((err as Error).message === 'NO_LLM_KEY') {
      console.warn('[LLMService] No credentials – returning fallback.');
      return buildFallback(input);
    }
    throw err;
  }

  return parseLLMOutput(raw, input);
}

// ─── Parser ───────────────────────────────────────────────────────────────

function parseLLMOutput(raw: string, input: LLMAuditInput): LLMAuditOutput {
  const cleaned = stripFences(raw);

  try {
    const parsed = JSON.parse(cleaned) as LLMAuditOutput;

    const postSummary: PostSummary = {
      topic: parsed.postSummary?.topic ?? 'Unknown',
      niche: parsed.postSummary?.niche ?? 'general',
      likes: input.likes,
      comments: input.comments,
      mediaType: input.mediaType,
      engagementNote: parsed.postSummary?.engagementNote ?? '',
    };

    const hashtagAudit: HashtagAudit = {
      effective: sanitiseTags(parsed.hashtagAudit?.effective),
      tooGeneric: sanitiseTags(parsed.hashtagAudit?.tooGeneric),
      irrelevant: sanitiseTags(parsed.hashtagAudit?.irrelevant),
      missing: sanitiseTags(parsed.hashtagAudit?.missing),
    };

    const rh = parsed.recommendedHashtags ?? input.researchedHashtags;
    const recommendedHashtags: HashtagCategories = {
      highReach: sanitiseTags(rh.highReach ?? input.researchedHashtags.highReach),
      niche: sanitiseTags(rh.niche ?? input.researchedHashtags.niche),
      lowCompetition: sanitiseTags(rh.lowCompetition ?? input.researchedHashtags.lowCompetition),
    };

    const analysis: HashtagAnalysis = {
      issues: Array.isArray(parsed.analysis?.issues) ? parsed.analysis.issues : [],
      suggestions: Array.isArray(parsed.analysis?.suggestions) ? parsed.analysis.suggestions : [],
    };

    return {
      postSummary,
      hashtagAudit,
      recommendedHashtags,
      analysis,
      explanation: typeof parsed.explanation === 'string' ? parsed.explanation : '',
    };
  } catch {
    return buildFallback(input);
  }
}

function buildFallback(input: LLMAuditInput): LLMAuditOutput {
  return {
    postSummary: {
      topic: 'Could not determine (LLM unavailable)',
      niche: 'general',
      likes: input.likes,
      comments: input.comments,
      mediaType: input.mediaType,
      engagementNote: `Views: ${input.videoViews} | LLM analysis unavailable.`,
    },
    hashtagAudit: {
      effective: [],
      tooGeneric: [],
      irrelevant: [],
      missing: [],
    },
    recommendedHashtags: input.researchedHashtags,
    analysis: {
      issues: [],
      suggestions: ['Configure ANTHROPIC_FOUNDRY_API_KEY to enable AI-powered hashtag auditing.'],
    },
    explanation: 'LLM enrichment skipped. Showing fallback hashtag research only.',
  };
}

function stripFences(raw: string): string {
  // Remove opening ```json or ``` fence and closing ``` — handle any surrounding whitespace
  return raw
    .replace(/^\s*```(?:json)?\s*/i, '')
    .replace(/\s*```\s*$/i, '')
    .trim();
}

function sanitiseTags(tags: unknown): string[] {
  if (!Array.isArray(tags)) return [];
  return tags
    .filter((t): t is string => typeof t === 'string')
    .map((t) => t.replace(/^#+/, '').toLowerCase().trim())
    .filter(Boolean);
}

// ─── Compare posts strategy ───────────────────────────────────────────────

const COMPARE_SYSTEM_PROMPT = `You are an expert Instagram analytics strategist.
You will receive data from multiple Instagram posts — their captions, hashtags, and engagement metrics.
Your job is to compare them, find patterns in what drives views and engagement, and give actionable recommendations.
Respond ONLY with valid JSON — no markdown, no code fences, no extra text.`;

export async function comparePostsStrategy(posts: PostMetrics[]): Promise<ComparisonInsights> {
  // Sort by video views desc to establish ranking
  const ranked = [...posts]
    .filter((p) => !p.scrapeError)
    .sort((a, b) => b.videoViews - a.videoViews);

  const postsBlock = ranked
    .map((p, i) => {
      const short = p.caption.slice(0, 200).replace(/\n/g, ' ');
      return `POST ${i + 1} (${p.url.match(/\/(p|reel|tv)\/([A-Za-z0-9_-]+)/)?.[2] ?? 'unknown'}):
  Views: ${p.videoViews} | Plays: ${p.videoPlays} | Likes: ${p.likes} | Comments: ${p.comments} | Type: ${p.mediaType}
  Caption snippet: "${short}"
  Hashtags (${p.hashtags.length}): ${p.hashtags.map((h) => `#${h}`).join(' ')}`;
    })
    .join('\n\n');

  const userPrompt = `
Compare these ${ranked.length} Instagram posts and analyse why some perform better than others.

${postsBlock}

Return this exact JSON:
{
  "rankedPosts": [
    {
      "rank": 1,
      "url": "full url",
      "shortCaption": "10 word summary of what the post is about",
      "likes": 0,
      "comments": 0,
      "videoViews": 0,
      "hashtagCount": 0
    }
  ],
  "topPerformer": {
    "url": "full url of top post",
    "reason": "why this post outperforms others — be specific about hashtags and content"
  },
  "bottomPerformer": {
    "url": "full url of lowest-performing post",
    "reason": "specific reason it underperforms"
  },
  "hashtagPatterns": {
    "workingTags": ["tags appearing in high-performing posts"],
    "avoidTags": ["tags appearing in low-performing posts but not high ones"],
    "missingFromLow": ["tags top performers use that low performers are missing"]
  },
  "keyInsights": [
    "insight 1 — specific observation about hashtag strategy vs performance",
    "insight 2",
    "insight 3"
  ],
  "perPostRecommendations": [
    {
      "url": "post url",
      "currentPerformance": "high|medium|low",
      "actions": ["specific action to improve or maintain performance"]
    }
  ],
  "overallStrategy": "2-3 sentences on what hashtag strategy change would lift ALL posts"
}

Rules:
- rankedPosts must be sorted views descending (rank 1 = most views)
- workingTags/avoidTags must only reference hashtags actually present in the posts above
- missingFromLow should be genuinely missing important tags, not generic suggestions
- currentPerformance: "high" = top 33%, "medium" = middle, "low" = bottom 33%
`.trim();

  let raw: string;
  try {
    raw = await callLLM(COMPARE_SYSTEM_PROMPT, userPrompt, 2000);
  } catch (err) {
    if ((err as Error).message === 'NO_LLM_KEY') {
      return buildCompareFallback(ranked);
    }
    throw err;
  }

  return parseCompareOutput(raw, ranked);
}

function parseCompareOutput(raw: string, ranked: PostMetrics[]): ComparisonInsights {
  const cleaned = stripFences(raw);
  try {
    const parsed = JSON.parse(cleaned) as ComparisonInsights;
    return {
      rankedPosts: Array.isArray(parsed.rankedPosts) ? parsed.rankedPosts : [],
      topPerformer: parsed.topPerformer ?? { url: ranked[0]?.url ?? '', reason: '' },
      bottomPerformer: parsed.bottomPerformer ?? { url: ranked.at(-1)?.url ?? '', reason: '' },
      hashtagPatterns: {
        workingTags: sanitiseTags(parsed.hashtagPatterns?.workingTags),
        avoidTags: sanitiseTags(parsed.hashtagPatterns?.avoidTags),
        missingFromLow: sanitiseTags(parsed.hashtagPatterns?.missingFromLow),
      },
      keyInsights: Array.isArray(parsed.keyInsights) ? parsed.keyInsights : [],
      perPostRecommendations: Array.isArray(parsed.perPostRecommendations)
        ? parsed.perPostRecommendations
        : [],
      overallStrategy: typeof parsed.overallStrategy === 'string' ? parsed.overallStrategy : '',
    };
  } catch {
    console.error('[LLMService] Compare parse failed. Raw snippet:', raw.slice(0, 300));
    return buildCompareFallback(ranked);
  }
}

// ─── Trending hashtag analysis ────────────────────────────────────────────

const TRENDING_SYSTEM = `You are an Instagram hashtag trend analyst. You receive a list of hashtags with their recent-post frequency scores for a given niche. The frequency score = how many of the last ~30 posts in the niche feed used that hashtag. Higher score = more actively used right now = stronger trending signal.

CRITICAL RULE: Only classify hashtags that are DIRECTLY relevant to the stated niche. Skip any hashtag that is:
- Geographic (country, city, region names)
- Generic social (follow, like, love, happy, beautiful, viral, instagood, etc.)
- Personal branding noise (photooftheday, picoftheday, etc.)
- Unrelated to the niche topic

If a tag is irrelevant to the niche, do NOT include it in any tier — omit it entirely.

Classification rules based on frequency score:
- rising: score 5+ — heavily used in recent posts, actively trending in this niche right now
- sweetSpot: score 2–4 — used regularly; targeted, moderate competition
- saturated: score 1 — low niche activity; only include if clearly niche-relevant

Respond ONLY with valid JSON — no markdown, no code fences, no extra text.`;

export async function getTrendingStrategy(
  niche: string,
  normalizedNiches: string[],
  rawHashtags: Array<{ tag: string; postCount: number }>,
): Promise<TrendingResponse> {
  const hashtagBlock = rawHashtags
    .map((h) => `${h.tag}: frequency ${h.postCount}`)
    .join('\n');

  const userPrompt = `
Niche: "${niche}" (normalized: ${normalizedNiches.join(', ')})

SCRAPED HASHTAGS WITH POST COUNTS:
${hashtagBlock}

Classify these hashtags and return this exact JSON:
{
  "trendingHashtags": {
    "rising": [
      { "tag": "tagname", "postCount": 0, "reason": "why this tag is gaining momentum right now", "bestFor": "what type of content to pair it with" }
    ],
    "sweetSpot": [
      { "tag": "tagname", "postCount": 0, "reason": "why this is a precision targeting tag", "bestFor": "ideal content type or audience" }
    ],
    "saturated": [
      { "tag": "tagname", "postCount": 0, "reason": "why it's oversaturated", "bestFor": "only use alongside 15+ niche tags" }
    ]
  },
  "contentAngles": [
    "Specific content idea that would perform well with these trending tags",
    "Another content angle based on the tag patterns you see"
  ],
  "strategy": "2-3 sentence summary of the optimal hashtag mix strategy for this niche right now, referencing specific tags from the data"
}

Rules:
- Only classify tags that appear in the input list above
- postCount must match the number given in the input
- contentAngles must be specific and actionable, not generic
- strategy must reference actual tags from the data
- Aim for 3-6 tags in each tier
`.trim();

  try {
    const raw = await callLLM(TRENDING_SYSTEM, userPrompt, 1000);
    const cleaned = stripFences(raw);
    const parsed = JSON.parse(cleaned);

    return {
      niche,
      normalizedNiches,
      trendingHashtags: {
        rising: Array.isArray(parsed.trendingHashtags?.rising) ? parsed.trendingHashtags.rising : [],
        sweetSpot: Array.isArray(parsed.trendingHashtags?.sweetSpot) ? parsed.trendingHashtags.sweetSpot : [],
        saturated: Array.isArray(parsed.trendingHashtags?.saturated) ? parsed.trendingHashtags.saturated : [],
      },
      contentAngles: Array.isArray(parsed.contentAngles) ? parsed.contentAngles : [],
      strategy: typeof parsed.strategy === 'string' ? parsed.strategy : '',
    };
  } catch {
    return {
      niche,
      normalizedNiches,
      trendingHashtags: { rising: [], sweetSpot: [], saturated: [] },
      contentAngles: [],
      strategy: 'LLM analysis unavailable. Configure ANTHROPIC_FOUNDRY_API_KEY to enable trending analysis.',
    };
  }
}

function buildCompareFallback(ranked: PostMetrics[]): ComparisonInsights {
  return {
    rankedPosts: ranked.map((p, i) => ({
      rank: i + 1,
      url: p.url,
      shortCaption: p.caption.slice(0, 60),
      likes: p.likes,
      comments: p.comments,
      videoViews: p.videoViews,
      hashtagCount: p.hashtags.length,
    })),
    topPerformer: { url: ranked[0]?.url ?? '', reason: 'LLM unavailable' },
    bottomPerformer: { url: ranked.at(-1)?.url ?? '', reason: 'LLM unavailable' },
    hashtagPatterns: { workingTags: [], avoidTags: [], missingFromLow: [] },
    keyInsights: [],
    perPostRecommendations: [],
    overallStrategy: 'Configure ANTHROPIC_FOUNDRY_API_KEY to enable AI-powered comparison.',
  };
}

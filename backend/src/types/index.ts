export type InputType = 'caption' | 'url';

// ─── Trending feature ─────────────────────────────────────────────────────

export interface TrendingRequest {
  niche: string;
}

export interface TrendingHashtag {
  tag: string;
  postCount: number;
  reason: string;
  bestFor: string;
}

export interface TrendingResponse {
  niche: string;
  normalizedNiches: string[];
  trendingHashtags: {
    rising: TrendingHashtag[];
    sweetSpot: TrendingHashtag[];
    saturated: TrendingHashtag[];
  };
  contentAngles: string[];
  strategy: string;
}



export interface AnalyzeRequest {
  inputType: InputType;
  content: string;
  niche?: string;  // plain-English description, e.g. "fitness motivation for busy moms"
}

export interface HashtagCategories {
  highReach: string[];
  niche: string[];
  lowCompetition: string[];
}

export interface HashtagAnalysis {
  issues: string[];
  suggestions: string[];
}

// Audit of the hashtags that already exist in the post
export interface HashtagAudit {
  effective: string[];      // relevant, well-chosen tags
  tooGeneric: string[];     // too broad to drive targeted reach
  irrelevant: string[];     // don't match the post content
  missing: string[];        // high-value tags absent from the post
}

// Summary of what the scraped/analysed post is about
export interface PostSummary {
  topic: string;
  niche: string;
  likes: number;
  comments: number;
  mediaType: string;
  engagementNote: string;  // e.g. "low engagement relative to hashtag count"
}

export interface AnalyzeResponse {
  input: string;
  postSummary: PostSummary;
  detectedHashtags: string[];
  hashtagAudit: HashtagAudit;
  analysis: HashtagAnalysis;
  recommendedHashtags: HashtagCategories;
  explanation: string;
}

export interface ApifyInstagramItem {
  caption?: string;
  hashtags?: string[];
  likesCount?: number;
  commentsCount?: number;
  videoViewCount?: number;
  videoPlayCount?: number;
  url?: string;
  shortCode?: string;
  type?: string;
  mediaType?: string;
}

export interface ScrapedPost {
  caption: string;
  hashtags: string[];
  likes: number;
  comments: number;
  videoViews: number;
  videoPlays: number;
  mediaType: string;
}

export interface LLMAuditInput {
  caption: string;
  detectedHashtags: string[];
  researchedHashtags: HashtagCategories;
  likes: number;
  comments: number;
  videoViews: number;
  videoPlays: number;
  mediaType: string;
  niche?: string;
}

export interface LLMAuditOutput {
  postSummary: PostSummary;
  hashtagAudit: HashtagAudit;
  recommendedHashtags: HashtagCategories;
  analysis: HashtagAnalysis;
  explanation: string;
}

// ─── Compare feature ─────────────────────────────────────────────────────

export interface CompareRequest {
  urls: string[];
}

export interface PostMetrics {
  url: string;
  caption: string;
  hashtags: string[];
  likes: number;
  comments: number;
  videoViews: number;
  videoPlays: number;
  mediaType: string;
  scrapeError?: string;
}

export interface RankedPost {
  rank: number;
  url: string;
  shortCaption: string;
  likes: number;
  comments: number;
  videoViews: number;
  hashtagCount: number;
}

export interface HashtagPatterns {
  workingTags: string[];    // tags common in high-performing posts
  avoidTags: string[];      // tags common in low-performing posts
  missingFromLow: string[]; // tags top performers use that low performers don't
}

export interface PerPostRecommendation {
  url: string;
  currentPerformance: 'high' | 'medium' | 'low';
  actions: string[];
}

export interface ComparisonInsights {
  rankedPosts: RankedPost[];
  topPerformer: { url: string; reason: string };
  bottomPerformer: { url: string; reason: string };
  hashtagPatterns: HashtagPatterns;
  keyInsights: string[];
  perPostRecommendations: PerPostRecommendation[];
  overallStrategy: string;
}

export interface CompareResponse {
  totalRequested: number;
  totalAnalyzed: number;
  failed: number;
  posts: PostMetrics[];
  comparison: ComparisonInsights;
}

export interface AppError extends Error {
  statusCode: number;
}

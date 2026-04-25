export interface PostSummary {
  topic: string;
  niche: string;
  likes: number;
  comments: number;
  mediaType: string;
  engagementNote: string;
}

export interface HashtagAudit {
  effective: string[];
  tooGeneric: string[];
  irrelevant: string[];
  missing: string[];
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

export interface AnalyzeResponse {
  input: string;
  postSummary: PostSummary;
  detectedHashtags: string[];
  hashtagAudit: HashtagAudit;
  recommendedHashtags: HashtagCategories;
  analysis: HashtagAnalysis;
  explanation: string;
  error?: boolean;
  message?: string;
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
  workingTags: string[];
  avoidTags: string[];
  missingFromLow: string[];
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
  error?: boolean;
  message?: string;
}

export interface CompareResponse {
  totalRequested: number;
  totalAnalyzed: number;
  failed: number;
  posts: unknown[];
  comparison: ComparisonInsights;
  error?: boolean;
  message?: string;
}

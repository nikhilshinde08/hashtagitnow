// Unicode range covers accented / non-ASCII hashtag characters used across languages
const HASHTAG_REGEX = /#[\wÀ-ɏЀ-ӿ一-鿿]+/g;

export function extractHashtags(text: string): string[] {
  const matches = text.match(HASHTAG_REGEX) ?? [];
  const unique = new Set(matches.map((tag) => tag.slice(1).toLowerCase()));
  return Array.from(unique);
}

export function analyzeHashtagSet(hashtags: string[]): {
  issues: string[];
  suggestions: string[];
} {
  const issues: string[] = [];
  const suggestions: string[] = [];

  if (hashtags.length === 0) {
    issues.push('No hashtags detected in the caption.');
    suggestions.push('Add 15–30 relevant hashtags to maximize reach.');
  } else if (hashtags.length > 30) {
    issues.push(`Too many hashtags (${hashtags.length}). Instagram penalises posts with 30+.`);
    suggestions.push('Trim down to the 20–25 most relevant tags.');
  } else if (hashtags.length < 5) {
    issues.push(`Very few hashtags (${hashtags.length}). You may be missing discovery opportunities.`);
    suggestions.push('Consider expanding to 15–20 targeted hashtags.');
  }

  const tooShort = hashtags.filter((h) => h.length < 3);
  if (tooShort.length > 0) {
    issues.push(`Short/generic tags found: ${tooShort.slice(0, 3).join(', ')}. These offer minimal targeting.`);
    suggestions.push('Replace overly generic tags with niche-specific alternatives.');
  }

  return { issues, suggestions };
}

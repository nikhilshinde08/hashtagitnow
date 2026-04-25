import dotenv from 'dotenv';
import path from 'path';

// Load backend .env first, then fall back to the root .env.local so
// Azure AI Foundry credentials are available without duplication.
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../.env.local') });

function required(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required env variable: ${key}`);
  return value;
}

function optional(key: string, fallback: string): string {
  return process.env[key] ?? fallback;
}

export const config = {
  port: parseInt(optional('PORT', '4000'), 10),
  supabase: {
    url: optional('SUPABASE_URL', ''),
    anonKey: optional('SUPABASE_ANON_KEY', ''),
    serviceRoleKey: optional('SUPABASE_SERVICE_ROLE_KEY', ''),
  },
  apify: {
    token: optional('APIFY_API_TOKEN', ''),
    instagramActorId: 'apify~instagram-scraper',
    timeoutMs: 30_000,
  },
  llm: {
    foundryApiKey: optional('ANTHROPIC_FOUNDRY_API_KEY', ''),
    foundryResource: optional('ANTHROPIC_FOUNDRY_RESOURCE', ''),
    foundryDeployment: optional('ANTHROPIC_FOUNDRY_DEPLOYMENT', 'claude-haiku-4-5'),
    timeoutMs: 20_000,
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 30,
  },
  cache: {
    hashtagTtlSeconds: 60 * 60, // 1 hour
  },
} as const;

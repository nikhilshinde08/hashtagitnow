import type { Request, Response, NextFunction } from 'express';
import { getRawHashtagsForNiches } from '../services/apify.service';
import { normaliseNicheToEnglish, generateHooks } from '../services/llm.service';
import { createError } from '../middleware/errorHandler';
import type { GenerateRequest, GenerateResponse, GenerateTone, GeneratePlatform } from '../types';

export async function generateContent(
  req: Request<object, object, GenerateRequest>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { niche, tone = 'inspirational', platform = 'instagram' } = req.body;

    if (!niche || niche.trim().length === 0) {
      return next(createError('"niche" is required.', 400));
    }
    if (niche.length > 200) {
      return next(createError('"niche" must not exceed 200 characters.', 400));
    }

    const validTones: GenerateTone[] = ['funny', 'educational', 'inspirational'];
    const validPlatforms: GeneratePlatform[] = ['instagram', 'youtube'];
    const safeTone: GenerateTone = validTones.includes(tone as GenerateTone) ? (tone as GenerateTone) : 'inspirational';
    const safePlatform: GeneratePlatform = validPlatforms.includes(platform as GeneratePlatform) ? (platform as GeneratePlatform) : 'instagram';

    const trimmed = niche.trim();

    // Normalise niche → English seeds for Apify
    const normalizedNiches = await normaliseNicheToEnglish(trimmed);
    console.log(`[Generate] "${trimmed}" → seeds: [${normalizedNiches.join(', ')}]`);

    // Pull live trending hashtags to use as context in the prompt
    let trendingContext = 'No trending data available — generate based on niche knowledge only.';
    try {
      const rawHashtags = await getRawHashtagsForNiches(normalizedNiches);
      if (rawHashtags.length > 0) {
        trendingContext = rawHashtags
          .slice(0, 30)
          .map((h) => `#${h.tag} (frequency: ${h.postCount})`)
          .join(', ');
        console.log(`[Generate] Got ${rawHashtags.length} trending tags as context`);
      }
    } catch (err) {
      console.warn('[Generate] Trending fetch failed, using fallback context:', (err as Error).message);
    }

    const hooks = await generateHooks(trimmed, safeTone, safePlatform, trendingContext);

    const response: GenerateResponse = {
      niche: trimmed,
      tone: safeTone,
      platform: safePlatform,
      hooks,
    };

    res.json(response);
  } catch (err) {
    next(err);
  }
}

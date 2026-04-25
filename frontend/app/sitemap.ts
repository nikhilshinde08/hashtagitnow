import type { MetadataRoute } from 'next';
import { NICHE_PAGES } from '@/lib/seo-pages';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://hashtagitnow.com';

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/analyze`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.95 },
    { url: `${base}/compare`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.95 },
    { url: `${base}/trending`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.95 },
    { url: `${base}/hashtags`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/pricing`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/auth/signup`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
    { url: `${base}/auth/login`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.4 },
  ];

  const nichePages: MetadataRoute.Sitemap = NICHE_PAGES.map((page) => ({
    url: `${base}/hashtags/${page.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  return [...staticPages, ...nichePages];
}

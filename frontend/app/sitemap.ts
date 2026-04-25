import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://hashtagitnow.com';
  return [
    { url: base, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/analyze`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.95 },
    { url: `${base}/compare`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.95 },
    { url: `${base}/trending`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.95 },
    { url: `${base}/pricing`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/auth/signup`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
    { url: `${base}/auth/login`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.4 },
  ];
}

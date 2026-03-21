import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://www.ecommercerente.com', lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: 'https://www.ecommercerente.com/markenware', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: 'https://www.ecommercerente.com/verkaufskommission', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: 'https://www.ecommercerente.com/partner', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://www.ecommercerente.com/shop', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
  ];
}

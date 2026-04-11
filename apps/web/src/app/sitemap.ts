import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://www.ecommercerente.com', lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: 'https://www.ecommercerente.com/markenware', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://www.ecommercerente.com/verkaufskommission', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://www.ecommercerente.com/faq', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://www.ecommercerente.com/erstgespraech', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://www.ecommercerente.com/partner', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: 'https://www.ecommercerente.com/knowledge', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    { url: 'https://www.ecommercerente.com/impressum', lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: 'https://www.ecommercerente.com/datenschutz', lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: 'https://www.ecommercerente.com/agb', lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ];
}

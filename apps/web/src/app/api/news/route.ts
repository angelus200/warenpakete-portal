import { NextResponse } from 'next/server';

export const revalidate = 1800; // 30 minutes cache

interface NewsItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  category?: string;
}

/**
 * Parse RSS feed XML without external dependencies
 */
function parseRSS(xml: string): NewsItem[] {
  const items: NewsItem[] = [];

  // Match all <item> blocks
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  const itemMatches = xml.matchAll(itemRegex);

  for (const match of itemMatches) {
    const itemXml = match[1];

    // Extract title
    const titleMatch = itemXml.match(/<title>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : '';

    // Extract link
    const linkMatch = itemXml.match(/<link>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/link>/i);
    const link = linkMatch ? linkMatch[1].trim() : '';

    // Extract description
    const descMatch = itemXml.match(/<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/i);
    let description = descMatch ? descMatch[1].trim() : '';

    // Strip HTML tags from description
    description = description.replace(/<[^>]*>/g, '');
    // Decode HTML entities
    description = description
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec));
    // Limit to 200 characters
    if (description.length > 200) {
      description = description.substring(0, 200) + '...';
    }

    // Extract pubDate
    const pubDateMatch = itemXml.match(/<pubDate>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/pubDate>/i);
    const pubDate = pubDateMatch ? pubDateMatch[1].trim() : '';

    // Extract category
    const categoryMatch = itemXml.match(/<category>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/category>/i);
    const category = categoryMatch ? categoryMatch[1].trim() : undefined;

    if (title && link) {
      items.push({ title, link, description, pubDate, category });
    }
  }

  return items;
}

/**
 * Fetch RSS feed with timeout
 */
async function fetchRSS(url: string): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000); // 5s timeout

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; NewsBot/1.0)',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.text();
  } finally {
    clearTimeout(timeout);
  }
}

export async function GET() {
  try {
    const feeds = [
      'https://etailment.de/news/feed/',
      'https://t3n.de/rss.xml',
    ];

    // Fetch all feeds in parallel
    const results = await Promise.allSettled(
      feeds.map(async (url) => {
        const xml = await fetchRSS(url);
        return parseRSS(xml);
      })
    );

    // Combine all successful results
    const allItems: NewsItem[] = [];
    for (const result of results) {
      if (result.status === 'fulfilled') {
        allItems.push(...result.value);
      }
    }

    // Sort by date (newest first)
    allItems.sort((a, b) => {
      const dateA = new Date(a.pubDate).getTime();
      const dateB = new Date(b.pubDate).getTime();
      return dateB - dateA;
    });

    // Limit to 15 items
    const limitedItems = allItems.slice(0, 15);

    return NextResponse.json(limitedItems, {
      headers: {
        'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600',
      },
    });
  } catch (error) {
    console.error('Failed to fetch RSS feeds:', error);
    // Return empty array on error, don't crash
    return NextResponse.json([], {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  }
}

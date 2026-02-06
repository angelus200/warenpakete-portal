'use client';

import { useEffect, useState } from 'react';

interface NewsItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  category?: string;
}

/**
 * Format relative time (e.g., "vor 2h", "vor 3d")
 */
function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) return 'vor <1h';
  if (diffHours < 24) return `vor ${diffHours}h`;
  if (diffDays < 30) return `vor ${diffDays}d`;
  return date.toLocaleDateString('de-DE');
}

export function ECommerceNewsTicker() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchNews() {
      try {
        const response = await fetch('/api/news');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setNews(data);
      } catch (err) {
        console.error('Failed to load news:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchNews();
  }, []);

  // Don't render if error or no news
  if (error || (!loading && news.length === 0)) {
    return null;
  }

  // Loading state
  if (loading) {
    return (
      <div className="w-full bg-gradient-to-r from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] border-b border-gold/20 py-3 overflow-hidden">
        <div className="flex items-center gap-6">
          <div className="px-4 py-1.5 bg-gold text-[#1a1a1a] font-bold text-xs uppercase tracking-wider whitespace-nowrap flex-shrink-0">
            E-Commerce News
          </div>
          <div className="flex gap-8 animate-pulse">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3 whitespace-nowrap">
                <div className="w-1.5 h-1.5 rounded-full bg-gold/30" />
                <div className="h-4 w-48 bg-gray-700/50 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Double the news items for seamless loop
  const doubledNews = [...news, ...news];

  return (
    <>
      <div className="w-full bg-gradient-to-r from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] border-b border-gold/20 py-3 overflow-hidden relative">
        <div className="flex items-center gap-6">
          {/* Badge */}
          <div className="px-4 py-1.5 bg-gold text-[#1a1a1a] font-bold text-xs uppercase tracking-wider whitespace-nowrap flex-shrink-0 z-10 relative">
            E-Commerce News
          </div>

          {/* Scrolling ticker */}
          <div className="flex-1 overflow-hidden relative">
            <div className="ticker-wrapper">
              <div className="ticker-content flex gap-8">
                {doubledNews.map((item, index) => (
                  <a
                    key={`${item.link}-${index}`}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 whitespace-nowrap group"
                  >
                    <span className="text-gold text-xs">●</span>
                    <span className="text-gray-300 text-sm group-hover:text-gold transition-colors">
                      {item.title}
                    </span>
                    <span className="text-gray-500 text-xs">
                      ({getRelativeTime(item.pubDate)})
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes ticker {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .ticker-wrapper {
          overflow: hidden;
          width: 100%;
        }

        .ticker-content {
          animation: ticker 60s linear infinite;
          will-change: transform;
        }

        .ticker-wrapper:hover .ticker-content {
          animation-play-state: paused;
        }
      `}</style>
    </>
  );
}

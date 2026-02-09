import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

interface TrackPageViewData {
  path: string;
  referrer?: string;
  sessionId: string;
  device?: string;
  duration?: number;
  userAgent?: string;
  country?: string;
}

@Injectable()
export class TrackingService {
  constructor(private prisma: PrismaService) {}

  async trackPageView(data: TrackPageViewData) {
    await this.prisma.pageView.create({
      data: {
        path: data.path,
        referrer: data.referrer || null,
        sessionId: data.sessionId,
        device: data.device || null,
        duration: data.duration || null,
        userAgent: data.userAgent || null,
        country: data.country || null,
      },
    });

    return { success: true };
  }

  async getStats(period: string = '30d') {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case 'all':
        startDate = new Date('2020-01-01');
        break;
      default: // 30d
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Alle Views im Zeitraum
    const allViews = await this.prisma.pageView.findMany({
      where: { createdAt: { gte: startDate } },
      select: {
        id: true,
        path: true,
        sessionId: true,
        device: true,
        referrer: true,
        duration: true,
        createdAt: true,
      },
    });

    const totalPageViews = allViews.length;
    const uniqueVisitors = new Set(allViews.map(v => v.sessionId)).size;
    const avgPagesPerSession = uniqueVisitors > 0 ? totalPageViews / uniqueVisitors : 0;

    // Durchschnittliche Verweildauer
    const viewsWithDuration = allViews.filter(v => v.duration !== null);
    const avgDuration = viewsWithDuration.length > 0
      ? viewsWithDuration.reduce((sum, v) => sum + (v.duration || 0), 0) / viewsWithDuration.length
      : 0;

    // Bounce Rate (Sessions mit nur 1 Seitenaufruf)
    const sessionsCount: Record<string, number> = {};
    allViews.forEach(v => {
      sessionsCount[v.sessionId] = (sessionsCount[v.sessionId] || 0) + 1;
    });
    const singlePageSessions = Object.values(sessionsCount).filter(count => count === 1).length;
    const bounceRate = uniqueVisitors > 0 ? (singlePageSessions / uniqueVisitors) * 100 : 0;

    // Top Pages
    const pageStats: Record<string, { views: number; sessions: Set<string> }> = {};
    allViews.forEach(v => {
      if (!pageStats[v.path]) {
        pageStats[v.path] = { views: 0, sessions: new Set() };
      }
      pageStats[v.path].views++;
      pageStats[v.path].sessions.add(v.sessionId);
    });

    const topPages = Object.entries(pageStats)
      .map(([path, stats]) => ({
        path,
        views: stats.views,
        uniqueVisitors: stats.sessions.size,
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);

    // Top Referrers
    const referrerStats: Record<string, number> = {};
    allViews.forEach(v => {
      if (v.referrer && v.referrer.trim() !== '') {
        referrerStats[v.referrer] = (referrerStats[v.referrer] || 0) + 1;
      }
    });

    const topReferrers = Object.entries(referrerStats)
      .map(([referrer, count]) => ({ referrer, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Device Breakdown
    const deviceBreakdown = {
      mobile: allViews.filter(v => v.device === 'mobile').length,
      tablet: allViews.filter(v => v.device === 'tablet').length,
      desktop: allViews.filter(v => v.device === 'desktop').length,
    };

    // Views per Day
    const viewsByDate: Record<string, { views: number; sessions: Set<string> }> = {};
    allViews.forEach(v => {
      const dateStr = v.createdAt.toISOString().split('T')[0];
      if (!viewsByDate[dateStr]) {
        viewsByDate[dateStr] = { views: 0, sessions: new Set() };
      }
      viewsByDate[dateStr].views++;
      viewsByDate[dateStr].sessions.add(v.sessionId);
    });

    const viewsPerDay = Object.entries(viewsByDate)
      .map(([date, stats]) => ({
        date,
        views: stats.views,
        uniqueVisitors: stats.sessions.size,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Landing Page specific
    const landingPageViews = allViews.filter(v => v.path === '/').length;
    const landingPageSessions = new Set(
      allViews.filter(v => v.path === '/').map(v => v.sessionId)
    );
    const landingPageSingleSessions = Array.from(landingPageSessions).filter(
      sid => sessionsCount[sid] === 1
    ).length;
    const landingPageBounceRate = landingPageSessions.size > 0
      ? (landingPageSingleSessions / landingPageSessions.size) * 100
      : 0;

    return {
      totalPageViews,
      uniqueVisitors,
      avgPagesPerSession: Math.round(avgPagesPerSession * 10) / 10,
      avgDuration: Math.round(avgDuration),
      bounceRate: Math.round(bounceRate * 10) / 10,
      topPages,
      topReferrers,
      deviceBreakdown,
      viewsPerDay,
      landingPageViews,
      landingPageBounceRate: Math.round(landingPageBounceRate * 10) / 10,
    };
  }
}

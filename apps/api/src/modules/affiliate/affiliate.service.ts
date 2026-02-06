import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class AffiliateService {
  constructor(private prisma: PrismaService) {}

  /**
   * Generate unique 6-character alphanumeric code
   */
  private generateCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  /**
   * Hash IP address for privacy
   */
  private hashIP(ip: string): string {
    return crypto.createHash('sha256').update(ip).digest('hex');
  }

  /**
   * Get or create affiliate link for user
   */
  async getOrCreateLink(userId: string) {
    let link = await this.prisma.affiliateLink.findFirst({
      where: { userId },
    });

    if (!link) {
      // Generate unique code
      let code = this.generateCode();
      let attempts = 0;

      while (attempts < 10) {
        const existing = await this.prisma.affiliateLink.findUnique({
          where: { code },
        });

        if (!existing) break;

        code = this.generateCode();
        attempts++;
      }

      link = await this.prisma.affiliateLink.create({
        data: {
          userId,
          code,
        },
      });
    }

    return link;
  }

  /**
   * Track affiliate click
   */
  async trackClick(code: string, ipAddress: string) {
    const link = await this.prisma.affiliateLink.findUnique({
      where: { code },
    });

    if (!link) {
      return { success: false, error: 'Invalid code' };
    }

    const ipHash = this.hashIP(ipAddress);

    await this.prisma.affiliateClick.create({
      data: {
        linkId: link.id,
        ipHash,
      },
    });

    return { success: true, code };
  }

  /**
   * Track affiliate conversion
   */
  async trackConversion(code: string, orderId: string, orderAmount: number) {
    const link = await this.prisma.affiliateLink.findUnique({
      where: { code },
    });

    if (!link) {
      return { success: false, error: 'Invalid code' };
    }

    // Check if conversion already exists
    const existing = await this.prisma.affiliateConversion.findUnique({
      where: { orderId },
    });

    if (existing) {
      return { success: false, error: 'Conversion already tracked' };
    }

    // Calculate 5% commission
    const amount = orderAmount * 0.05;

    const conversion = await this.prisma.affiliateConversion.create({
      data: {
        linkId: link.id,
        orderId,
        amount,
        status: 'PENDING',
      },
    });

    return { success: true, conversion };
  }

  /**
   * Get affiliate statistics for user
   */
  async getStats(userId: string) {
    const link = await this.prisma.affiliateLink.findFirst({
      where: { userId },
      include: {
        clicks: true,
        conversions: true,
      },
    });

    if (!link) {
      return {
        totalClicks: 0,
        totalConversions: 0,
        totalEarnings: 0,
        pendingEarnings: 0,
        approvedEarnings: 0,
        paidEarnings: 0,
      };
    }

    const totalClicks = link.clicks.length;
    const totalConversions = link.conversions.length;

    const totalEarnings = link.conversions.reduce(
      (sum, c) => sum + Number(c.amount),
      0,
    );

    const pendingEarnings = link.conversions
      .filter((c) => c.status === 'PENDING')
      .reduce((sum, c) => sum + Number(c.amount), 0);

    const approvedEarnings = link.conversions
      .filter((c) => c.status === 'APPROVED')
      .reduce((sum, c) => sum + Number(c.amount), 0);

    const paidEarnings = link.conversions
      .filter((c) => c.status === 'PAID')
      .reduce((sum, c) => sum + Number(c.amount), 0);

    return {
      totalClicks,
      totalConversions,
      conversionRate:
        totalClicks > 0
          ? ((totalConversions / totalClicks) * 100).toFixed(2)
          : '0.00',
      totalEarnings,
      pendingEarnings,
      approvedEarnings,
      paidEarnings,
    };
  }

  /**
   * Get conversions for user
   */
  async getConversions(userId: string) {
    const link = await this.prisma.affiliateLink.findFirst({
      where: { userId },
    });

    if (!link) {
      return [];
    }

    const conversions = await this.prisma.affiliateConversion.findMany({
      where: { linkId: link.id },
      include: {
        order: {
          select: {
            id: true,
            totalAmount: true,
            createdAt: true,
            user: {
              select: {
                email: true,
                company: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return conversions;
  }

  /**
   * Get all affiliates with stats (Admin)
   */
  async getAllAffiliates() {
    const links = await this.prisma.affiliateLink.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            company: true,
          },
        },
        clicks: true,
        conversions: true,
      },
    });

    return links.map((link) => ({
      id: link.id,
      code: link.code,
      user: link.user,
      totalClicks: link.clicks.length,
      totalConversions: link.conversions.length,
      totalEarnings: link.conversions.reduce(
        (sum, c) => sum + Number(c.amount),
        0,
      ),
      pendingEarnings: link.conversions
        .filter((c) => c.status === 'PENDING')
        .reduce((sum, c) => sum + Number(c.amount), 0),
      createdAt: link.createdAt,
    }));
  }

  /**
   * Update conversion status (Admin)
   */
  async updateConversionStatus(conversionId: string, status: string) {
    return this.prisma.affiliateConversion.update({
      where: { id: conversionId },
      data: { status },
    });
  }
}

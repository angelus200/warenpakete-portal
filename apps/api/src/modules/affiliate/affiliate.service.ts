import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
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
   * Track 3-tier affiliate conversion
   * Tier 1 (direct referrer): 3%
   * Tier 2 (referrer's referrer): 1%
   * Tier 3 (referrer's referrer's referrer): 1%
   *
   * Includes self-referral protection and loop detection
   */
  async trackConversion(buyerUserId: string, orderId: string, orderAmount: number) {
    // Get buyer with affiliateReferredBy chain
    const buyer = await this.prisma.user.findUnique({
      where: { id: buyerUserId },
      select: {
        id: true,
        affiliateReferredBy: true,
      },
    });

    if (!buyer?.affiliateReferredBy) {
      console.log('No affiliate referrer found for user', buyerUserId);
      return { success: false, error: 'No affiliate referrer' };
    }

    // Check if conversions already exist for this order
    const existingConversions = await this.prisma.affiliateConversion.findMany({
      where: { orderId },
    });

    if (existingConversions.length > 0) {
      console.log('Conversions already tracked for order', orderId);
      return { success: false, error: 'Conversion already tracked' };
    }

    const conversions = [];
    const visitedCodes = new Set<string>(); // Loop detection
    visitedCodes.add(buyer.id); // Prevent self-referral

    // TIER 1: Direct referrer (3%)
    let currentReferrerCode = buyer.affiliateReferredBy;

    if (!currentReferrerCode) {
      return { success: true, conversions: [] };
    }

    // Find Tier 1 affiliate link
    const tier1Link = await this.prisma.affiliateLink.findUnique({
      where: { code: currentReferrerCode },
      include: { user: true },
    });

    if (!tier1Link) {
      console.log('Tier 1 affiliate link not found for code', currentReferrerCode);
      return { success: false, error: 'Tier 1 referrer link not found' };
    }

    // Self-referral check
    if (tier1Link.userId === buyer.id) {
      console.log('Self-referral detected - user cannot refer themselves');
      return { success: false, error: 'Self-referral not allowed' };
    }

    // Loop detection
    if (visitedCodes.has(tier1Link.userId)) {
      console.log('Loop detected at Tier 1');
      return { success: true, conversions };
    }
    visitedCodes.add(tier1Link.userId);

    // Create Tier 1 conversion (3%)
    const tier1Amount = orderAmount * 0.03;
    const conversion1 = await this.prisma.affiliateConversion.create({
      data: {
        linkId: tier1Link.id,
        orderId,
        amount: tier1Amount,
        status: 'PENDING',
        tier: 1,
      },
    });
    conversions.push(conversion1);

    // TIER 2: Referrer's referrer (1%)
    const tier1User = tier1Link.user;
    if (!tier1User.affiliateReferredBy) {
      return { success: true, conversions };
    }

    const tier2Link = await this.prisma.affiliateLink.findUnique({
      where: { code: tier1User.affiliateReferredBy },
      include: { user: true },
    });

    if (!tier2Link) {
      console.log('Tier 2 affiliate link not found');
      return { success: true, conversions };
    }

    // Loop detection
    if (visitedCodes.has(tier2Link.userId)) {
      console.log('Loop detected at Tier 2');
      return { success: true, conversions };
    }
    visitedCodes.add(tier2Link.userId);

    // Create Tier 2 conversion (1%)
    const tier2Amount = orderAmount * 0.01;
    const conversion2 = await this.prisma.affiliateConversion.create({
      data: {
        linkId: tier2Link.id,
        orderId,
        amount: tier2Amount,
        status: 'PENDING',
        tier: 2,
      },
    });
    conversions.push(conversion2);

    // TIER 3: Referrer's referrer's referrer (1%)
    const tier2User = tier2Link.user;
    if (!tier2User.affiliateReferredBy) {
      return { success: true, conversions };
    }

    const tier3Link = await this.prisma.affiliateLink.findUnique({
      where: { code: tier2User.affiliateReferredBy },
      include: { user: true },
    });

    if (!tier3Link) {
      console.log('Tier 3 affiliate link not found');
      return { success: true, conversions };
    }

    // Loop detection
    if (visitedCodes.has(tier3Link.userId)) {
      console.log('Loop detected at Tier 3');
      return { success: true, conversions };
    }
    visitedCodes.add(tier3Link.userId);

    // Create Tier 3 conversion (1%)
    const tier3Amount = orderAmount * 0.01;
    const conversion3 = await this.prisma.affiliateConversion.create({
      data: {
        linkId: tier3Link.id,
        orderId,
        amount: tier3Amount,
        status: 'PENDING',
        tier: 3,
      },
    });
    conversions.push(conversion3);

    console.log(`Created ${conversions.length}-tier conversions for order ${orderId}`);
    return { success: true, conversions };
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

    // Calculate tier-specific earnings
    const tier1Earnings = link.conversions
      .filter((c) => c.tier === 1)
      .reduce((sum, c) => sum + Number(c.amount), 0);

    const tier2Earnings = link.conversions
      .filter((c) => c.tier === 2)
      .reduce((sum, c) => sum + Number(c.amount), 0);

    const tier3Earnings = link.conversions
      .filter((c) => c.tier === 3)
      .reduce((sum, c) => sum + Number(c.amount), 0);

    // Count direct referrals (tier 1 conversions)
    const directReferrals = link.conversions.filter((c) => c.tier === 1).length;

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
      tier1Earnings,
      tier2Earnings,
      tier3Earnings,
      directReferrals,
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

  /**
   * Get available balance for withdrawal
   */
  async getAvailableBalance(userId: string): Promise<number> {
    // Get user's affiliate link
    const link = await this.prisma.affiliateLink.findFirst({ where: { userId } });
    if (!link) return 0;

    // Sum APPROVED conversions
    const approvedEarnings = await this.prisma.affiliateConversion.aggregate({
      where: { linkId: link.id, status: 'APPROVED' },
      _sum: { amount: true },
    });

    // Sum non-REJECTED withdrawals (locked/committed)
    const withdrawnAmount = await this.prisma.affiliateWithdrawal.aggregate({
      where: { userId, status: { not: 'REJECTED' } },
      _sum: { amount: true },
    });

    const approved = Number(approvedEarnings._sum.amount || 0);
    const withdrawn = Number(withdrawnAmount._sum.amount || 0);
    return Math.max(0, approved - withdrawn);
  }

  /**
   * Request withdrawal
   */
  async requestWithdrawal(
    userId: string,
    amount: number,
    method: 'BANK' | 'PAYPAL',
    bankData?: { iban: string; accountHolder: string },
    paypalData?: { email: string },
  ) {
    // Validate amount > 0
    if (amount <= 0) {
      throw new BadRequestException('Betrag muss größer als 0 sein');
    }

    // Check available balance
    const availableBalance = await this.getAvailableBalance(userId);
    if (amount > availableBalance) {
      throw new BadRequestException(
        `Unzureichendes Guthaben. Verfügbar: €${(availableBalance / 100).toFixed(2)}`,
      );
    }

    // Validate payment method data
    if (method === 'BANK' && (!bankData?.iban || !bankData?.accountHolder)) {
      throw new BadRequestException('IBAN und Kontoinhaber sind erforderlich');
    }
    if (method === 'PAYPAL' && !paypalData?.email) {
      throw new BadRequestException('PayPal E-Mail-Adresse ist erforderlich');
    }

    // Create withdrawal
    return this.prisma.affiliateWithdrawal.create({
      data: {
        userId,
        amount,
        method,
        iban: bankData?.iban,
        accountHolder: bankData?.accountHolder,
        paypalEmail: paypalData?.email,
        status: 'PENDING',
      },
    });
  }

  /**
   * Get withdrawals for user
   */
  async getUserWithdrawals(userId: string) {
    return this.prisma.affiliateWithdrawal.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get all withdrawals (Admin)
   */
  async getAllWithdrawals() {
    return this.prisma.affiliateWithdrawal.findMany({
      include: {
        user: {
          select: { id: true, email: true, firstName: true, lastName: true, company: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  /**
   * Update withdrawal status (Admin)
   */
  async updateWithdrawalStatus(
    withdrawalId: string,
    status: 'APPROVED' | 'PAID' | 'REJECTED',
    adminId: string,
    notes?: string,
  ) {
    const withdrawal = await this.prisma.affiliateWithdrawal.findUnique({
      where: { id: withdrawalId },
    });

    if (!withdrawal) {
      throw new NotFoundException('Auszahlungsantrag nicht gefunden');
    }

    if (withdrawal.status !== 'PENDING' && withdrawal.status !== 'APPROVED') {
      throw new BadRequestException(`Auszahlung ist bereits ${withdrawal.status}`);
    }

    // Update withdrawal
    const updated = await this.prisma.affiliateWithdrawal.update({
      where: { id: withdrawalId },
      data: {
        status,
        processedAt: new Date(),
        processedBy: adminId,
        notes,
      },
    });

    // If PAID, mark conversions as PAID
    if (status === 'PAID') {
      const link = await this.prisma.affiliateLink.findFirst({
        where: { userId: withdrawal.userId },
      });

      if (link) {
        await this.prisma.affiliateConversion.updateMany({
          where: { linkId: link.id, status: 'APPROVED' },
          data: { status: 'PAID' },
        });
      }
    }

    return { success: true, withdrawal: updated };
  }
}

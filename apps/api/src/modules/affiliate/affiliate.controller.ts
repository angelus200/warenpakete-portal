import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Req,
  UseGuards,
  Ip,
} from '@nestjs/common';
import { AffiliateService } from './affiliate.service';
import { ClerkAuthGuard } from '../../common/guards/clerk-auth.guard';
import { AdminAuthGuard } from '../admin/admin-auth.guard';

@Controller('affiliate')
export class AffiliateController {
  constructor(private readonly affiliateService: AffiliateService) {}

  /**
   * PUBLIC: Track affiliate click
   */
  @Get('track/:code')
  async trackClick(@Param('code') code: string, @Ip() ip: string) {
    return this.affiliateService.trackClick(code, ip);
  }

  /**
   * Get or create user's affiliate link
   */
  @Get('my-link')
  @UseGuards(ClerkAuthGuard)
  async getMyLink(@Req() req) {
    const link = await this.affiliateService.getOrCreateLink(req.user.id);
    return {
      code: link.code,
      url: `https://www.ecommercerente.com/?ref=${link.code}`,
      createdAt: link.createdAt,
    };
  }

  /**
   * Get user's affiliate statistics
   */
  @Get('stats')
  @UseGuards(ClerkAuthGuard)
  async getStats(@Req() req) {
    return this.affiliateService.getStats(req.user.id);
  }

  /**
   * Get user's conversions
   */
  @Get('conversions')
  @UseGuards(ClerkAuthGuard)
  async getConversions(@Req() req) {
    return this.affiliateService.getConversions(req.user.id);
  }

  /**
   * ADMIN: Get all affiliates
   */
  @Get('admin/all')
  @UseGuards(AdminAuthGuard)
  async getAllAffiliates() {
    return this.affiliateService.getAllAffiliates();
  }

  /**
   * ADMIN: Update conversion status
   */
  @Post('admin/conversion/:id/status')
  @UseGuards(AdminAuthGuard)
  async updateConversionStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    return this.affiliateService.updateConversionStatus(id, status);
  }

  /**
   * Get available withdrawal balance
   */
  @Get('withdrawal/balance')
  @UseGuards(ClerkAuthGuard)
  async getWithdrawalBalance(@Req() req) {
    const balance = await this.affiliateService.getAvailableBalance(req.user.id);
    return {
      availableBalance: balance,
      availableBalanceFormatted: `€${(balance / 100).toFixed(2)}`,
    };
  }

  /**
   * Request withdrawal
   */
  @Post('withdrawals')
  @UseGuards(ClerkAuthGuard)
  async requestWithdrawal(@Req() req, @Body() body: {
    amount: number;
    method: 'BANK' | 'PAYPAL';
    iban?: string;
    accountHolder?: string;
    paypalEmail?: string;
  }) {
    const bankData = body.method === 'BANK'
      ? { iban: body.iban!, accountHolder: body.accountHolder! }
      : undefined;

    const paypalData = body.method === 'PAYPAL'
      ? { email: body.paypalEmail! }
      : undefined;

    return this.affiliateService.requestWithdrawal(
      req.user.id,
      body.amount,
      body.method,
      bankData,
      paypalData,
    );
  }

  /**
   * Get user's withdrawals
   */
  @Get('withdrawals')
  @UseGuards(ClerkAuthGuard)
  async getUserWithdrawals(@Req() req) {
    return this.affiliateService.getUserWithdrawals(req.user.id);
  }

  /**
   * ADMIN: Get all withdrawals
   */
  @Get('admin/withdrawals')
  @UseGuards(AdminAuthGuard)
  async getAllWithdrawals() {
    return this.affiliateService.getAllWithdrawals();
  }

  /**
   * ADMIN: Update withdrawal status
   */
  @Patch('admin/withdrawals/:id/status')
  @UseGuards(AdminAuthGuard)
  async updateWithdrawalStatus(
    @Param('id') id: string,
    @Body() body: { status: 'APPROVED' | 'PAID' | 'REJECTED'; notes?: string },
    @Req() req,
  ) {
    const adminId = req.admin?.id || 'admin';
    return this.affiliateService.updateWithdrawalStatus(
      id,
      body.status,
      adminId,
      body.notes,
    );
  }
}

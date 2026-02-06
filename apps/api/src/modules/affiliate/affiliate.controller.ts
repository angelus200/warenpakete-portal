import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Req,
  UseGuards,
  Ip,
  ForbiddenException,
} from '@nestjs/common';
import { AffiliateService } from './affiliate.service';
import { ClerkAuthGuard } from '../../common/guards/clerk-auth.guard';

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
  @UseGuards(ClerkAuthGuard)
  async getAllAffiliates(@Req() req) {
    // Check if user is admin
    if (req.user.role !== 'ADMIN') {
      throw new ForbiddenException('Admin access required');
    }
    return this.affiliateService.getAllAffiliates();
  }

  /**
   * ADMIN: Update conversion status
   */
  @Post('admin/conversion/:id/status')
  @UseGuards(ClerkAuthGuard)
  async updateConversionStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @Req() req,
  ) {
    // Check if user is admin
    if (req.user.role !== 'ADMIN') {
      throw new ForbiddenException('Admin access required');
    }
    return this.affiliateService.updateConversionStatus(id, status);
  }
}

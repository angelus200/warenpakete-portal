import { Controller, Post, Get, Body, Query, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { TrackingService } from './tracking.service';
import { TrackPageViewDto } from './dto/track-pageview.dto';
import { AdminAuthGuard } from '../admin/admin-auth.guard';

@ApiTags('tracking')
@Controller('tracking')
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  @Post('pageview')
  @ApiOperation({ summary: 'Track a page view (no auth required)' })
  async trackPageView(@Body() dto: TrackPageViewDto, @Req() req: Request) {
    // Extract userAgent from headers (first 200 chars, NO IP!)
    const userAgent = req.headers['user-agent']?.substring(0, 200) || null;

    // Extract country from Accept-Language header (first 2 chars)
    const acceptLanguage = req.headers['accept-language'];
    const country = acceptLanguage?.split(',')[0]?.split('-')[0]?.substring(0, 2)?.toUpperCase() || null;

    return this.trackingService.trackPageView({
      path: dto.path,
      referrer: dto.referrer,
      sessionId: dto.sessionId,
      device: dto.device,
      duration: dto.duration,
      userAgent,
      country,
    });
  }

  @Get('stats')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth('admin')
  @ApiOperation({ summary: 'Get tracking statistics (admin only)' })
  async getStats(@Query('period') period?: string) {
    return this.trackingService.getStats(period || '30d');
  }
}

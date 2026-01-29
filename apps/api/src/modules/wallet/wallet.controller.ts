import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('wallet')
@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get('balance')
  @ApiOperation({ summary: 'Get my wallet balance' })
  @ApiResponse({ status: 200, description: 'Returns wallet balance' })
  async getBalance(/* @CurrentUser() user: any */) {
    // TODO: Get user from auth decorator
    // For now, return placeholder
    return { balance: 0, message: 'Auth not implemented yet' };
  }

  @Get('transactions')
  @ApiOperation({ summary: 'Get my wallet transactions' })
  @ApiResponse({ status: 200, description: 'Returns list of transactions' })
  async getTransactions(
    /* @CurrentUser() user: any, */
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    // TODO: Get user from auth decorator
    return {
      transactions: [],
      total: 0,
      message: 'Auth not implemented yet',
    };
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get wallet statistics' })
  @ApiResponse({ status: 200, description: 'Returns wallet stats' })
  async getStats(/* @CurrentUser() user: any */) {
    // TODO: Get user from auth decorator
    return {
      currentBalance: 0,
      totalEarned: 0,
      totalPaidOut: 0,
      pendingPayouts: 0,
    };
  }

  @Post('payout')
  @ApiOperation({ summary: 'Request a payout' })
  @ApiResponse({ status: 201, description: 'Payout request created' })
  async requestPayout(
    /* @CurrentUser() user: any, */
    @Body() body: { amount: number; iban: string; bankName?: string },
  ) {
    // TODO: Get user from auth decorator
    return { message: 'Auth not implemented yet' };
  }

  @Get('payouts')
  @ApiOperation({ summary: 'Get my payout requests' })
  @ApiResponse({ status: 200, description: 'Returns payout requests' })
  async getPayouts(/* @CurrentUser() user: any */) {
    // TODO: Get user from auth decorator
    return [];
  }

  // Admin endpoints
  @Get('admin/payouts/pending')
  @ApiOperation({ summary: 'Get all pending payouts (Admin)' })
  @ApiResponse({ status: 200, description: 'Returns pending payouts' })
  async getAllPendingPayouts() {
    return this.walletService.getAllPendingPayouts();
  }

  @Post('admin/payouts/:id/process')
  @ApiOperation({ summary: 'Process payout request (Admin)' })
  @ApiResponse({ status: 200, description: 'Payout processed' })
  async processPayout(
    @Param('id') id: string,
    @Body() body: { approved: boolean; notes?: string; adminId: string },
  ) {
    return this.walletService.processPayout(
      id,
      body.adminId,
      body.approved,
      body.notes,
    );
  }
}

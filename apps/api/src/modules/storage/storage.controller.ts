import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { StorageService } from './storage.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('storage')
@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Get('fees')
  @ApiOperation({ summary: 'Get my storage fees' })
  @ApiResponse({ status: 200, description: 'Returns storage fees for current user' })
  async getMyFees(/* @CurrentUser() user: any */) {
    // TODO: Implement auth and get user from decorator
    // For now, return empty
    return { fees: [], total: 0, count: 0 };
  }

  @Get('fees/:orderId')
  @ApiOperation({ summary: 'Get storage fees for a specific order' })
  @ApiResponse({ status: 200, description: 'Returns storage fees for the order' })
  async getOrderFees(@Param('orderId') orderId: string) {
    return this.storageService.getOrderStorageFees(orderId);
  }

  @Get('calculate/:orderId')
  @ApiOperation({ summary: 'Calculate storage fees for an order' })
  @ApiResponse({ status: 200, description: 'Returns calculated storage fees' })
  async calculateFees(@Param('orderId') orderId: string) {
    return this.storageService.calculateStorageFees(orderId);
  }

  @Post('pickup/:orderId')
  @ApiOperation({ summary: 'Mark order as picked up (Admin only)' })
  @ApiResponse({ status: 200, description: 'Order marked as picked up' })
  async markAsPickedUp(@Param('orderId') orderId: string) {
    return this.storageService.markOrderAsPickedUp(orderId);
  }

  @Get('admin/pending')
  @ApiOperation({ summary: 'Get all pending storage fees (Admin only)' })
  @ApiResponse({ status: 200, description: 'Returns all pending storage fees' })
  async getPendingFees() {
    return this.storageService.getAllPendingFees();
  }

  @Post('admin/process')
  @ApiOperation({ summary: 'Process all storage fees (Admin only)' })
  @ApiResponse({ status: 200, description: 'Processes storage fees for all eligible orders' })
  async processAll() {
    return this.storageService.processAllStorageFees();
  }
}

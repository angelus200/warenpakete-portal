import { Controller, Get, Param, Res, UseGuards, Req, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { ClerkAuthGuard } from '../../common/guards/clerk-auth.guard';
import { PrismaService } from '../../common/prisma/prisma.service';

@ApiTags('invoices')
@Controller('invoices')
export class InvoicesController {
  constructor(
    private readonly invoicesService: InvoicesService,
    private readonly prisma: PrismaService,
  ) {}

  @Get('list')
  @ApiOperation({ summary: 'Get list of available invoices' })
  @ApiResponse({ status: 200, description: 'Returns list of available invoices' })
  async getAvailableInvoices(/* @CurrentUser() user: any */) {
    // TODO: Get user from auth decorator
    return [];
  }

  @Get('monthly/:year/:month')
  @ApiOperation({ summary: 'Download monthly invoice PDF' })
  @ApiResponse({ status: 200, description: 'Returns PDF file' })
  async downloadMonthlyInvoice(
    @Param('year') year: string,
    @Param('month') month: string,
    @Res() res: Response,
    /* @CurrentUser() user: any */
  ) {
    // TODO: Get user from auth decorator
    // For now, return error
    res.status(401).json({ message: 'Auth not implemented yet' });
  }

  @Get('order/:orderId')
  @UseGuards(ClerkAuthGuard)
  @ApiOperation({ summary: 'Download order invoice PDF' })
  @ApiResponse({ status: 200, description: 'Returns PDF file' })
  async getOrderInvoice(
    @Param('orderId') orderId: string,
    @Req() req,
    @Res() res: Response,
  ) {
    // Check if user has access to this order
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.userId !== req.user.id && req.user.role !== 'ADMIN') {
      throw new ForbiddenException('Access denied');
    }

    return this.invoicesService.generateOrderInvoice(orderId, res);
  }
}

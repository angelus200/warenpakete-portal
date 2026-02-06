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
  @UseGuards(ClerkAuthGuard)
  @ApiOperation({ summary: 'Get list of available invoices' })
  @ApiResponse({ status: 200, description: 'Returns list of available invoices' })
  async getAvailableInvoices(@Req() req) {
    return this.invoicesService.getAvailableInvoices(req.user.id);
  }

  @Get('monthly/:year/:month')
  @UseGuards(ClerkAuthGuard)
  @ApiOperation({ summary: 'Download monthly invoice PDF' })
  @ApiResponse({ status: 200, description: 'Returns PDF file' })
  async downloadMonthlyInvoice(
    @Param('year') year: string,
    @Param('month') month: string,
    @Req() req,
    @Res() res: Response,
  ) {
    return this.invoicesService.generateMonthlyInvoice(
      req.user.id,
      parseInt(year),
      parseInt(month),
      res,
    );
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

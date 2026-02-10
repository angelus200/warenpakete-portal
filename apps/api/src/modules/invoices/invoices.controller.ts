import {
  Controller,
  Post,
  Get,
  Param,
  Res,
  UseGuards,
  Req,
} from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { ClerkAuthGuard } from '../../common/guards/clerk-auth.guard';
import { AdminAuthGuard } from '../admin/admin-auth.guard';
import { Response } from 'express';

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post('order/:orderId/invoice')
  @UseGuards(ClerkAuthGuard)
  async createInvoice(@Param('orderId') orderId: string, @Req() req: any) {
    // Verify user owns this order
    const order = await this.invoicesService['prisma'].order.findUnique({
      where: { id: orderId },
      select: { userId: true },
    });

    if (!order || order.userId !== req.userId) {
      throw new Error('Unauthorized');
    }

    return this.invoicesService.createInvoice(orderId);
  }

  @Post('order/:orderId/delivery-note')
  @UseGuards(ClerkAuthGuard)
  async createDeliveryNote(@Param('orderId') orderId: string, @Req() req: any) {
    // Verify user owns this order
    const order = await this.invoicesService['prisma'].order.findUnique({
      where: { id: orderId },
      select: { userId: true },
    });

    if (!order || order.userId !== req.userId) {
      throw new Error('Unauthorized');
    }

    return this.invoicesService.createDeliveryNote(orderId);
  }

  @Get('order/:orderId')
  @UseGuards(ClerkAuthGuard)
  async getInvoicesForOrder(@Param('orderId') orderId: string, @Req() req: any) {
    // Verify user owns this order
    const order = await this.invoicesService['prisma'].order.findUnique({
      where: { id: orderId },
      select: { userId: true },
    });

    if (!order || order.userId !== req.userId) {
      throw new Error('Unauthorized');
    }

    return this.invoicesService.getInvoicesForOrder(orderId);
  }

  @Get(':id/download')
  @UseGuards(ClerkAuthGuard)
  async downloadInvoice(
    @Param('id') invoiceId: string,
    @Res() res: Response,
    @Req() req: any,
  ) {
    // Get invoice and verify ownership
    const invoice = await this.invoicesService['prisma'].invoice.findUnique({
      where: { id: invoiceId },
      include: { order: { select: { userId: true } } },
    });

    if (!invoice || invoice.order.userId !== req.userId) {
      throw new Error('Unauthorized');
    }

    const pdfBuffer = await this.invoicesService.downloadInvoicePdf(invoiceId);

    const filename =
      invoice.type === 'INVOICE'
        ? `rechnung-${invoice.invoiceNumber}.pdf`
        : `lieferschein-${invoice.invoiceNumber}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(pdfBuffer);
  }

  @Get()
  @UseGuards(AdminAuthGuard)
  async getAllInvoices() {
    return this.invoicesService.getAllInvoices();
  }
}

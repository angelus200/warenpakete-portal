import { Controller, Get, Param, Res } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('invoices')
@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

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
}

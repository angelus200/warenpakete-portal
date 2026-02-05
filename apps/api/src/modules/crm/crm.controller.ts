import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CrmService } from './crm.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { AdminAuthGuard } from '../admin/admin-auth.guard';
import { CurrentAdmin } from '../admin/decorators/current-admin.decorator';

@ApiTags('crm')
@ApiBearerAuth()
@Controller('crm')
@UseGuards(AdminAuthGuard)
export class CrmController {
  constructor(private readonly crmService: CrmService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get CRM dashboard KPIs' })
  getDashboard() {
    return this.crmService.getDashboardKpis();
  }

  @Get('customers')
  @ApiOperation({ summary: 'Get customer list with filters' })
  getCustomers(
    @Query('status') status?: string,
    @Query('search') search?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.crmService.getCustomers({
      status,
      search,
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined,
    });
  }

  @Get('customers/:id')
  @ApiOperation({ summary: 'Get customer details by ID' })
  getCustomerById(@Param('id') id: string) {
    return this.crmService.getCustomerById(id);
  }

  @Post('customers/:id/notes')
  @ApiOperation({ summary: 'Create customer note' })
  createCustomerNote(
    @Param('id') customerId: string,
    @Body() createNoteDto: CreateNoteDto,
    @CurrentAdmin() admin: { id: string },
  ) {
    return this.crmService.createCustomerNote(
      customerId,
      admin.id,
      createNoteDto,
    );
  }

  @Get('orders/pipeline')
  @ApiOperation({ summary: 'Get orders pipeline (grouped by status)' })
  getOrdersPipeline() {
    return this.crmService.getOrdersPipeline();
  }

  @Get('orders')
  @ApiOperation({ summary: 'Get orders list with filters' })
  getOrders(
    @Query('status') status?: string,
    @Query('search') search?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.crmService.getOrders({
      status,
      search,
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined,
    });
  }

  @Get('commissions')
  @ApiOperation({ summary: 'Get commissions list' })
  getCommissions(@Query('status') status?: string) {
    return this.crmService.getCommissions({ status });
  }

  @Get('commissions/stats')
  @ApiOperation({ summary: 'Get commission statistics' })
  getCommissionStats() {
    return this.crmService.getCommissionStats();
  }

  @Get('storage')
  @ApiOperation({ summary: 'Get storage overview' })
  getStorage() {
    return this.crmService.getStorage();
  }

  @Get('storage/fees')
  @ApiOperation({ summary: 'Calculate storage fees' })
  calculateStorageFees() {
    return this.crmService.calculateStorageFees();
  }

  @Get('fulfillment-chain')
  @ApiOperation({ summary: 'Get fulfillment chain status' })
  getFulfillmentChain(@Query('orderId') orderId?: string) {
    return this.crmService.getFulfillmentChain(orderId);
  }
}

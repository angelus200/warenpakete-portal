import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FunnelService } from './funnel.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { CreateConsultantDto } from './dto/create-consultant.dto';
import { UpdateConsultantDto } from './dto/update-consultant.dto';
import { AdminAuthGuard } from '../admin/admin-auth.guard';

@ApiTags('funnel')
@Controller('funnel')
export class FunnelController {
  constructor(private readonly funnelService: FunnelService) {}

  // ===== PUBLIC ENDPOINTS =====

  @Post('leads')
  @ApiOperation({ summary: 'Create new lead from funnel (PUBLIC)' })
  createLead(@Body() createLeadDto: CreateLeadDto) {
    return this.funnelService.createLead(createLeadDto);
  }

  // ===== ADMIN ENDPOINTS =====

  @Get('leads')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all leads with filters (ADMIN)' })
  getLeads(
    @Query('status') status?: string,
    @Query('isQualified') isQualified?: string,
    @Query('consultantId') consultantId?: string,
    @Query('search') search?: string,
  ) {
    return this.funnelService.getLeads({
      status,
      isQualified: isQualified === 'true' ? true : isQualified === 'false' ? false : undefined,
      consultantId,
      search,
    });
  }

  @Get('leads/stats')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get lead statistics (ADMIN)' })
  getLeadStats() {
    return this.funnelService.getLeadStats();
  }

  @Get('leads/:id')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get lead by ID (ADMIN)' })
  getLeadById(@Param('id') id: string) {
    return this.funnelService.getLeadById(id);
  }

  @Patch('leads/:id')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update lead (ADMIN)' })
  updateLead(@Param('id') id: string, @Body() updateLeadDto: UpdateLeadDto) {
    return this.funnelService.updateLead(id, updateLeadDto);
  }

  // ===== CONSULTANT ENDPOINTS (ADMIN) =====

  @Get('consultants')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all consultants (ADMIN)' })
  getConsultants() {
    return this.funnelService.getConsultants();
  }

  @Post('consultants')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create consultant (ADMIN)' })
  createConsultant(@Body() createConsultantDto: CreateConsultantDto) {
    return this.funnelService.createConsultant(createConsultantDto);
  }

  @Get('consultants/:id')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get consultant by ID (ADMIN)' })
  getConsultantById(@Param('id') id: string) {
    return this.funnelService.getConsultantById(id);
  }

  @Patch('consultants/:id')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update consultant (ADMIN)' })
  updateConsultant(
    @Param('id') id: string,
    @Body() updateConsultantDto: UpdateConsultantDto,
  ) {
    return this.funnelService.updateConsultant(id, updateConsultantDto);
  }

  @Delete('consultants/:id')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete consultant (soft delete) (ADMIN)' })
  deleteConsultant(@Param('id') id: string) {
    return this.funnelService.deleteConsultant(id);
  }
}

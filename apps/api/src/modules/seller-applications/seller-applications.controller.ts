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
import { SkipThrottle } from '@nestjs/throttler';
import { SellerApplicationsService } from './seller-applications.service';
import { CreateSellerApplicationDto } from './dto/create-seller-application.dto';
import { UpdateSellerApplicationDto } from './dto/update-seller-application.dto';
import { AdminAuthGuard } from '../admin/admin-auth.guard';

@ApiTags('seller-applications')
@Controller('seller-applications')
export class SellerApplicationsController {
  constructor(private readonly service: SellerApplicationsService) {}

  // ===== PUBLIC =====

  @Post()
  @SkipThrottle()
  @ApiOperation({ summary: 'Submit seller application (PUBLIC)' })
  create(@Body() dto: CreateSellerApplicationDto) {
    return this.service.create(dto);
  }

  // ===== ADMIN =====

  @Get()
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all seller applications (ADMIN)' })
  findAll(@Query('status') status?: string) {
    return this.service.findAll(status);
  }

  @Get(':id')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get seller application by ID (ADMIN)' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update status / admin notes (ADMIN)' })
  update(@Param('id') id: string, @Body() dto: UpdateSellerApplicationDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete seller application (ADMIN)' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}

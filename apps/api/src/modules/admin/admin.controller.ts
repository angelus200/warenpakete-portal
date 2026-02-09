import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AdminService } from './admin.service';
import { AdminLoginDto } from './dto/admin-login.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { TriggerPayoutDto } from './dto/trigger-payout.dto';
import { AdminAuthGuard } from './admin-auth.guard';

@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('login')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Admin login - returns JWT token' })
  async login(@Body() dto: AdminLoginDto) {
    return this.adminService.login(dto.email, dto.password);
  }

  @Get('dashboard')
  @ApiBearerAuth('admin')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'Get dashboard statistics' })
  async getDashboard() {
    return this.adminService.getDashboardStats();
  }

  @Get('contracts')
  @ApiBearerAuth('admin')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'Get all commission contracts' })
  async getAllContracts() {
    return this.adminService.getAllContracts();
  }

  @Get('contracts/:id')
  @ApiBearerAuth('admin')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'Get single contract with details' })
  async getContract(@Param('id') id: string) {
    return this.adminService.getContractById(id);
  }

  @Patch('contracts/:id')
  @ApiBearerAuth('admin')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'Update contract status and/or sales price' })
  async updateContract(
    @Param('id') id: string,
    @Body() dto: UpdateContractDto,
  ) {
    return this.adminService.updateContract(id, dto);
  }

  @Post('contracts/:id/payout')
  @ApiBearerAuth('admin')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'Trigger payout for sold contract' })
  async triggerPayout(
    @Param('id') id: string,
    @Body() dto: TriggerPayoutDto,
  ) {
    return this.adminService.triggerPayout(id, dto.notes);
  }

  @Get('users')
  @ApiBearerAuth('admin')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'Get all users' })
  async getAllUsers() {
    return this.adminService.getAllUsers();
  }

  @Patch('users/:id/role')
  @ApiBearerAuth('admin')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'Update user role' })
  async updateUserRole(
    @Param('id') id: string,
    @Body() dto: { role: string },
  ) {
    return this.adminService.updateUserRole(id, dto.role);
  }

  @Get('products')
  @ApiBearerAuth('admin')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'Get all products' })
  async getAllProducts() {
    return this.adminService.getAllProducts();
  }

  @Get('analytics')
  @ApiBearerAuth('admin')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'Get marketing analytics and statistics' })
  async getAnalytics() {
    return this.adminService.getAnalytics();
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { KnowledgeService } from './knowledge.service';
import { CreateKnowledgeProductDto } from './dto/create-knowledge-product.dto';
import { UpdateKnowledgeProductDto } from './dto/update-knowledge-product.dto';
import { ClerkAuthGuard } from '../../common/guards/clerk-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('knowledge')
@Controller('knowledge')
export class KnowledgeController {
  constructor(private readonly knowledgeService: KnowledgeService) {}

  @Get()
  @ApiOperation({ summary: 'Get all active knowledge products' })
  findAllActive() {
    return this.knowledgeService.findAllActive();
  }

  @Get('my-purchases')
  @ApiBearerAuth()
  @UseGuards(ClerkAuthGuard)
  @ApiOperation({ summary: 'Get my purchased products' })
  getMyPurchases(@Req() req: any) {
    return this.knowledgeService.getMyPurchases(req.user.clerkId);
  }

  @Get('admin/all')
  @ApiBearerAuth()
  @UseGuards(ClerkAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all products (Admin only)' })
  findAllForAdmin() {
    return this.knowledgeService.findAllForAdmin();
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(ClerkAuthGuard)
  @ApiOperation({ summary: 'Get product with purchase status' })
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.knowledgeService.findOneWithPurchaseStatus(id, req.user?.clerkId);
  }

  @Post(':id/purchase')
  @ApiBearerAuth()
  @UseGuards(ClerkAuthGuard)
  @ApiOperation({ summary: 'Purchase a knowledge product' })
  purchaseProduct(@Param('id') id: string, @Req() req: any) {
    return this.knowledgeService.purchaseProduct(id, req.user.clerkId);
  }

  @Get(':id/download')
  @ApiBearerAuth()
  @UseGuards(ClerkAuthGuard)
  @ApiOperation({ summary: 'Get download URL for purchased product' })
  getDownloadUrl(@Param('id') id: string, @Req() req: any) {
    return this.knowledgeService.getDownloadUrl(id, req.user.clerkId);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(ClerkAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create knowledge product (Admin only)' })
  create(@Body() createDto: CreateKnowledgeProductDto) {
    return this.knowledgeService.create(createDto);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(ClerkAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update knowledge product (Admin only)' })
  update(@Param('id') id: string, @Body() updateDto: UpdateKnowledgeProductDto) {
    return this.knowledgeService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(ClerkAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Soft delete knowledge product (Admin only)' })
  remove(@Param('id') id: string) {
    return this.knowledgeService.softDelete(id);
  }
}

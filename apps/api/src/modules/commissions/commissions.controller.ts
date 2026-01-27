import {
  Controller,
  Get,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CommissionsService } from './commissions.service';
import { ClerkAuthGuard } from '../../common/guards/clerk-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('commissions')
@ApiBearerAuth()
@Controller('commissions')
@UseGuards(ClerkAuthGuard, RolesGuard)
export class CommissionsController {
  constructor(private readonly commissionsService: CommissionsService) {}

  @Get('reseller/:resellerId')
  @ApiOperation({ summary: "Get reseller's commissions" })
  findByReseller(@Param('resellerId') resellerId: string) {
    return this.commissionsService.findByReseller(resellerId);
  }

  @Get('reseller/:resellerId/total')
  @ApiOperation({ summary: 'Get total earnings for reseller' })
  getTotalEarnings(@Param('resellerId') resellerId: string) {
    return this.commissionsService.getTotalEarnings(resellerId);
  }

  @Get('pending')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all pending commissions (Admin only)' })
  findPending() {
    return this.commissionsService.findPending();
  }

  @Patch(':id/pay')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Mark commission as paid (Admin only)' })
  markAsPaid(@Param('id') id: string) {
    return this.commissionsService.markAsPaid(id);
  }
}

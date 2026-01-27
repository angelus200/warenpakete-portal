import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { ClerkAuthGuard } from '../../common/guards/clerk-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('orders')
@ApiBearerAuth()
@Controller('orders')
@UseGuards(ClerkAuthGuard, RolesGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Create order' })
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @CurrentUser() user: { clerkId: string },
  ) {
    const userRecord = await this.ordersService['prisma'].user.findUnique({
      where: { clerkId: user.clerkId },
    });
    return this.ordersService.create(createOrderDto, userRecord.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all orders (own orders or all for Admin)' })
  async findAll(@CurrentUser() user: { clerkId: string }) {
    const userRecord = await this.ordersService['prisma'].user.findUnique({
      where: { clerkId: user.clerkId },
    });
    const isAdmin = userRecord.role === UserRole.ADMIN;
    return this.ordersService.findAll(
      isAdmin ? undefined : userRecord.id,
      isAdmin,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order by ID' })
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: { clerkId: string },
  ) {
    const userRecord = await this.ordersService['prisma'].user.findUnique({
      where: { clerkId: user.clerkId },
    });
    const isAdmin = userRecord.role === UserRole.ADMIN;
    return this.ordersService.findOne(
      id,
      isAdmin ? undefined : userRecord.id,
      isAdmin,
    );
  }

  @Patch(':id/status')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update order status (Admin only)' })
  updateStatus(
    @Param('id') id: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateStatus(id, updateOrderStatusDto);
  }
}

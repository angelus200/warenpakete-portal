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
import { UsersService } from '../users/users.service';
import { Clerk } from '@clerk/backend';

@ApiTags('orders')
@ApiBearerAuth()
@Controller('orders')
@UseGuards(ClerkAuthGuard, RolesGuard)
export class OrdersController {
  private clerk = Clerk({ secretKey: process.env.CLERK_SECRET_KEY });

  constructor(
    private readonly ordersService: OrdersService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create order' })
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @CurrentUser() user: { clerkId: string },
  ) {
    // Try to find existing user
    let userRecord = await this.usersService.findByClerkId(user.clerkId);

    // If user doesn't exist, create from Clerk data
    if (!userRecord) {
      console.log('⚠️ User not found in DB, creating from Clerk:', user.clerkId);

      try {
        const clerkUser = await this.clerk.users.getUser(user.clerkId);
        userRecord = await this.usersService.syncWithClerk(user.clerkId, clerkUser);
        console.log('✅ User created successfully:', userRecord.id);
      } catch (error) {
        console.error('❌ Failed to sync user from Clerk:', error);
        throw error;
      }
    }

    return this.ordersService.create(createOrderDto, userRecord.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all orders (own orders or all for Admin)' })
  async findAll(@CurrentUser() user: { clerkId: string }) {
    let userRecord = await this.usersService.findByClerkId(user.clerkId);

    if (!userRecord) {
      const clerkUser = await this.clerk.users.getUser(user.clerkId);
      userRecord = await this.usersService.syncWithClerk(user.clerkId, clerkUser);
    }

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
    let userRecord = await this.usersService.findByClerkId(user.clerkId);

    if (!userRecord) {
      const clerkUser = await this.clerk.users.getUser(user.clerkId);
      userRecord = await this.usersService.syncWithClerk(user.clerkId, clerkUser);
    }

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

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Headers,
  RawBodyRequest,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ClerkAuthGuard } from '../../common/guards/clerk-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';
import { Request } from 'express';
import { Webhook } from 'svix';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(ClerkAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all users (Admin only)' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  async getProfile(@CurrentUser() user: { clerkId: string }) {
    return this.usersService.findByClerkId(user.clerkId);
  }

  @Post('onboarding')
  @ApiOperation({ summary: 'Complete B2B onboarding' })
  async completeOnboarding(
    @CurrentUser() user: { clerkId: string },
    @Body() onboardingData: {
      companyName: string;
      vatId: string;
      street: string;
      zip: string;
      city: string;
      country: string;
    },
  ) {
    const dbUser = await this.usersService.findByClerkId(user.clerkId);
    return this.usersService.update(dbUser.id, {
      companyName: onboardingData.companyName,
      company: onboardingData.companyName,
      vatId: onboardingData.vatId,
      companyStreet: onboardingData.street,
      companyZip: onboardingData.zip,
      companyCity: onboardingData.city,
      companyCountry: onboardingData.country,
      isBusinessCustomer: true,
      acceptedB2BTermsAt: new Date(),
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete user (Admin only)' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Clerk webhook for user sync' })
  async handleWebhook(
    @Headers('svix-id') svixId: string,
    @Headers('svix-timestamp') svixTimestamp: string,
    @Headers('svix-signature') svixSignature: string,
    @Req() request: RawBodyRequest<Request>,
  ) {
    // Verify webhook signature
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

    if (!webhookSecret) {
      throw new BadRequestException('CLERK_WEBHOOK_SECRET not configured');
    }

    const wh = new Webhook(webhookSecret);
    let payload: any;

    try {
      payload = wh.verify(request.rawBody.toString(), {
        'svix-id': svixId,
        'svix-timestamp': svixTimestamp,
        'svix-signature': svixSignature,
      }) as any;
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      throw new BadRequestException('Invalid webhook signature');
    }

    const { type, data } = payload;

    switch (type) {
      case 'user.created':
      case 'user.updated':
        await this.usersService.syncWithClerk(data.id, data);
        break;
      case 'user.deleted':
        await this.usersService.removeByClerkId(data.id);
        break;
      default:
    }

    return { received: true };
  }

  @Get('me/make-admin')
  @ApiOperation({ summary: 'Make current user admin (DEV ONLY - Remove in production!)' })
  async makeAdmin(@CurrentUser() user: { clerkId: string }) {
    const dbUser = await this.usersService.findByClerkId(user.clerkId);
    return this.usersService.update(dbUser.id, { role: UserRole.ADMIN });
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ContractsService } from './contracts.service';
import { CreateFromOrderDto } from './dto/create-from-order.dto';
import { SignContractDto } from './dto/sign-contract.dto';
import { ClerkAuthGuard } from '../../common/guards/clerk-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UsersService } from '../users/users.service';
import { Clerk } from '@clerk/backend';

@ApiTags('contracts')
@ApiBearerAuth()
@Controller('contracts')
@UseGuards(ClerkAuthGuard, RolesGuard)
export class ContractsController {
  private clerk = Clerk({ secretKey: process.env.CLERK_SECRET_KEY });

  constructor(
    private readonly contractsService: ContractsService,
    private readonly usersService: UsersService,
  ) {}

  @Post('create-from-order')
  @ApiOperation({ summary: 'Create contract from order' })
  async createFromOrder(
    @Body() dto: CreateFromOrderDto,
    @CurrentUser() user: { clerkId: string },
  ) {
    let userRecord = await this.usersService.findByClerkId(user.clerkId);

    if (!userRecord) {
      const clerkUser = await this.clerk.users.getUser(user.clerkId);
      userRecord = await this.usersService.syncWithClerk(user.clerkId, clerkUser);
    }

    return this.contractsService.createFromOrder(dto.orderId, userRecord.id, {
      iban: dto.iban,
      bic: dto.bic,
      accountHolder: dto.accountHolder,
    });
  }

  @Post(':id/sign')
  @ApiOperation({ summary: 'Sign contract' })
  async signContract(
    @Param('id') contractId: string,
    @Body() dto: SignContractDto,
    @CurrentUser() user: { clerkId: string },
  ) {
    let userRecord = await this.usersService.findByClerkId(user.clerkId);

    if (!userRecord) {
      const clerkUser = await this.clerk.users.getUser(user.clerkId);
      userRecord = await this.usersService.syncWithClerk(user.clerkId, clerkUser);
    }

    return this.contractsService.signContract(
      contractId,
      userRecord.id,
      dto.signatureData,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all contracts for current user' })
  async findAllByUser(@CurrentUser() user: { clerkId: string }) {
    let userRecord = await this.usersService.findByClerkId(user.clerkId);

    if (!userRecord) {
      const clerkUser = await this.clerk.users.getUser(user.clerkId);
      userRecord = await this.usersService.syncWithClerk(user.clerkId, clerkUser);
    }

    return this.contractsService.findAllByUser(userRecord.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get contract by ID' })
  async findOne(
    @Param('id') contractId: string,
    @CurrentUser() user: { clerkId: string },
  ) {
    let userRecord = await this.usersService.findByClerkId(user.clerkId);

    if (!userRecord) {
      const clerkUser = await this.clerk.users.getUser(user.clerkId);
      userRecord = await this.usersService.syncWithClerk(user.clerkId, clerkUser);
    }

    return this.contractsService.findOne(contractId, userRecord.id);
  }

  @Get(':id/text')
  @ApiOperation({ summary: 'Get contract text' })
  async getContractText(
    @Param('id') contractId: string,
    @CurrentUser() user: { clerkId: string },
  ) {
    let userRecord = await this.usersService.findByClerkId(user.clerkId);

    if (!userRecord) {
      const clerkUser = await this.clerk.users.getUser(user.clerkId);
      userRecord = await this.usersService.syncWithClerk(user.clerkId, clerkUser);
    }

    const contract = await this.contractsService.findOne(contractId, userRecord.id);
    return {
      text: this.contractsService.getContractText(contract, contract.user),
    };
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { nanoid } from 'nanoid';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    // Generate unique referral code
    const referralCode = nanoid(10);

    // If referredBy is provided, validate it exists
    if (createUserDto.referredBy) {
      const referrer = await this.prisma.user.findUnique({
        where: { referralCode: createUserDto.referredBy },
      });
      if (!referrer) {
        throw new NotFoundException('Invalid referral code');
      }
    }

    return this.prisma.user.create({
      data: {
        ...createUserDto,
        referralCode,
      },
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        company: true,
        role: true,
        walletBalance: true,
        createdAt: true,
      },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        orders: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
        commissionsEarned: {
          where: { status: 'PENDING' },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByClerkId(clerkId: string) {
    return this.prisma.user.findUnique({
      where: { clerkId },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async remove(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return this.prisma.user.delete({ where: { id } });
  }

  async syncWithClerk(clerkId: string, clerkData: any) {
    const existingUser = await this.findByClerkId(clerkId);

    if (existingUser) {
      return this.prisma.user.update({
        where: { clerkId },
        data: {
          email: clerkData.emailAddresses[0]?.emailAddress,
          firstName: clerkData.firstName,
          lastName: clerkData.lastName,
        },
      });
    }

    return this.create({
      clerkId,
      email: clerkData.emailAddresses[0]?.emailAddress,
      firstName: clerkData.firstName,
      lastName: clerkData.lastName,
    });
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateCommissionDto } from './dto/create-commission.dto';
import { CommissionStatus, UserRole } from '@prisma/client';

@Injectable()
export class CommissionsService {
  private readonly COMMISSION_RATE = 0.20; // 20%

  constructor(private prisma: PrismaService) {}

  async create(createCommissionDto: CreateCommissionDto) {
    return this.prisma.commission.create({
      data: createCommissionDto,
    });
  }

  async findByReseller(resellerId: string) {
    return this.prisma.commission.findMany({
      where: { resellerId },
      include: {
        order: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getTotalEarnings(resellerId: string) {
    const result = await this.prisma.commission.aggregate({
      where: { resellerId },
      _sum: {
        amount: true,
      },
    });

    const paidResult = await this.prisma.commission.aggregate({
      where: {
        resellerId,
        status: CommissionStatus.PAID,
      },
      _sum: {
        amount: true,
      },
    });

    const pendingResult = await this.prisma.commission.aggregate({
      where: {
        resellerId,
        status: CommissionStatus.PENDING,
      },
      _sum: {
        amount: true,
      },
    });

    return {
      total: result._sum.amount || 0,
      paid: paidResult._sum.amount || 0,
      pending: pendingResult._sum.amount || 0,
    };
  }

  async findPending() {
    return this.prisma.commission.findMany({
      where: { status: CommissionStatus.PENDING },
      include: {
        reseller: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            referralCode: true,
          },
        },
        order: {
          select: {
            id: true,
            totalAmount: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markAsPaid(id: string) {
    const commission = await this.prisma.commission.findUnique({
      where: { id },
    });

    if (!commission) {
      throw new NotFoundException(`Commission with ID ${id} not found`);
    }

    return this.prisma.commission.update({
      where: { id },
      data: {
        status: CommissionStatus.PAID,
        paidAt: new Date(),
      },
    });
  }

  async calculateCommission(orderId: string, totalAmount: number) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: true,
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    if (!order.user.referredBy) {
      return null;
    }

    const referrer = await this.prisma.user.findUnique({
      where: { referralCode: order.user.referredBy },
    });

    if (!referrer || referrer.role !== UserRole.RESELLER) {
      return null;
    }

    const commissionAmount = totalAmount * this.COMMISSION_RATE;

    const existingCommission = await this.prisma.commission.findUnique({
      where: { orderId },
    });

    if (existingCommission) {
      return existingCommission;
    }

    return this.create({
      orderId,
      resellerId: referrer.id,
      amount: commissionAmount,
      status: CommissionStatus.PENDING,
    });
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class StorageService {
  private readonly FREE_STORAGE_DAYS = 14;
  private readonly DAILY_FEE_PER_PALLET = 0.5; // €0.50 per pallet per day

  constructor(private prisma: PrismaService) {}

  /**
   * Calculate storage fees for a specific order
   */
  async calculateStorageFees(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        storageFees: true,
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    // Only calculate for paid orders
    if (order.status !== OrderStatus.PAID || !order.paidAt) {
      return {
        orderId,
        daysInStorage: 0,
        chargeableDays: 0,
        totalFees: 0,
        message: 'Order is not paid yet',
      };
    }

    // If already picked up, no fees
    if (order.pickedUpAt) {
      const existingFees = order.storageFees.reduce(
        (sum, fee) => sum + Number(fee.amount),
        0,
      );
      return {
        orderId,
        pickedUpAt: order.pickedUpAt,
        totalFees: existingFees,
        message: 'Order already picked up',
      };
    }

    // Calculate total pallet count for this order
    const totalPallets = order.items.reduce(
      (sum, item) => sum + item.product.palletCount * item.quantity,
      0,
    );

    // Calculate days in storage
    const now = new Date();
    const daysSincePaid = Math.floor(
      (now.getTime() - order.paidAt.getTime()) / (1000 * 60 * 60 * 24),
    );

    // Calculate chargeable days (after free period)
    const chargeableDays = Math.max(0, daysSincePaid - this.FREE_STORAGE_DAYS);

    // Calculate already charged days
    const alreadyChargedDays = order.storageFees.reduce(
      (sum, fee) => sum + fee.daysCharged,
      0,
    );

    // Days we need to charge for
    const daysToCharge = chargeableDays - alreadyChargedDays;

    if (daysToCharge <= 0) {
      return {
        orderId,
        daysInStorage: daysSincePaid,
        chargeableDays,
        alreadyChargedDays,
        daysToCharge: 0,
        totalFees: 0,
        message:
          daysSincePaid < this.FREE_STORAGE_DAYS
            ? `${this.FREE_STORAGE_DAYS - daysSincePaid} days of free storage remaining`
            : 'All fees already charged',
      };
    }

    // Calculate new fees
    const newFees = totalPallets * this.DAILY_FEE_PER_PALLET * daysToCharge;

    return {
      orderId,
      daysInStorage: daysSincePaid,
      freeDays: this.FREE_STORAGE_DAYS,
      chargeableDays,
      alreadyChargedDays,
      daysToCharge,
      totalPallets,
      dailyRate: this.DAILY_FEE_PER_PALLET,
      newFees,
      totalFeesCharged:
        order.storageFees.reduce((sum, fee) => sum + Number(fee.amount), 0) +
        newFees,
    };
  }

  /**
   * Create storage fee record for an order
   */
  async createStorageFee(orderId: string) {
    const calculation = await this.calculateStorageFees(orderId);

    if (!calculation.daysToCharge || calculation.daysToCharge <= 0) {
      return null;
    }

    const storageFee = await this.prisma.storageFee.create({
      data: {
        orderId,
        amount: calculation.newFees,
        palletCount: calculation.totalPallets,
        daysCharged: calculation.daysToCharge,
      },
    });

    return storageFee;
  }

  /**
   * Get all unpaid storage fees for a user
   */
  async getUnpaidStorageFees(userId: string) {
    const fees = await this.prisma.storageFee.findMany({
      where: {
        order: {
          userId,
        },
        paidAt: null,
      },
      include: {
        order: {
          include: {
            items: {
              include: {
                product: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const total = fees.reduce((sum, fee) => sum + Number(fee.amount), 0);

    return {
      fees,
      total,
      count: fees.length,
    };
  }

  /**
   * Get all storage fees for an order
   */
  async getOrderStorageFees(orderId: string) {
    const fees = await this.prisma.storageFee.findMany({
      where: { orderId },
      orderBy: { createdAt: 'desc' },
    });

    const total = fees.reduce((sum, fee) => sum + Number(fee.amount), 0);
    const unpaid = fees
      .filter(f => !f.paidAt)
      .reduce((sum, fee) => sum + Number(fee.amount), 0);

    return {
      fees,
      total,
      unpaid,
      count: fees.length,
    };
  }

  /**
   * Mark order as picked up (stops generating fees)
   */
  async markOrderAsPickedUp(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    if (order.pickedUpAt) {
      throw new Error('Order already marked as picked up');
    }

    return this.prisma.order.update({
      where: { id: orderId },
      data: {
        pickedUpAt: new Date(),
      },
    });
  }

  /**
   * Mark storage fee as paid
   */
  async markFeeAsPaid(feeId: string) {
    return this.prisma.storageFee.update({
      where: { id: feeId },
      data: {
        paidAt: new Date(),
      },
    });
  }

  /**
   * Get all pending storage fees (Admin)
   */
  async getAllPendingFees() {
    const fees = await this.prisma.storageFee.findMany({
      where: { paidAt: null },
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

    const total = fees.reduce((sum, fee) => sum + Number(fee.amount), 0);

    return {
      fees,
      total,
      count: fees.length,
    };
  }

  /**
   * Calculate and create storage fees for all eligible orders
   * (To be called by cron job daily)
   */
  async processAllStorageFees() {
    const eligibleOrders = await this.prisma.order.findMany({
      where: {
        status: OrderStatus.PAID,
        paidAt: {
          not: null,
        },
        pickedUpAt: null,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        storageFees: true,
      },
    });

    const results = [];

    for (const order of eligibleOrders) {
      try {
        const fee = await this.createStorageFee(order.id);
        if (fee) {
          results.push({
            orderId: order.id,
            success: true,
            fee,
          });
        }
      } catch (error) {
        results.push({
          orderId: order.id,
          success: false,
          error: error.message,
        });
      }
    }

    return {
      processed: results.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      results,
    };
  }
}

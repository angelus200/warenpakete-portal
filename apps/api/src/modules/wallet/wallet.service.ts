import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { TransactionType, TransactionStatus, PayoutStatus } from '@prisma/client';

@Injectable()
export class WalletService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get user's current wallet balance
   */
  async getBalance(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        walletBalance: true,
        email: true,
        firstName: true,
        lastName: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return {
      balance: Number(user.walletBalance),
      userId: user.id,
      email: user.email,
      name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
    };
  }

  /**
   * Get all wallet transactions for a user
   */
  async getTransactions(userId: string, limit = 50, offset = 0) {
    const transactions = await this.prisma.walletTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });

    const total = await this.prisma.walletTransaction.count({
      where: { userId },
    });

    return {
      transactions,
      total,
      limit,
      offset,
    };
  }

  /**
   * Create a wallet transaction
   */
  async createTransaction(
    userId: string,
    type: TransactionType,
    amount: number,
    description?: string,
    reference?: string,
    status: TransactionStatus = TransactionStatus.COMPLETED,
  ) {
    // Create transaction
    const transaction = await this.prisma.walletTransaction.create({
      data: {
        userId,
        type,
        amount,
        description,
        reference,
        status,
      },
    });

    // Update user balance based on transaction type
    if (status === TransactionStatus.COMPLETED) {
      await this.updateBalance(userId, type, amount);
    }

    return transaction;
  }

  /**
   * Update user's wallet balance
   */
  private async updateBalance(
    userId: string,
    type: TransactionType,
    amount: number,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    let newBalance = Number(user.walletBalance);

    // Determine if we add or subtract from balance
    switch (type) {
      case TransactionType.COMMISSION_EARNED:
      case TransactionType.REFUND:
      case TransactionType.ADJUSTMENT:
        newBalance += amount;
        break;
      case TransactionType.PAYOUT_COMPLETED:
      case TransactionType.STORAGE_FEE_CHARGED:
        newBalance -= amount;
        break;
      case TransactionType.PAYOUT_REQUESTED:
        // Don't change balance on request, only on completion
        break;
    }

    // Ensure balance doesn't go negative
    if (newBalance < 0) {
      throw new BadRequestException('Insufficient wallet balance');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { walletBalance: newBalance },
    });

    return newBalance;
  }

  /**
   * Add commission to wallet
   */
  async addCommission(
    userId: string,
    commissionId: string,
    amount: number,
  ) {
    return this.createTransaction(
      userId,
      TransactionType.COMMISSION_EARNED,
      amount,
      'Commission earned from referral',
      commissionId,
    );
  }

  /**
   * Charge storage fee from wallet
   */
  async chargeStorageFee(
    userId: string,
    storageFeeId: string,
    amount: number,
  ) {
    return this.createTransaction(
      userId,
      TransactionType.STORAGE_FEE_CHARGED,
      amount,
      'Storage fee charged',
      storageFeeId,
    );
  }

  /**
   * Request payout
   */
  async requestPayout(
    userId: string,
    amount: number,
    iban: string,
    bankName?: string,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Check if user has sufficient balance
    if (Number(user.walletBalance) < amount) {
      throw new BadRequestException(
        `Insufficient balance. Available: €${Number(user.walletBalance).toFixed(2)}`,
      );
    }

    // Minimum payout amount
    if (amount < 10) {
      throw new BadRequestException('Minimum payout amount is €10.00');
    }

    // Create payout request
    const payoutRequest = await this.prisma.payoutRequest.create({
      data: {
        userId,
        amount,
        iban,
        bankName,
        status: PayoutStatus.PENDING,
      },
    });

    // Create transaction record (but don't deduct yet)
    await this.createTransaction(
      userId,
      TransactionType.PAYOUT_REQUESTED,
      amount,
      `Payout requested to ${iban}`,
      payoutRequest.id,
      TransactionStatus.PENDING,
    );

    return payoutRequest;
  }

  /**
   * Get payout requests for a user
   */
  async getPayoutRequests(userId: string) {
    return this.prisma.payoutRequest.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get all pending payout requests (Admin)
   */
  async getAllPendingPayouts() {
    return this.prisma.payoutRequest.findMany({
      where: {
        status: PayoutStatus.PENDING,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            company: true,
            walletBalance: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  /**
   * Process payout request (Admin)
   */
  async processPayout(
    payoutId: string,
    adminId: string,
    approved: boolean,
    notes?: string,
  ) {
    const payoutRequest = await this.prisma.payoutRequest.findUnique({
      where: { id: payoutId },
      include: { user: true },
    });

    if (!payoutRequest) {
      throw new NotFoundException(`Payout request with ID ${payoutId} not found`);
    }

    if (payoutRequest.status !== PayoutStatus.PENDING) {
      throw new BadRequestException(
        `Payout request is already ${payoutRequest.status}`,
      );
    }

    if (approved) {
      // Check if user still has sufficient balance
      if (Number(payoutRequest.user.walletBalance) < Number(payoutRequest.amount)) {
        throw new BadRequestException(
          'User has insufficient balance for this payout',
        );
      }

      // Update payout request to APPROVED
      await this.prisma.payoutRequest.update({
        where: { id: payoutId },
        data: {
          status: PayoutStatus.APPROVED,
          processedAt: new Date(),
          processedBy: adminId,
          notes,
        },
      });

      // Create completed transaction and deduct from balance
      await this.createTransaction(
        payoutRequest.userId,
        TransactionType.PAYOUT_COMPLETED,
        Number(payoutRequest.amount),
        `Payout completed to ${payoutRequest.iban}`,
        payoutId,
        TransactionStatus.COMPLETED,
      );

      // Update the original pending transaction
      await this.prisma.walletTransaction.updateMany({
        where: {
          userId: payoutRequest.userId,
          reference: payoutId,
          type: TransactionType.PAYOUT_REQUESTED,
          status: TransactionStatus.PENDING,
        },
        data: {
          status: TransactionStatus.COMPLETED,
        },
      });

      return {
        success: true,
        message: 'Payout approved and processed',
        payoutRequest,
      };
    } else {
      // Reject payout
      await this.prisma.payoutRequest.update({
        where: { id: payoutId },
        data: {
          status: PayoutStatus.REJECTED,
          processedAt: new Date(),
          processedBy: adminId,
          notes,
        },
      });

      // Update transaction to CANCELLED
      await this.prisma.walletTransaction.updateMany({
        where: {
          userId: payoutRequest.userId,
          reference: payoutId,
          type: TransactionType.PAYOUT_REQUESTED,
          status: TransactionStatus.PENDING,
        },
        data: {
          status: TransactionStatus.CANCELLED,
        },
      });

      return {
        success: true,
        message: 'Payout rejected',
        payoutRequest,
      };
    }
  }

  /**
   * Get wallet statistics for a user
   */
  async getWalletStats(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Total earned from commissions
    const commissionsEarned = await this.prisma.walletTransaction.aggregate({
      where: {
        userId,
        type: TransactionType.COMMISSION_EARNED,
        status: TransactionStatus.COMPLETED,
      },
      _sum: { amount: true },
    });

    // Total paid out
    const totalPaidOut = await this.prisma.walletTransaction.aggregate({
      where: {
        userId,
        type: TransactionType.PAYOUT_COMPLETED,
        status: TransactionStatus.COMPLETED,
      },
      _sum: { amount: true },
    });

    // Pending payouts
    const pendingPayouts = await this.prisma.payoutRequest.aggregate({
      where: {
        userId,
        status: PayoutStatus.PENDING,
      },
      _sum: { amount: true },
    });

    return {
      currentBalance: Number(user.walletBalance),
      totalEarned: Number(commissionsEarned._sum.amount || 0),
      totalPaidOut: Number(totalPaidOut._sum.amount || 0),
      pendingPayouts: Number(pendingPayouts._sum.amount || 0),
    };
  }
}

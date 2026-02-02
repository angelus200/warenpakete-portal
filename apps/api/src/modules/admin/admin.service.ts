import { Injectable, UnauthorizedException, NotFoundException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../common/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const admin = await this.prisma.adminUser.findUnique({
      where: { email },
    });

    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = await this.jwtService.signAsync(
      {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        type: 'admin',
      },
      {
        secret: process.env.ADMIN_JWT_SECRET || 'admin-secret-key-change-in-production',
        expiresIn: '8h',
      },
    );

    return {
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    };
  }

  async getAllContracts() {
    return this.prisma.commissionContract.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            firstName: true,
            lastName: true,
            companyName: true,
            companyStreet: true,
            companyZip: true,
            companyCity: true,
            companyCountry: true,
            vatId: true,
          },
        },
        order: {
          select: {
            id: true,
            totalAmount: true,
            status: true,
            createdAt: true,
            paidAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getContractById(contractId: string) {
    const contract = await this.prisma.commissionContract.findUnique({
      where: { id: contractId },
      include: {
        user: true,
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
    });

    if (!contract) {
      throw new NotFoundException('Contract not found');
    }

    return contract;
  }

  async updateContract(contractId: string, updateData: { salesStatus?: string; salesPrice?: number }) {
    const contract = await this.prisma.commissionContract.findUnique({
      where: { id: contractId },
    });

    if (!contract) {
      throw new NotFoundException('Contract not found');
    }

    const updates: any = {};

    if (updateData.salesStatus) {
      updates.salesStatus = updateData.salesStatus;

      if (updateData.salesStatus === 'sold' && !contract.soldAt) {
        updates.soldAt = new Date();
      }
    }

    if (updateData.salesPrice !== undefined) {
      updates.salesPrice = new Decimal(updateData.salesPrice);
    }

    return this.prisma.commissionContract.update({
      where: { id: contractId },
      data: updates,
    });
  }

  async triggerPayout(contractId: string, notes?: string) {
    const contract = await this.prisma.commissionContract.findUnique({
      where: { id: contractId },
    });

    if (!contract) {
      throw new NotFoundException('Contract not found');
    }

    if (contract.salesStatus !== 'sold') {
      throw new BadRequestException('Contract must be sold before payout');
    }

    if (!contract.salesPrice) {
      throw new BadRequestException('Sales price must be set before payout');
    }

    if (contract.payoutStatus === 'completed') {
      throw new BadRequestException('Payout already completed');
    }

    // Berechne Auszahlungsbetrag: 80% vom Verkaufspreis
    const salesPrice = Number(contract.salesPrice);
    const commissionRate = Number(contract.commissionRate);
    const payoutAmount = salesPrice * (1 - commissionRate);

    // Berechne Lagerkosten
    const storageStartDate = new Date(contract.storageStartDate);
    const today = new Date();
    const daysStored = Math.floor((today.getTime() - storageStartDate.getTime()) / (1000 * 60 * 60 * 24));
    const freeStorageDays = 14;
    const chargeableDays = Math.max(0, daysStored - freeStorageDays);
    const storageFeePerDay = Number(contract.storageFeePerDay);
    const palletCount = contract.productQuantity; // Annahme: 1 Produkt = 1 Palette
    const totalStorageFees = chargeableDays * storageFeePerDay * palletCount;

    // Finale Auszahlung = Auszahlungsbetrag - Lagerkosten
    const finalPayoutAmount = Math.max(0, payoutAmount - totalStorageFees);

    return this.prisma.commissionContract.update({
      where: { id: contractId },
      data: {
        payoutAmount: new Decimal(finalPayoutAmount),
        payoutStatus: 'completed',
        paidAt: new Date(),
      },
    });
  }

  async getDashboardStats() {
    const contracts = await this.prisma.commissionContract.findMany({
      include: {
        order: true,
      },
    });

    const stats = {
      totalContracts: contracts.length,
      pendingContracts: contracts.filter(c => c.salesStatus === 'pending').length,
      listedContracts: contracts.filter(c => c.salesStatus === 'listed').length,
      soldContracts: contracts.filter(c => c.salesStatus === 'sold').length,
      totalGoodsValue: contracts.reduce((sum, c) => sum + Number(c.purchasePrice) * c.productQuantity, 0),
      pendingPayouts: contracts.filter(c => c.salesStatus === 'sold' && c.payoutStatus === 'pending').length,
      totalCommissionEarned: contracts
        .filter(c => c.salesStatus === 'sold' && c.salesPrice)
        .reduce((sum, c) => sum + Number(c.salesPrice!) * Number(c.commissionRate), 0),
      totalPayoutsCompleted: contracts.filter(c => c.payoutStatus === 'completed').length,
      totalPayoutAmount: contracts
        .filter(c => c.payoutAmount)
        .reduce((sum, c) => sum + Number(c.payoutAmount!), 0),
    };

    return stats;
  }

  async getAllUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        company: true,
        companyName: true,
        role: true,
        walletBalance: true,
        createdAt: true,
        _count: {
          select: {
            orders: true,
            commissionsEarned: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateUserRole(userId: string, role: string) {
    const validRoles = ['BUYER', 'RESELLER', 'ADMIN'];

    if (!validRoles.includes(role)) {
      throw new BadRequestException(`Invalid role. Must be one of: ${validRoles.join(', ')}`);
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: { role: role as any },
    });
  }

  async getAllProducts() {
    return this.prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
}

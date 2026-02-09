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

    const token = await this.jwtService.signAsync({
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
      type: 'admin',
    });

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
    const validRoles = ['BUYER', 'RESELLER', 'EMPLOYEE', 'ADMIN'];

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

  async getAnalytics() {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    const twelveWeeksAgo = new Date(now.getTime() - 84 * 24 * 60 * 60 * 1000);

    // Fetch all data in parallel
    const [
      allUsers,
      usersLast30Days,
      allOrders,
      ordersLast30Days,
      ordersLast90Days,
      allContracts,
    ] = await Promise.all([
      this.prisma.user.findMany({
        select: {
          id: true,
          createdAt: true,
          _count: { select: { orders: true } },
        },
      }),
      this.prisma.user.findMany({
        where: { createdAt: { gte: thirtyDaysAgo } },
        select: { id: true, createdAt: true },
      }),
      this.prisma.order.findMany({
        select: {
          id: true,
          createdAt: true,
          totalAmount: true,
          fulfillmentType: true,
          items: {
            include: { product: true },
          },
        },
      }),
      this.prisma.order.findMany({
        where: { createdAt: { gte: thirtyDaysAgo } },
        select: { totalAmount: true },
      }),
      this.prisma.order.findMany({
        where: { createdAt: { gte: ninetyDaysAgo } },
        select: { totalAmount: true },
      }),
      this.prisma.commissionContract.findMany({
        select: {
          id: true,
          createdAt: true,
          salesStatus: true,
          soldAt: true,
          salesPrice: true,
          commissionRate: true,
        },
      }),
    ]);

    // Calculate user metrics
    const activeUsers = allUsers.filter(u => u._count.orders > 0).length;
    const totalUsers = allUsers.length;
    const newRegistrations30d = usersLast30Days.length;

    // Users with at least one order
    const usersWithOrders = allUsers.filter(u => u._count.orders > 0).length;
    const conversionRate = totalUsers > 0 ? (usersWithOrders / totalUsers) * 100 : 0;

    // Registrations per day (last 30 days)
    const registrationsPerDay = Array.from({ length: 30 }, (_, i) => {
      const date = new Date(now.getTime() - (29 - i) * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      const count = usersLast30Days.filter(u =>
        u.createdAt.toISOString().split('T')[0] === dateStr
      ).length;
      return { date: dateStr, count };
    });

    // Registrations per week (last 12 weeks)
    const registrationsPerWeek = Array.from({ length: 12 }, (_, i) => {
      const weekStart = new Date(now.getTime() - (11 - i) * 7 * 24 * 60 * 60 * 1000);
      const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);
      const count = allUsers.filter(u =>
        u.createdAt >= weekStart && u.createdAt < weekEnd
      ).length;
      const weekLabel = `KW ${Math.ceil((weekStart.getTime() - new Date(weekStart.getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000))}`;
      return { week: weekLabel, count };
    });

    // Calculate order metrics
    const totalRevenue30d = ordersLast30Days.reduce((sum, o) => sum + Number(o.totalAmount), 0);
    const totalRevenue90d = ordersLast90Days.reduce((sum, o) => sum + Number(o.totalAmount), 0);
    const totalRevenueAll = allOrders.reduce((sum, o) => sum + Number(o.totalAmount), 0);
    const avgOrderValue = allOrders.length > 0 ? totalRevenueAll / allOrders.length : 0;

    // Orders per day (last 30 days)
    const ordersPerDay = Array.from({ length: 30 }, (_, i) => {
      const date = new Date(now.getTime() - (29 - i) * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      const count = allOrders.filter(o =>
        o.createdAt.toISOString().split('T')[0] === dateStr
      ).length;
      return { date: dateStr, count };
    });

    // Orders per week (last 12 weeks)
    const ordersPerWeek = Array.from({ length: 12 }, (_, i) => {
      const weekStart = new Date(now.getTime() - (11 - i) * 7 * 24 * 60 * 60 * 1000);
      const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);
      const count = allOrders.filter(o =>
        o.createdAt >= weekStart && o.createdAt < weekEnd
      ).length;
      const weekLabel = `KW ${Math.ceil((weekStart.getTime() - new Date(weekStart.getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000))}`;
      return { week: weekLabel, count };
    });

    // Top 5 products
    const productSales: Record<string, { name: string; count: number; revenue: number }> = {};
    allOrders.forEach(order => {
      order.items.forEach(item => {
        if (!productSales[item.product.id]) {
          productSales[item.product.id] = {
            name: item.product.name,
            count: 0,
            revenue: 0,
          };
        }
        productSales[item.product.id].count += item.quantity;
        productSales[item.product.id].revenue += Number(item.price) * item.quantity;
      });
    });
    const topProducts = Object.values(productSales)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Commission metrics
    const newContractsPerWeek = Array.from({ length: 12 }, (_, i) => {
      const weekStart = new Date(now.getTime() - (11 - i) * 7 * 24 * 60 * 60 * 1000);
      const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);
      const count = allContracts.filter(c =>
        c.createdAt >= weekStart && c.createdAt < weekEnd
      ).length;
      const weekLabel = `KW ${Math.ceil((weekStart.getTime() - new Date(weekStart.getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000))}`;
      return { week: weekLabel, count };
    });

    const contractsByStatus = {
      pending: allContracts.filter(c => c.salesStatus === 'pending').length,
      listed: allContracts.filter(c => c.salesStatus === 'listed').length,
      sold: allContracts.filter(c => c.salesStatus === 'sold').length,
    };

    // Average sales time (days from contract creation to sold)
    const soldContracts = allContracts.filter(c => c.salesStatus === 'sold' && c.soldAt);
    const avgSalesTime = soldContracts.length > 0
      ? soldContracts.reduce((sum, c) => {
          const days = Math.floor((c.soldAt!.getTime() - c.createdAt.getTime()) / (24 * 60 * 60 * 1000));
          return sum + days;
        }, 0) / soldContracts.length
      : 0;

    // Total commission earned
    const totalCommission = allContracts
      .filter(c => c.salesStatus === 'sold' && c.salesPrice)
      .reduce((sum, c) => sum + Number(c.salesPrice!) * Number(c.commissionRate), 0);

    // Fulfillment statistics
    const ordersWithFulfillment = allOrders.filter(o => o.fulfillmentType);
    const fulfillmentStats = {
      commission: ordersWithFulfillment.filter(o => o.fulfillmentType === 'commission').length,
      delivery: ordersWithFulfillment.filter(o => o.fulfillmentType === 'delivery').length,
    };

    return {
      users: {
        total: totalUsers,
        active: activeUsers,
        new30d: newRegistrations30d,
        conversionRate: Math.round(conversionRate * 100) / 100,
        registrationsPerDay,
        registrationsPerWeek,
      },
      orders: {
        total: allOrders.length,
        revenue30d: totalRevenue30d,
        revenue90d: totalRevenue90d,
        revenueTotal: totalRevenueAll,
        avgOrderValue: Math.round(avgOrderValue * 100) / 100,
        ordersPerDay,
        ordersPerWeek,
        topProducts,
      },
      commissions: {
        total: allContracts.length,
        byStatus: contractsByStatus,
        avgSalesTimeDays: Math.round(avgSalesTime * 10) / 10,
        totalCommissionEarned: Math.round(totalCommission * 100) / 100,
        newContractsPerWeek,
      },
      fulfillment: fulfillmentStats,
    };
  }
}

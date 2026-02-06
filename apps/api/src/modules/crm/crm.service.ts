import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CrmService {
  constructor(private prisma: PrismaService) {}

  // Dashboard KPIs
  async getDashboardKpis() {
    const [
      totalCustomers,
      totalRevenue,
      totalOrders,
      activePallets,
      newCustomersThisMonth,
    ] = await Promise.all([
      this.prisma.user.count({ where: { role: { not: 'ADMIN' } } }),
      this.prisma.order.aggregate({
        where: { status: 'PAID' },
        _sum: { totalAmount: true },
      }),
      this.prisma.order.count({ where: { status: 'PAID' } }),
      this.prisma.storageFee.aggregate({
        _sum: { palletCount: true },
      }),
      this.prisma.user.count({
        where: {
          role: { not: 'ADMIN' },
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),
    ]);

    const avgOrderValue =
      totalOrders > 0
        ? Number(totalRevenue._sum.totalAmount || 0) / totalOrders
        : 0;

    return {
      totalCustomers,
      totalRevenue: Number(totalRevenue._sum.totalAmount || 0),
      totalOrders,
      avgOrderValue,
      activePallets: Number(activePallets._sum.palletCount || 0),
      newCustomersThisMonth,
    };
  }

  // Kundenliste mit Filtern
  async getCustomers(filters?: {
    status?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }) {
    const where: Prisma.UserWhereInput = {
      role: { not: 'ADMIN' },
    };

    if (filters?.status && filters.status !== 'all') {
      where.customerStatus = filters.status;
    }

    if (filters?.search) {
      const searchTerm = filters.search.toLowerCase();
      where.OR = [
        { company: { contains: searchTerm, mode: 'insensitive' } },
        { companyName: { contains: searchTerm, mode: 'insensitive' } },
        { email: { contains: searchTerm, mode: 'insensitive' } },
        { firstName: { contains: searchTerm, mode: 'insensitive' } },
        { lastName: { contains: searchTerm, mode: 'insensitive' } },
      ];
    }

    const customers = await this.prisma.user.findMany({
      where,
      include: {
        orders: {
          select: {
            id: true,
            totalAmount: true,
            status: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        _count: {
          select: { orders: true },
        },
      },
      take: filters?.limit || 100,
      skip: filters?.offset || 0,
      orderBy: { createdAt: 'desc' },
    });

    return customers.map((customer) => ({
      ...customer,
      totalOrders: customer._count.orders,
      lastOrder: customer.orders[0] || null,
    }));
  }

  // Kundendetails
  async getCustomerById(id: string) {
    const customer = await this.prisma.user.findUnique({
      where: { id },
      include: {
        orders: {
          include: {
            items: {
              include: { product: true },
            },
            commissionContract: true,
            deliveryAddress: true,
          },
          orderBy: { createdAt: 'desc' },
        },
        commissionContracts: {
          orderBy: { createdAt: 'desc' },
        },
        customerNotes: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        customerActivities: {
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
        _count: {
          select: { orders: true },
        },
      },
    });

    return customer;
  }

  // Kundennotiz erstellen
  async createCustomerNote(
    customerId: string,
    authorId: string,
    data: CreateNoteDto,
  ) {
    return this.prisma.customerNote.create({
      data: {
        userId: customerId,
        authorId,
        content: data.content,
        noteType: data.noteType || 'general',
      },
    });
  }

  // Orders Pipeline (gruppiert nach Status)
  async getOrdersPipeline() {
    // Fetch all orders with invoiceNumber included
    const orders = await this.prisma.order.findMany({
      where: {
        status: { not: 'CANCELLED' },
      },
      include: {
        user: {
          select: {
            company: true,
            companyName: true,
            email: true,
          },
        },
        items: {
          include: { product: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Gruppiere nach Pipeline-Stages
    const pipeline = {
      pending: orders.filter((o) => o.status === 'PENDING'),
      paid: orders.filter((o) => o.status === 'PAID' && !o.fulfillmentType),
      contract_pending: orders.filter(
        (o) =>
          o.status === 'PAID' && o.fulfillmentType === 'COMMISSION' && !o.pickedUpAt,
      ),
      in_fulfillment: orders.filter(
        (o) => o.status === 'PROCESSING' || o.status === 'SHIPPED',
      ),
      completed: orders.filter((o) => o.status === 'DELIVERED'),
    };

    return pipeline;
  }

  // Bestellungen mit Filtern
  async getOrders(filters?: {
    status?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }) {
    const where: Prisma.OrderWhereInput = {};

    if (filters?.status && filters.status !== 'all') {
      where.status = filters.status as any;
    }

    if (filters?.search) {
      const searchTerm = filters.search.toLowerCase();
      where.OR = [
        { id: { contains: searchTerm, mode: 'insensitive' } },
        {
          user: {
            OR: [
              { company: { contains: searchTerm, mode: 'insensitive' } },
              { companyName: { contains: searchTerm, mode: 'insensitive' } },
            ],
          },
        },
      ];
    }

    return this.prisma.order.findMany({
      where,
      include: {
        user: {
          select: {
            company: true,
            companyName: true,
            email: true,
          },
        },
        items: {
          include: { product: true },
        },
      },
      take: filters?.limit || 100,
      skip: filters?.offset || 0,
      orderBy: { createdAt: 'desc' },
    });
  }

  // Kommissionen mit Stats
  async getCommissions(filters?: { status?: string }) {
    const where: Prisma.CommissionContractWhereInput = {};

    if (filters?.status && filters.status !== 'all') {
      where.salesStatus = filters.status;
    }

    const contracts = await this.prisma.commissionContract.findMany({
      where,
      include: {
        order: {
          include: {
            user: {
              select: {
                company: true,
                companyName: true,
                email: true,
              },
            },
            items: {
              include: { product: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return contracts;
  }

  // Kommissions-KPIs
  async getCommissionStats() {
    const contracts = await this.prisma.commissionContract.findMany({
      where: {
        salesStatus: { in: ['listed', 'sold'] },
      },
      include: {
        order: true,
      },
    });

    const totalGrossRevenue = contracts
      .filter((c) => c.salesPrice)
      .reduce((sum, c) => sum + Number(c.salesPrice), 0);

    const totalCommission = totalGrossRevenue * 0.2;

    const totalStorageFees = await this.prisma.storageFee.aggregate({
      _sum: { amount: true },
    });

    const totalPayouts = contracts
      .filter((c) => c.payoutAmount)
      .reduce((sum, c) => sum + Number(c.payoutAmount), 0);

    return {
      totalGrossRevenue,
      totalCommission,
      totalStorageFees: Number(totalStorageFees._sum.amount || 0),
      totalPayouts,
      inSale: contracts.filter((c) => c.salesStatus === 'listed').length,
      sold: contracts.filter((c) => c.salesStatus === 'sold').length,
      pendingPayout: contracts.filter((c) => c.payoutStatus === 'pending')
        .length,
    };
  }

  // Lager-Übersicht
  async getStorage() {
    const storageFees = await this.prisma.storageFee.findMany({
      include: {
        order: {
          include: {
            user: {
              select: {
                company: true,
                companyName: true,
                email: true,
              },
            },
            items: {
              include: { product: true },
            },
            commissionContract: {
              select: {
                storageStartDate: true,
                storageFeePerDay: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return storageFees.map((fee) => {
      const storageStart =
        fee.order.commissionContract?.storageStartDate ||
        fee.order.createdAt;
      const daysStored = Math.floor(
        (Date.now() - storageStart.getTime()) / (1000 * 60 * 60 * 24),
      );
      const freeUntil = new Date(storageStart);
      freeUntil.setDate(freeUntil.getDate() + 14);

      return {
        ...fee,
        daysStored,
        freeUntil,
        status: daysStored <= 14 ? 'free_period' : 'billing',
      };
    });
  }

  // Lagerkosten berechnen
  async calculateStorageFees() {
    const contracts = await this.prisma.commissionContract.findMany({
      where: {
        salesStatus: { in: ['pending', 'listed'] },
      },
      include: {
        order: {
          include: {
            items: {
              include: { product: true },
            },
          },
        },
      },
    });

    const calculations = contracts.map((contract) => {
      const daysStored = Math.floor(
        (Date.now() - contract.storageStartDate.getTime()) /
          (1000 * 60 * 60 * 24),
      );
      const freeDays = 14;
      const billableDays = Math.max(0, daysStored - freeDays);

      const totalPallets = contract.order.items.reduce(
        (sum, item) => sum + item.product.palletCount * item.quantity,
        0,
      );

      const dailyRate = Number(contract.storageFeePerDay) * totalPallets;
      const totalFees = billableDays * dailyRate;

      return {
        orderId: contract.orderId,
        contractId: contract.id,
        pallets: totalPallets,
        daysStored,
        billableDays,
        dailyRate,
        totalFees,
      };
    });

    return calculations;
  }

  // Fulfillment-Kette Status
  async getFulfillmentChain(orderId?: string) {
    const where: Prisma.OrderWhereInput = orderId ? { id: orderId } : {};

    const orders = await this.prisma.order.findMany({
      where,
      include: {
        user: {
          select: {
            company: true,
            companyName: true,
          },
        },
        commissionContract: true,
        deliveryAddress: true,
      },
      orderBy: { createdAt: 'desc' },
      take: orderId ? 1 : 50,
    });

    return orders.map((order) => {
      const chain = {
        orderId: order.id,
        customer:
          order.user.company || order.user.companyName || 'Unknown',
        steps: [
          {
            name: 'Bestellung',
            status: order.status === 'PENDING' ? 'current' : 'completed',
            date: order.createdAt,
          },
          {
            name: 'Bezahlung',
            status: order.paidAt
              ? 'completed'
              : order.status === 'PENDING'
                ? 'pending'
                : 'current',
            date: order.paidAt,
          },
          {
            name: 'Fulfillment-Wahl',
            status: order.fulfillmentType
              ? 'completed'
              : order.paidAt
                ? 'current'
                : 'pending',
            date: order.updatedAt,
          },
        ],
      };

      if (order.fulfillmentType === 'COMMISSION') {
        chain.steps.push(
          {
            name: 'Vertrag',
            status: order.commissionContract?.signedAt
              ? 'completed'
              : 'current',
            date: order.commissionContract?.signedAt,
          },
          {
            name: 'Amazon-Listing',
            status:
              order.commissionContract?.salesStatus === 'listed'
                ? 'completed'
                : 'pending',
            date: order.commissionContract?.updatedAt,
          },
          {
            name: 'Verkauf',
            status:
              order.commissionContract?.salesStatus === 'sold'
                ? 'completed'
                : 'pending',
            date: order.commissionContract?.soldAt,
          },
          {
            name: 'Auszahlung',
            status:
              order.commissionContract?.payoutStatus === 'completed'
                ? 'completed'
                : 'pending',
            date: order.commissionContract?.paidAt,
          },
        );
      } else if (order.fulfillmentType === 'DELIVERY') {
        chain.steps.push(
          {
            name: 'Versand',
            status: order.status === 'SHIPPED' ? 'completed' : 'current',
            date: order.pickedUpAt,
          },
          {
            name: 'Zustellung',
            status: order.status === 'DELIVERED' ? 'completed' : 'pending',
            date: null,
          },
        );
      }

      return chain;
    });
  }
}

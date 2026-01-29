import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderStatus, ProductStatus } from '@prisma/client';
import { ProductsService } from '../products/products.service';
import { CommissionsService } from '../commissions/commissions.service';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private productsService: ProductsService,
    private commissionsService: CommissionsService,
  ) {}

  async create(createOrderDto: CreateOrderDto, userId: string) {
    const { items } = createOrderDto;

    for (const item of items) {
      const product = await this.productsService.findOne(item.productId);

      if (product.status !== ProductStatus.AVAILABLE) {
        throw new BadRequestException(
          `Product ${product.name} is not available`,
        );
      }

      if (product.stock < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for product ${product.name}. Available: ${product.stock}`,
        );
      }
    }

    const totalAmount = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    return this.prisma.order.create({
      data: {
        userId,
        totalAmount,
        status: OrderStatus.PENDING,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async findAll(userId?: string, isAdmin: boolean = false) {
    const where = isAdmin ? {} : { userId };

    return this.prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId?: string, isAdmin: boolean = false) {
    const where = isAdmin ? { id } : { id, userId };

    const order = await this.prisma.order.findFirst({
      where,
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            company: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async updateStatus(
    id: string,
    updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    const order = await this.findOne(id, undefined, true);

    // Set paidAt timestamp when status changes to PAID
    const updateData: any = { status: updateOrderStatusDto.status };
    if (
      updateOrderStatusDto.status === OrderStatus.PAID &&
      order.status !== OrderStatus.PAID
    ) {
      updateData.paidAt = new Date();
    }

    const updatedOrder = await this.prisma.order.update({
      where: { id },
      data: updateData,
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (
      updateOrderStatusDto.status === OrderStatus.PAID &&
      order.status !== OrderStatus.PAID
    ) {
      for (const item of updatedOrder.items) {
        await this.productsService.updateStock(
          item.productId,
          item.quantity,
        );

        const product = await this.productsService.findOne(item.productId);
        if (product.stock === 0) {
          await this.prisma.product.update({
            where: { id: item.productId },
            data: { status: ProductStatus.SOLD },
          });
        }
      }

      await this.commissionsService.calculateCommission(
        id,
        Number(updatedOrder.totalAmount),
      );
    }

    return updatedOrder;
  }
}

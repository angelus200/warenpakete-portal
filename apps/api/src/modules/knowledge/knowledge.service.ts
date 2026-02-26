import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateKnowledgeProductDto } from './dto/create-knowledge-product.dto';
import { UpdateKnowledgeProductDto } from './dto/update-knowledge-product.dto';
import Stripe from 'stripe';

@Injectable()
export class KnowledgeService {
  private stripe: Stripe;

  constructor(private prisma: PrismaService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    });
  }

  async findAllActive() {
    return this.prisma.knowledgeProduct.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findAllForAdmin() {
    return this.prisma.knowledgeProduct.findMany({
      orderBy: { sortOrder: 'asc' },
    });
  }

  async getMyPurchases(clerkId: string) {
    const user = await this.prisma.user.findUnique({
      where: { clerkId },
      include: {
        knowledgePurchases: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user.knowledgePurchases;
  }

  async findOneWithPurchaseStatus(id: string, clerkId?: string) {
    const product = await this.prisma.knowledgeProduct.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Knowledge product with ID ${id} not found`);
    }

    let hasPurchased = false;
    if (clerkId) {
      const user = await this.prisma.user.findUnique({
        where: { clerkId },
      });

      if (user) {
        const purchase = await this.prisma.knowledgePurchase.findUnique({
          where: {
            userId_productId: {
              userId: user.id,
              productId: id,
            },
          },
        });
        hasPurchased = !!purchase;
      }
    }

    return {
      ...product,
      hasPurchased,
    };
  }

  async purchaseProduct(id: string, clerkId: string) {
    const product = await this.prisma.knowledgeProduct.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Knowledge product with ID ${id} not found`);
    }

    if (!product.isActive) {
      throw new BadRequestException('Product is not available');
    }

    const user = await this.prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if already purchased
    const existingPurchase = await this.prisma.knowledgePurchase.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId: id,
        },
      },
    });

    if (existingPurchase) {
      throw new BadRequestException('Product already purchased');
    }

    // Free product
    if (product.isFree) {
      const purchase = await this.prisma.knowledgePurchase.create({
        data: {
          userId: user.id,
          productId: id,
          paidAmount: 0,
        },
      });

      return {
        isFree: true,
        purchaseId: purchase.id,
      };
    }

    // Paid product - create Stripe PaymentIntent
    if (!product.price) {
      throw new BadRequestException('Product price is not set');
    }

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(Number(product.price) * 100),
      currency: 'eur',
      metadata: {
        type: 'knowledge_product',
        productId: id,
        userId: user.id,
      },
    });

    return {
      isFree: false,
      clientSecret: paymentIntent.client_secret,
    };
  }

  async getDownloadUrl(id: string, clerkId: string) {
    const product = await this.prisma.knowledgeProduct.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Knowledge product with ID ${id} not found`);
    }

    const user = await this.prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if product is free OR if user has purchased it
    if (!product.isFree) {
      const purchase = await this.prisma.knowledgePurchase.findUnique({
        where: {
          userId_productId: {
            userId: user.id,
            productId: id,
          },
        },
      });

      if (!purchase) {
        throw new BadRequestException('You must purchase this product first');
      }
    }

    return {
      downloadUrl: product.fileUrl,
      fileName: `${product.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.pdf`,
    };
  }

  async completePurchase(
    productId: string,
    userId: string,
    stripePaymentIntentId: string,
    paidAmount: number,
  ) {
    return this.prisma.knowledgePurchase.create({
      data: {
        userId,
        productId,
        stripePaymentIntentId,
        paidAmount,
      },
    });
  }

  async create(createDto: CreateKnowledgeProductDto) {
    return this.prisma.knowledgeProduct.create({
      data: createDto,
    });
  }

  async update(id: string, updateDto: UpdateKnowledgeProductDto) {
    const product = await this.prisma.knowledgeProduct.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Knowledge product with ID ${id} not found`);
    }

    return this.prisma.knowledgeProduct.update({
      where: { id },
      data: updateDto,
    });
  }

  async softDelete(id: string) {
    const product = await this.prisma.knowledgeProduct.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Knowledge product with ID ${id} not found`);
    }

    return this.prisma.knowledgeProduct.update({
      where: { id },
      data: { isActive: false },
    });
  }
}

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { OrdersService } from '../orders/orders.service';
import { OrderStatus } from '@prisma/client';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(
    private prisma: PrismaService,
    private ordersService: OrdersService,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    });
  }

  async createCheckoutSession(orderId: string, userId: string) {
    const order = await this.ordersService.findOne(orderId, userId, false);

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException(
        `Order is already ${order.status.toLowerCase()}`,
      );
    }

    const lineItems = order.items.map((item) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.product.name,
          description: item.product.description || undefined,
          images: item.product.images.length > 0 ? [item.product.images[0]] : undefined,
        },
        unit_amount: Math.round(Number(item.price) * 100),
      },
      quantity: item.quantity,
    }));

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/orders?success=true&orderId=${orderId}`,
      cancel_url: `${process.env.FRONTEND_URL}/checkout?orderId=${orderId}`,
      metadata: {
        orderId,
      },
    });

    await this.prisma.order.update({
      where: { id: orderId },
      data: { stripePaymentId: session.id },
    });

    return {
      sessionId: session.id,
      url: session.url,
    };
  }

  async handleWebhook(signature: string, rawBody: Buffer) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET is not configured');
    }

    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        webhookSecret,
      );
    } catch (err) {
      throw new BadRequestException(`Webhook signature verification failed: ${err.message}`);
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const orderId = session.metadata?.orderId;

        if (orderId) {
          console.log(`Processing checkout.session.completed for order ${orderId}`);
          await this.ordersService.updateStatus(orderId, {
            status: OrderStatus.PAID,
          });
        }
        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`Payment succeeded: ${paymentIntent.id}`);
        // Additional handling if needed
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.error(`Payment failed: ${paymentIntent.id}`);
        // Handle payment failure (e.g., notify user)
        break;
      }

      default:
        console.log(`Unhandled Stripe event: ${event.type}`);
    }

    return { received: true };
  }
}

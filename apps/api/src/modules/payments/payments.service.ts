import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { OrdersService } from '../orders/orders.service';
import { EmailService } from '../email/email.service';
import { AffiliateService } from '../affiliate/affiliate.service';
import { OrderStatus } from '@prisma/client';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(
    private prisma: PrismaService,
    private ordersService: OrdersService,
    private emailService: EmailService,
    private affiliateService: AffiliateService,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    });
  }

  async createCheckoutSession(orderId: string, userId: string, affiliateRef?: string) {
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

    const metadata: any = {
      orderId,
      userId,
    };

    // Add affiliate ref if provided
    if (affiliateRef) {
      metadata.affiliateRef = affiliateRef;
    }

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/orders?success=true&orderId=${orderId}`,
      cancel_url: `${process.env.FRONTEND_URL}/checkout?orderId=${orderId}`,
      metadata,
      // B2B: Sammle Firmendaten
      custom_fields: [
        {
          key: 'company_name',
          label: {
            type: 'custom',
            custom: 'Firmenname',
          },
          type: 'text',
          optional: false,
        },
        {
          key: 'vat_id',
          label: {
            type: 'custom',
            custom: 'USt-IdNr. (optional)',
          },
          type: 'text',
          optional: true, // USt-IdNr kann optional sein für Kleinunternehmer
        },
      ],
      // Rechnungsadresse erforderlich für B2B
      billing_address_collection: 'required',
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
        const userId = session.metadata?.userId;

        if (orderId) {

          // Extrahiere B2B-Daten aus Custom Fields
          const customFields = session.custom_fields || [];
          const companyName = customFields.find(f => f.key === 'company_name')?.text?.value;
          const vatId = customFields.find(f => f.key === 'vat_id')?.text?.value;


          // Speichere B2B-Daten im User wenn vorhanden
          if (userId && (companyName || vatId)) {
            await this.prisma.user.update({
              where: { id: userId },
              data: {
                companyName: companyName || undefined,
                company: companyName || undefined,
                vatId: vatId || undefined,
              },
            });
          }

          // Update order status to PAID
          await this.ordersService.updateStatus(orderId, {
            status: OrderStatus.PAID,
          });

          // Get order with user data
          const order = await this.ordersService.findOne(orderId, undefined, true);

          // Send order confirmation email
          await this.emailService.sendOrderConfirmation(order.user.email, order);

          // Send payment success email
          const userName = order.user.firstName || order.user.email.split('@')[0];
          await this.emailService.sendPaymentSuccess(order.user.email, order, userName);

          // Track 3-tier affiliate conversion based on user's referral chain
          try {
            await this.affiliateService.trackConversion(
              order.userId,
              orderId,
              Number(order.totalAmount),
            );
          } catch (error) {
            console.error('Failed to track affiliate conversion:', error);
          }

          // Check if there's a commission and send email to reseller
          const commission = await this.prisma.commission.findUnique({
            where: { orderId },
            include: {
              reseller: {
                select: {
                  email: true,
                  firstName: true,
                  name: true,
                },
              },
            },
          });

          if (commission) {
            const resellerName = commission.reseller.firstName || commission.reseller.name || commission.reseller.email.split('@')[0];
            await this.emailService.sendCommissionEarned(
              commission.reseller.email,
              commission,
              resellerName,
            );
          }
        }
        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
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
    }

    return { received: true };
  }
}

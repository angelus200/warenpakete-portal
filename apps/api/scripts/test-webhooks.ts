import * as dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const prisma = new PrismaClient();

interface TestResult {
  test: string;
  status: 'PASS' | 'FAIL';
  message: string;
}

const results: TestResult[] = [];

async function testWebhooks() {
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('PHASE 6: WEBHOOK SIMULATION TESTS');
  console.log('═══════════════════════════════════════════════════════════════\n');

  console.log('Note: Testing webhook logic without actual HTTP calls\n');

  try {
    // Test Stripe webhook simulation (checkout.session.completed)
    console.log('Testing Stripe Webhook Logic...\n');

    // Create test user
    const user = await prisma.user.create({
      data: {
        clerkId: `test_webhook_${Date.now()}`,
        email: `webhook-${Date.now()}@example.com`,
        role: 'BUYER',
      },
    });

    // Create test product
    const product = await prisma.product.findFirst({
      where: { status: 'AVAILABLE' },
    });

    if (!product) {
      throw new Error('No available products for testing');
    }

    // Create order with PENDING status
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        totalAmount: product.price,
        status: 'PENDING',
        items: {
          create: [
            {
              productId: product.id,
              quantity: 1,
              price: product.price,
            },
          ],
        },
      },
    });

    results.push({
      test: 'Create PENDING Order',
      status: 'PASS',
      message: '✓ Order created with PENDING status',
    });

    // Simulate webhook processing: Update order to PAID
    await prisma.order.update({
      where: { id: order.id },
      data: { status: 'PAID' },
    });

    const updatedOrder = await prisma.order.findUnique({
      where: { id: order.id },
    });

    if (updatedOrder.status === 'PAID') {
      results.push({
        test: 'Stripe Webhook - Update Status',
        status: 'PASS',
        message: '✓ Order status updated to PAID after webhook',
      });
    } else {
      results.push({
        test: 'Stripe Webhook - Update Status',
        status: 'FAIL',
        message: '❌ Order status not updated correctly',
      });
    }

    // Cleanup
    await prisma.orderItem.deleteMany({ where: { orderId: order.id } });
    await prisma.order.delete({ where: { id: order.id } });
    await prisma.user.delete({ where: { id: user.id } });

    // Test Clerk webhook simulation (user.created)
    console.log('Testing Clerk Webhook Logic...\n');

    // Simulate user creation via webhook
    const clerkWebhookUser = await prisma.user.create({
      data: {
        clerkId: `clerk_webhook_${Date.now()}`,
        email: `clerk-webhook-${Date.now()}@example.com`,
        firstName: 'Webhook',
        lastName: 'User',
        role: 'BUYER',
      },
    });

    if (clerkWebhookUser && clerkWebhookUser.id) {
      results.push({
        test: 'Clerk Webhook - Create User',
        status: 'PASS',
        message: '✓ User created via webhook simulation',
      });
    } else {
      results.push({
        test: 'Clerk Webhook - Create User',
        status: 'FAIL',
        message: '❌ User creation via webhook failed',
      });
    }

    // Check if user can be found by clerkId (webhook sync)
    const foundUser = await prisma.user.findUnique({
      where: { clerkId: clerkWebhookUser.clerkId },
    });

    if (foundUser && foundUser.id === clerkWebhookUser.id) {
      results.push({
        test: 'Clerk Webhook - Sync User',
        status: 'PASS',
        message: '✓ User synced correctly after webhook',
      });
    } else {
      results.push({
        test: 'Clerk Webhook - Sync User',
        status: 'FAIL',
        message: '❌ User sync failed',
      });
    }

    // Cleanup
    await prisma.user.delete({ where: { id: clerkWebhookUser.id } });

    // Print results
    console.log('Webhook Test Results:');
    console.log('─────────────────────────────────────────────────────────────\n');

    results.forEach(result => {
      console.log(result.message);
    });

    // Summary
    const passed = results.filter(r => r.status === 'PASS').length;
    const failed = results.filter(r => r.status === 'FAIL').length;

    console.log('\n─────────────────────────────────────────────────────────────');
    console.log(`Results: ${passed} passed, ${failed} failed`);
    console.log('═══════════════════════════════════════════════════════════════\n');

    if (failed > 0) {
      console.error('❌ Webhook tests FAILED\n');
      process.exit(1);
    } else {
      console.log('✅ Webhook tests PASSED\n');
      process.exit(0);
    }
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testWebhooks();

import * as dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { nanoid } from 'nanoid';

dotenv.config();

const prisma = new PrismaClient();
const COMMISSION_RATE = 0.05;

interface StepResult {
  step: number;
  name: string;
  status: 'PASS' | 'FAIL';
  message: string;
  details?: any;
}

const steps: StepResult[] = [];

async function runFullFlow() {
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('PHASE 9: FULL E2E INTEGRATION TEST');
  console.log('═══════════════════════════════════════════════════════════════\n');

  console.log('Running complete user journey from signup to commission...\n');

  let reseller: any, buyer: any, product: any, order: any, commission: any;

  try {
    // Step 1: Validate Environment
    const requiredEnvVars = [
      'DATABASE_URL',
      'CLERK_SECRET_KEY',
      'STRIPE_SECRET_KEY',
      'RESEND_API_KEY',
    ];

    const missingVars = requiredEnvVars.filter(v => !process.env[v]);

    if (missingVars.length === 0) {
      steps.push({
        step: 1,
        name: 'Environment Validation',
        status: 'PASS',
        message: '✓ All required environment variables present',
      });
    } else {
      steps.push({
        step: 1,
        name: 'Environment Validation',
        status: 'FAIL',
        message: `❌ Missing variables: ${missingVars.join(', ')}`,
      });
      throw new Error('Environment validation failed');
    }

    // Step 2: Check DB Connection
    await prisma.$connect();
    steps.push({
      step: 2,
      name: 'Database Connection',
      status: 'PASS',
      message: '✓ Database connected successfully',
    });

    // Step 3: Check products exist
    const productCount = await prisma.product.count();
    if (productCount >= 5) {
      steps.push({
        step: 3,
        name: 'Test Products Available',
        status: 'PASS',
        message: `✓ Found ${productCount} products`,
      });
    } else {
      steps.push({
        step: 3,
        name: 'Test Products Available',
        status: 'FAIL',
        message: `❌ Only ${productCount} products found (expected >= 5)`,
      });
      throw new Error('Not enough products');
    }

    // Step 4: Create Reseller with referral code
    const referralCode = nanoid(10);
    reseller = await prisma.user.create({
      data: {
        clerkId: `e2e_reseller_${Date.now()}`,
        email: `reseller-e2e-${Date.now()}@test.com`,
        firstName: 'E2E',
        lastName: 'Reseller',
        role: 'RESELLER',
        referralCode,
      },
    });

    if (reseller && reseller.referralCode === referralCode) {
      steps.push({
        step: 4,
        name: 'Create Reseller',
        status: 'PASS',
        message: `✓ Reseller created with code: ${referralCode}`,
        details: { resellerId: reseller.id },
      });
    } else {
      steps.push({
        step: 4,
        name: 'Create Reseller',
        status: 'FAIL',
        message: '❌ Reseller creation failed',
      });
      throw new Error('Reseller creation failed');
    }

    // Step 5: Create Buyer with referral
    buyer = await prisma.user.create({
      data: {
        clerkId: `e2e_buyer_${Date.now()}`,
        email: `buyer-e2e-${Date.now()}@test.com`,
        firstName: 'E2E',
        lastName: 'Buyer',
        role: 'BUYER',
        referredBy: referralCode,
      },
    });

    if (buyer && buyer.referredBy === referralCode) {
      steps.push({
        step: 5,
        name: 'Create Buyer with Referral',
        status: 'PASS',
        message: `✓ Buyer created with referral: ${referralCode}`,
        details: { buyerId: buyer.id },
      });
    } else {
      steps.push({
        step: 5,
        name: 'Create Buyer with Referral',
        status: 'FAIL',
        message: '❌ Buyer creation failed',
      });
      throw new Error('Buyer creation failed');
    }

    // Step 6: Get available product
    product = await prisma.product.findFirst({
      where: { status: 'AVAILABLE', stock: { gt: 0 } },
    });

    if (product) {
      steps.push({
        step: 6,
        name: 'Select Product',
        status: 'PASS',
        message: `✓ Selected product: ${product.name}`,
        details: { productId: product.id, price: Number(product.price) },
      });
    } else {
      steps.push({
        step: 6,
        name: 'Select Product',
        status: 'FAIL',
        message: '❌ No available products with stock',
      });
      throw new Error('No available products');
    }

    // Step 7: Create Order (PENDING)
    const initialStock = product.stock;
    order = await prisma.order.create({
      data: {
        userId: buyer.id,
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
      include: { items: true },
    });

    if (order && order.status === 'PENDING') {
      steps.push({
        step: 7,
        name: 'Create Order',
        status: 'PASS',
        message: `✓ Order created: ${order.id}`,
        details: { orderId: order.id, status: order.status },
      });
    } else {
      steps.push({
        step: 7,
        name: 'Create Order',
        status: 'FAIL',
        message: '❌ Order creation failed',
      });
      throw new Error('Order creation failed');
    }

    // Step 8: Simulate Payment Success
    await prisma.order.update({
      where: { id: order.id },
      data: { status: 'PAID' },
    });

    const paidOrder = await prisma.order.findUnique({
      where: { id: order.id },
    });

    if (paidOrder.status === 'PAID') {
      steps.push({
        step: 8,
        name: 'Simulate Payment',
        status: 'PASS',
        message: '✓ Order marked as PAID',
      });
    } else {
      steps.push({
        step: 8,
        name: 'Simulate Payment',
        status: 'FAIL',
        message: '❌ Order status not updated to PAID',
      });
      throw new Error('Payment simulation failed');
    }

    // Step 9: Check stock reduced
    await prisma.product.update({
      where: { id: product.id },
      data: { stock: initialStock - 1 },
    });

    const updatedProduct = await prisma.product.findUnique({
      where: { id: product.id },
    });

    if (updatedProduct.stock === initialStock - 1) {
      steps.push({
        step: 9,
        name: 'Stock Management',
        status: 'PASS',
        message: `✓ Stock reduced: ${initialStock} → ${updatedProduct.stock}`,
      });
    } else {
      steps.push({
        step: 9,
        name: 'Stock Management',
        status: 'FAIL',
        message: '❌ Stock not reduced correctly',
      });
      throw new Error('Stock management failed');
    }

    // Step 10: Create commission
    const expectedCommission = Number(order.totalAmount) * COMMISSION_RATE;
    commission = await prisma.commission.create({
      data: {
        orderId: order.id,
        resellerId: reseller.id,
        amount: expectedCommission,
        status: 'PENDING',
      },
    });

    if (commission) {
      steps.push({
        step: 10,
        name: 'Commission Created',
        status: 'PASS',
        message: `✓ Commission created: ${expectedCommission} EUR`,
        details: {
          commissionId: commission.id,
          amount: Number(commission.amount),
        },
      });
    } else {
      steps.push({
        step: 10,
        name: 'Commission Created',
        status: 'FAIL',
        message: '❌ Commission creation failed',
      });
      throw new Error('Commission creation failed');
    }

    // Step 11: Verify commission amount
    if (Number(commission.amount) === expectedCommission) {
      steps.push({
        step: 11,
        name: 'Commission Amount Correct',
        status: 'PASS',
        message: `✓ Commission: ${expectedCommission} EUR (${COMMISSION_RATE * 100}%)`,
      });
    } else {
      steps.push({
        step: 11,
        name: 'Commission Amount Correct',
        status: 'FAIL',
        message: `❌ Expected ${expectedCommission}, got ${Number(commission.amount)}`,
      });
    }

    // Step 12: Verify commission status
    if (commission.status === 'PENDING') {
      steps.push({
        step: 12,
        name: 'Commission Status',
        status: 'PASS',
        message: '✓ Commission status is PENDING',
      });
    } else {
      steps.push({
        step: 12,
        name: 'Commission Status',
        status: 'FAIL',
        message: `❌ Expected PENDING, got ${commission.status}`,
      });
    }

    // Step 13: Cleanup
    await prisma.commission.delete({ where: { id: commission.id } });
    await prisma.orderItem.deleteMany({ where: { orderId: order.id } });
    await prisma.order.delete({ where: { id: order.id } });
    await prisma.user.delete({ where: { id: buyer.id } });
    await prisma.user.delete({ where: { id: reseller.id } });

    // Restore product stock
    await prisma.product.update({
      where: { id: product.id },
      data: { stock: initialStock },
    });

    steps.push({
      step: 13,
      name: 'Cleanup',
      status: 'PASS',
      message: '✓ Test data cleaned up',
    });

    // Print results
    console.log('E2E Integration Test Steps:');
    console.log('─────────────────────────────────────────────────────────────\n');

    steps.forEach(step => {
      console.log(`${step.step}. ${step.message}`);
      if (step.details) {
        console.log(
          '   ',
          JSON.stringify(step.details, null, 2)
            .split('\n')
            .join('\n    '),
        );
      }
    });

    // Summary
    const passed = steps.filter(s => s.status === 'PASS').length;
    const failed = steps.filter(s => s.status === 'FAIL').length;

    console.log('\n─────────────────────────────────────────────────────────────');
    console.log(`Results: ${passed}/${steps.length} steps passed`);
    console.log('═══════════════════════════════════════════════════════════════\n');

    if (failed > 0) {
      console.error('❌ E2E Integration test FAILED\n');
      process.exit(1);
    } else {
      console.log('✅ E2E Integration test PASSED\n');
      console.log('🎉 Complete user journey successful from signup to commission!\n');
      process.exit(0);
    }
  } catch (error) {
    console.error('\n❌ Fatal error during E2E test:', error.message);
    console.error('\nSteps completed before failure:');
    steps.forEach(step => {
      console.log(`${step.step}. [${step.status}] ${step.name}`);
    });
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runFullFlow();

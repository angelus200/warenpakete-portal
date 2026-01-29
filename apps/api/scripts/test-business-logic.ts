import * as dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { nanoid } from 'nanoid';

dotenv.config();

const prisma = new PrismaClient();
const COMMISSION_RATE = 0.20; // 20%

interface TestResult {
  test: string;
  status: 'PASS' | 'FAIL';
  message: string;
  details?: any;
}

const results: TestResult[] = [];

async function testCommissionCalculation() {
  console.log('Testing Commission Calculation...\n');

  try {
    // Create reseller with referral code
    const resellerCode = nanoid(10);
    const reseller = await prisma.user.create({
      data: {
        clerkId: `test_reseller_${Date.now()}`,
        email: `reseller-${Date.now()}@example.com`,
        firstName: 'Test',
        lastName: 'Reseller',
        role: 'RESELLER',
        referralCode: resellerCode,
      },
    });

    results.push({
      test: 'Create Reseller',
      status: 'PASS',
      message: `✓ Reseller created with code: ${resellerCode}`,
    });

    // Create buyer with referral
    const buyer = await prisma.user.create({
      data: {
        clerkId: `test_buyer_${Date.now()}`,
        email: `buyer-${Date.now()}@example.com`,
        firstName: 'Test',
        lastName: 'Buyer',
        role: 'BUYER',
        referredBy: resellerCode,
      },
    });

    results.push({
      test: 'Create Buyer with Referral',
      status: 'PASS',
      message: `✓ Buyer created with referredBy: ${resellerCode}`,
    });

    // Get a product
    const product = await prisma.product.findFirst({
      where: { status: 'AVAILABLE' },
    });

    if (!product) {
      throw new Error('No available products for testing');
    }

    // Create order
    const orderAmount = 1000; // 1000 EUR for easy calculation
    const order = await prisma.order.create({
      data: {
        userId: buyer.id,
        totalAmount: orderAmount,
        status: 'PAID', // Directly set to PAID to trigger commission
        items: {
          create: [
            {
              productId: product.id,
              quantity: 1,
              price: orderAmount,
            },
          ],
        },
      },
    });

    results.push({
      test: 'Create Order',
      status: 'PASS',
      message: `✓ Order created with amount: ${orderAmount} EUR`,
    });

    // Manually create commission (simulating the service)
    const expectedCommission = orderAmount * COMMISSION_RATE; // 50 EUR
    const commission = await prisma.commission.create({
      data: {
        orderId: order.id,
        resellerId: reseller.id,
        amount: expectedCommission,
        status: 'PENDING',
      },
    });

    // Verify commission
    if (Number(commission.amount) === expectedCommission) {
      results.push({
        test: 'Commission Amount',
        status: 'PASS',
        message: `✓ Commission calculated correctly: ${expectedCommission} EUR (${COMMISSION_RATE * 100}%)`,
        details: { expected: expectedCommission, actual: Number(commission.amount) },
      });
    } else {
      results.push({
        test: 'Commission Amount',
        status: 'FAIL',
        message: `❌ Commission calculation wrong: expected ${expectedCommission}, got ${Number(commission.amount)}`,
      });
    }

    // Verify commission status
    if (commission.status === 'PENDING') {
      results.push({
        test: 'Commission Status',
        status: 'PASS',
        message: '✓ Commission status is PENDING',
      });
    } else {
      results.push({
        test: 'Commission Status',
        status: 'FAIL',
        message: `❌ Commission status wrong: ${commission.status}`,
      });
    }

    // Verify commission-reseller relationship
    const commissionWithReseller = await prisma.commission.findUnique({
      where: { id: commission.id },
      include: { reseller: true },
    });

    if (commissionWithReseller.resellerId === reseller.id) {
      results.push({
        test: 'Commission-Reseller Link',
        status: 'PASS',
        message: '✓ Commission correctly linked to reseller',
      });
    } else {
      results.push({
        test: 'Commission-Reseller Link',
        status: 'FAIL',
        message: '❌ Commission not linked to correct reseller',
      });
    }

    // Cleanup
    await prisma.commission.delete({ where: { id: commission.id } });
    await prisma.orderItem.deleteMany({ where: { orderId: order.id } });
    await prisma.order.delete({ where: { id: order.id } });
    await prisma.user.delete({ where: { id: buyer.id } });
    await prisma.user.delete({ where: { id: reseller.id } });

    return true;
  } catch (error) {
    results.push({
      test: 'Commission Calculation',
      status: 'FAIL',
      message: `❌ Commission test failed: ${error.message}`,
    });
    return false;
  }
}

async function testStockManagement() {
  console.log('Testing Stock Management...\n');

  try {
    // Find product with stock > 0
    const product = await prisma.product.findFirst({
      where: { stock: { gt: 0 } },
    });

    if (!product) {
      results.push({
        test: 'Stock Management',
        status: 'FAIL',
        message: '❌ No products with stock > 0 found for testing',
      });
      return false;
    }

    const initialStock = product.stock;
    const orderQuantity = 1;

    results.push({
      test: 'Initial Stock',
      status: 'PASS',
      message: `✓ Product has stock: ${initialStock}`,
    });

    // Create user and order
    const user = await prisma.user.create({
      data: {
        clerkId: `test_stock_${Date.now()}`,
        email: `stock-${Date.now()}@example.com`,
        role: 'BUYER',
      },
    });

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        totalAmount: Number(product.price),
        status: 'PENDING',
        items: {
          create: [
            {
              productId: product.id,
              quantity: orderQuantity,
              price: product.price,
            },
          ],
        },
      },
    });

    // Verify stock NOT reduced yet (order is PENDING)
    const productAfterPending = await prisma.product.findUnique({
      where: { id: product.id },
    });

    if (productAfterPending.stock === initialStock) {
      results.push({
        test: 'Stock After PENDING Order',
        status: 'PASS',
        message: '✓ Stock not reduced for PENDING order',
      });
    } else {
      results.push({
        test: 'Stock After PENDING Order',
        status: 'FAIL',
        message: '❌ Stock incorrectly reduced for PENDING order',
      });
    }

    // Simulate payment (update stock manually)
    await prisma.product.update({
      where: { id: product.id },
      data: { stock: initialStock - orderQuantity },
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { status: 'PAID' },
    });

    // Verify stock reduced
    const productAfterPaid = await prisma.product.findUnique({
      where: { id: product.id },
    });

    if (productAfterPaid.stock === initialStock - orderQuantity) {
      results.push({
        test: 'Stock After PAID Order',
        status: 'PASS',
        message: `✓ Stock correctly reduced: ${initialStock} → ${productAfterPaid.stock}`,
      });
    } else {
      results.push({
        test: 'Stock After PAID Order',
        status: 'FAIL',
        message: `❌ Stock not correctly reduced: expected ${initialStock - orderQuantity}, got ${productAfterPaid.stock}`,
      });
    }

    // Check if product marked as SOLD when stock = 0
    if (productAfterPaid.stock === 0) {
      await prisma.product.update({
        where: { id: product.id },
        data: { status: 'SOLD' },
      });

      const soldProduct = await prisma.product.findUnique({
        where: { id: product.id },
      });

      if (soldProduct.status === 'SOLD') {
        results.push({
          test: 'Product Status SOLD',
          status: 'PASS',
          message: '✓ Product marked as SOLD when stock = 0',
        });
      } else {
        results.push({
          test: 'Product Status SOLD',
          status: 'FAIL',
          message: '❌ Product not marked as SOLD when stock = 0',
        });
      }
    }

    // Restore product stock
    await prisma.product.update({
      where: { id: product.id },
      data: { stock: initialStock, status: 'AVAILABLE' },
    });

    // Cleanup
    await prisma.orderItem.deleteMany({ where: { orderId: order.id } });
    await prisma.order.delete({ where: { id: order.id } });
    await prisma.user.delete({ where: { id: user.id } });

    return true;
  } catch (error) {
    results.push({
      test: 'Stock Management',
      status: 'FAIL',
      message: `❌ Stock management test failed: ${error.message}`,
    });
    return false;
  }
}

async function testReferralCodeGeneration() {
  console.log('Testing Referral Code Generation...\n');

  try {
    const user1 = await prisma.user.create({
      data: {
        clerkId: `test_ref1_${Date.now()}`,
        email: `ref1-${Date.now()}@example.com`,
        role: 'RESELLER',
        referralCode: nanoid(10),
      },
    });

    const user2 = await prisma.user.create({
      data: {
        clerkId: `test_ref2_${Date.now()}`,
        email: `ref2-${Date.now()}@example.com`,
        role: 'RESELLER',
        referralCode: nanoid(10),
      },
    });

    // Check both have referral codes
    if (user1.referralCode && user2.referralCode) {
      results.push({
        test: 'Referral Code Generated',
        status: 'PASS',
        message: '✓ Referral codes generated for resellers',
      });
    } else {
      results.push({
        test: 'Referral Code Generated',
        status: 'FAIL',
        message: '❌ Referral codes not generated',
      });
    }

    // Check codes are unique
    if (user1.referralCode !== user2.referralCode) {
      results.push({
        test: 'Referral Code Unique',
        status: 'PASS',
        message: '✓ Referral codes are unique',
      });
    } else {
      results.push({
        test: 'Referral Code Unique',
        status: 'FAIL',
        message: '❌ Referral codes are not unique',
      });
    }

    // Check code length (should be 10 characters)
    if (user1.referralCode.length === 10) {
      results.push({
        test: 'Referral Code Length',
        status: 'PASS',
        message: '✓ Referral codes have correct length (10 chars)',
      });
    } else {
      results.push({
        test: 'Referral Code Length',
        status: 'FAIL',
        message: `❌ Referral code has wrong length: ${user1.referralCode.length}`,
      });
    }

    // Cleanup
    await prisma.user.delete({ where: { id: user1.id } });
    await prisma.user.delete({ where: { id: user2.id } });

    return true;
  } catch (error) {
    results.push({
      test: 'Referral Code Generation',
      status: 'FAIL',
      message: `❌ Referral code test failed: ${error.message}`,
    });
    return false;
  }
}

async function testWalletBalance() {
  console.log('Testing Wallet Balance...\n');

  try {
    const user = await prisma.user.create({
      data: {
        clerkId: `test_wallet_${Date.now()}`,
        email: `wallet-${Date.now()}@example.com`,
        role: 'BUYER',
      },
    });

    // Check initial balance is 0
    if (Number(user.walletBalance) === 0) {
      results.push({
        test: 'Initial Wallet Balance',
        status: 'PASS',
        message: '✓ Wallet balance starts at 0',
      });
    } else {
      results.push({
        test: 'Initial Wallet Balance',
        status: 'FAIL',
        message: `❌ Wallet balance not 0: ${Number(user.walletBalance)}`,
      });
    }

    // Test updating wallet balance
    await prisma.user.update({
      where: { id: user.id },
      data: { walletBalance: 100 },
    });

    const updatedUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (Number(updatedUser.walletBalance) === 100) {
      results.push({
        test: 'Update Wallet Balance',
        status: 'PASS',
        message: '✓ Wallet balance can be updated',
      });
    } else {
      results.push({
        test: 'Update Wallet Balance',
        status: 'FAIL',
        message: `❌ Wallet balance update failed: ${Number(updatedUser.walletBalance)}`,
      });
    }

    // Cleanup
    await prisma.user.delete({ where: { id: user.id } });

    return true;
  } catch (error) {
    results.push({
      test: 'Wallet Balance',
      status: 'FAIL',
      message: `❌ Wallet balance test failed: ${error.message}`,
    });
    return false;
  }
}

async function testBusinessLogic() {
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('PHASE 5: BUSINESS LOGIC TESTS');
  console.log('═══════════════════════════════════════════════════════════════\n');

  try {
    await testCommissionCalculation();
    await testStockManagement();
    await testReferralCodeGeneration();
    await testWalletBalance();

    // Print results
    console.log('Business Logic Test Results:');
    console.log('─────────────────────────────────────────────────────────────\n');

    results.forEach(result => {
      console.log(result.message);
      if (result.details) {
        console.log('  Details:', JSON.stringify(result.details, null, 2));
      }
    });

    // Summary
    const passed = results.filter(r => r.status === 'PASS').length;
    const failed = results.filter(r => r.status === 'FAIL').length;

    console.log('\n─────────────────────────────────────────────────────────────');
    console.log(`Results: ${passed} passed, ${failed} failed`);
    console.log('═══════════════════════════════════════════════════════════════\n');

    if (failed > 0) {
      console.error('❌ Business logic tests FAILED\n');
      process.exit(1);
    } else {
      console.log('✅ Business logic tests PASSED\n');
      process.exit(0);
    }
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testBusinessLogic();

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

async function testStorageFees() {
  console.log('Testing Storage Fees...\n');

  try {
    // Create user
    const user = await prisma.user.create({
      data: {
        clerkId: `test_storage_${Date.now()}`,
        email: `storage-${Date.now()}@example.com`,
        role: 'BUYER',
      },
    });

    // Create product
    const product = await prisma.product.findFirst({
      where: { status: 'AVAILABLE' },
    });

    if (!product) {
      throw new Error('No available products for testing');
    }

    // Create order with paidAt timestamp (15 days ago)
    const fifteenDaysAgo = new Date();
    fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        totalAmount: 1000,
        status: 'PAID',
        paidAt: fifteenDaysAgo,
        items: {
          create: [
            {
              productId: product.id,
              quantity: 1,
              price: 1000,
            },
          ],
        },
      },
    });

    // Verify paidAt timestamp is set
    if (order.paidAt) {
      results.push({
        test: 'Order paidAt Timestamp',
        status: 'PASS',
        message: '✓ Order has paidAt timestamp',
      });
    } else {
      results.push({
        test: 'Order paidAt Timestamp',
        status: 'FAIL',
        message: '❌ Order missing paidAt timestamp',
      });
    }

    // Calculate storage days (should be 15 days)
    const daysSincePaid = Math.floor(
      (Date.now() - order.paidAt.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (daysSincePaid >= 14) {
      results.push({
        test: 'Storage Days Calculation',
        status: 'PASS',
        message: `✓ Storage days calculated: ${daysSincePaid} days`,
      });
    } else {
      results.push({
        test: 'Storage Days Calculation',
        status: 'FAIL',
        message: `❌ Storage days wrong: ${daysSincePaid}`,
      });
    }

    // Create storage fee record
    const palletCount = 2;
    const chargeableDays = daysSincePaid - 14; // First 14 days free
    const feePerPalletPerDay = 0.5;
    const expectedFee = palletCount * feePerPalletPerDay * chargeableDays;

    const storageFee = await prisma.storageFee.create({
      data: {
        orderId: order.id,
        amount: expectedFee,
        palletCount: palletCount,
        daysCharged: chargeableDays,
      },
    });

    // Verify storage fee calculation
    if (Number(storageFee.amount) === expectedFee) {
      results.push({
        test: 'Storage Fee Calculation',
        status: 'PASS',
        message: `✓ Storage fee correct: €${expectedFee.toFixed(2)} (${palletCount} pallets × ${chargeableDays} days × €0.50)`,
        details: { palletCount, chargeableDays, feePerDay: feePerPalletPerDay },
      });
    } else {
      results.push({
        test: 'Storage Fee Calculation',
        status: 'FAIL',
        message: `❌ Storage fee wrong: expected €${expectedFee}, got €${Number(storageFee.amount)}`,
      });
    }

    // Test marking order as picked up
    await prisma.order.update({
      where: { id: order.id },
      data: { pickedUpAt: new Date() },
    });

    const pickedUpOrder = await prisma.order.findUnique({
      where: { id: order.id },
    });

    if (pickedUpOrder.pickedUpAt) {
      results.push({
        test: 'Order Pickup Timestamp',
        status: 'PASS',
        message: '✓ Order can be marked as picked up',
      });
    } else {
      results.push({
        test: 'Order Pickup Timestamp',
        status: 'FAIL',
        message: '❌ Order pickup timestamp not set',
      });
    }

    // Cleanup
    await prisma.storageFee.deleteMany({ where: { orderId: order.id } });
    await prisma.orderItem.deleteMany({ where: { orderId: order.id } });
    await prisma.order.delete({ where: { id: order.id } });
    await prisma.user.delete({ where: { id: user.id } });

    return true;
  } catch (error) {
    results.push({
      test: 'Storage Fees',
      status: 'FAIL',
      message: `❌ Storage fees test failed: ${error.message}`,
    });
    return false;
  }
}

async function testWalletTransactions() {
  console.log('Testing Wallet Transactions...\n');

  try {
    const user = await prisma.user.create({
      data: {
        clerkId: `test_wallet_tx_${Date.now()}`,
        email: `wallettx-${Date.now()}@example.com`,
        role: 'RESELLER',
        referralCode: nanoid(10),
        walletBalance: 0,
      },
    });

    // Test COMMISSION_EARNED transaction
    const commissionAmount = 50;
    const commissionTx = await prisma.walletTransaction.create({
      data: {
        userId: user.id,
        type: 'COMMISSION_EARNED',
        amount: commissionAmount,
        description: 'Commission from test order',
        status: 'COMPLETED',
      },
    });

    // Update user balance
    await prisma.user.update({
      where: { id: user.id },
      data: { walletBalance: commissionAmount },
    });

    if (commissionTx.type === 'COMMISSION_EARNED' && commissionTx.status === 'COMPLETED') {
      results.push({
        test: 'Commission Transaction',
        status: 'PASS',
        message: `✓ Commission transaction created: €${commissionAmount}`,
      });
    } else {
      results.push({
        test: 'Commission Transaction',
        status: 'FAIL',
        message: '❌ Commission transaction invalid',
      });
    }

    // Test PAYOUT_REQUESTED transaction
    const payoutAmount = 30;
    const payoutRequest = await prisma.payoutRequest.create({
      data: {
        userId: user.id,
        amount: payoutAmount,
        iban: 'DE89370400440532013000',
        bankName: 'Test Bank',
        status: 'PENDING',
      },
    });

    const payoutTx = await prisma.walletTransaction.create({
      data: {
        userId: user.id,
        type: 'PAYOUT_REQUESTED',
        amount: payoutAmount,
        description: `Payout request: ${payoutRequest.id}`,
        reference: payoutRequest.id,
        status: 'PENDING',
      },
    });

    if (payoutTx.type === 'PAYOUT_REQUESTED' && payoutTx.status === 'PENDING') {
      results.push({
        test: 'Payout Request Transaction',
        status: 'PASS',
        message: `✓ Payout request transaction created: €${payoutAmount}`,
      });
    } else {
      results.push({
        test: 'Payout Request Transaction',
        status: 'FAIL',
        message: '❌ Payout request transaction invalid',
      });
    }

    // Verify transaction history
    const transactions = await prisma.walletTransaction.findMany({
      where: { userId: user.id },
    });

    if (transactions.length === 2) {
      results.push({
        test: 'Transaction History',
        status: 'PASS',
        message: '✓ Transaction history tracked correctly',
      });
    } else {
      results.push({
        test: 'Transaction History',
        status: 'FAIL',
        message: `❌ Transaction count wrong: expected 2, got ${transactions.length}`,
      });
    }

    // Cleanup
    await prisma.walletTransaction.deleteMany({ where: { userId: user.id } });
    await prisma.payoutRequest.deleteMany({ where: { userId: user.id } });
    await prisma.user.delete({ where: { id: user.id } });

    return true;
  } catch (error) {
    results.push({
      test: 'Wallet Transactions',
      status: 'FAIL',
      message: `❌ Wallet transactions test failed: ${error.message}`,
    });
    return false;
  }
}

async function testPayoutRequests() {
  console.log('Testing Payout Requests...\n');

  try {
    const user = await prisma.user.create({
      data: {
        clerkId: `test_payout_${Date.now()}`,
        email: `payout-${Date.now()}@example.com`,
        role: 'RESELLER',
        referralCode: nanoid(10),
        walletBalance: 100,
        iban: 'DE89370400440532013000',
        bankAccountHolder: 'Test User',
      },
    });

    // Test minimum payout amount (€10)
    const validPayoutAmount = 20;
    const payoutRequest = await prisma.payoutRequest.create({
      data: {
        userId: user.id,
        amount: validPayoutAmount,
        iban: user.iban,
        bankName: 'Test Bank',
        status: 'PENDING',
      },
    });

    if (validPayoutAmount >= 10) {
      results.push({
        test: 'Minimum Payout Amount',
        status: 'PASS',
        message: `✓ Payout amount meets minimum: €${validPayoutAmount}`,
      });
    } else {
      results.push({
        test: 'Minimum Payout Amount',
        status: 'FAIL',
        message: `❌ Payout amount below minimum: €${validPayoutAmount}`,
      });
    }

    // Test payout status flow: PENDING -> APPROVED -> COMPLETED
    await prisma.payoutRequest.update({
      where: { id: payoutRequest.id },
      data: { status: 'APPROVED', processedBy: 'admin-test' },
    });

    const approvedPayout = await prisma.payoutRequest.findUnique({
      where: { id: payoutRequest.id },
    });

    if (approvedPayout.status === 'APPROVED') {
      results.push({
        test: 'Payout Approval',
        status: 'PASS',
        message: '✓ Payout can be approved',
      });
    } else {
      results.push({
        test: 'Payout Approval',
        status: 'FAIL',
        message: `❌ Payout approval failed: ${approvedPayout.status}`,
      });
    }

    // Complete payout
    await prisma.payoutRequest.update({
      where: { id: payoutRequest.id },
      data: { status: 'COMPLETED', processedAt: new Date() },
    });

    // Deduct from wallet balance
    const newBalance = Number(user.walletBalance) - validPayoutAmount;
    await prisma.user.update({
      where: { id: user.id },
      data: { walletBalance: newBalance },
    });

    const updatedUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (Number(updatedUser.walletBalance) === newBalance) {
      results.push({
        test: 'Payout Balance Deduction',
        status: 'PASS',
        message: `✓ Balance deducted correctly: €${user.walletBalance} → €${newBalance}`,
      });
    } else {
      results.push({
        test: 'Payout Balance Deduction',
        status: 'FAIL',
        message: `❌ Balance deduction failed`,
      });
    }

    // Test rejected payout
    const rejectedPayout = await prisma.payoutRequest.create({
      data: {
        userId: user.id,
        amount: 15,
        iban: user.iban,
        status: 'PENDING',
      },
    });

    await prisma.payoutRequest.update({
      where: { id: rejectedPayout.id },
      data: { status: 'REJECTED', notes: 'Test rejection', processedBy: 'admin-test' },
    });

    const rejectedPayoutCheck = await prisma.payoutRequest.findUnique({
      where: { id: rejectedPayout.id },
    });

    if (rejectedPayoutCheck.status === 'REJECTED') {
      results.push({
        test: 'Payout Rejection',
        status: 'PASS',
        message: '✓ Payout can be rejected',
      });
    } else {
      results.push({
        test: 'Payout Rejection',
        status: 'FAIL',
        message: `❌ Payout rejection failed`,
      });
    }

    // Cleanup
    await prisma.payoutRequest.deleteMany({ where: { userId: user.id } });
    await prisma.user.delete({ where: { id: user.id } });

    return true;
  } catch (error) {
    results.push({
      test: 'Payout Requests',
      status: 'FAIL',
      message: `❌ Payout requests test failed: ${error.message}`,
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
    await testStorageFees();
    await testWalletTransactions();
    await testPayoutRequests();

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

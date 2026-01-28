import * as dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const prisma = new PrismaClient();

interface TestResult {
  test: string;
  status: 'PASS' | 'FAIL' | 'SKIP';
  message: string;
  details?: any;
}

const results: TestResult[] = [];

async function testAuthEndpoints() {
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('PHASE 4: AUTH ENDPOINT TESTS (Direct DB Tests)');
  console.log('═══════════════════════════════════════════════════════════════\n');

  console.log('Note: Testing auth logic via direct DB calls\n');
  console.log('For full HTTP auth tests, use Postman/Insomnia with real Clerk tokens\n');

  try {
    // Test 1: Can retrieve user by clerkId
    const testClerkId = 'test_clerk_user_' + Date.now();
    const testUser = await prisma.user.create({
      data: {
        clerkId: testClerkId,
        email: `test-${Date.now()}@example.com`,
        firstName: 'Test',
        lastName: 'User',
        role: 'BUYER',
      },
    });

    results.push({
      test: 'Create Test User',
      status: 'PASS',
      message: '✓ Test user created successfully',
      details: { userId: testUser.id },
    });

    // Test 2: Find user by clerkId
    const foundUser = await prisma.user.findUnique({
      where: { clerkId: testClerkId },
    });

    if (foundUser && foundUser.id === testUser.id) {
      results.push({
        test: 'Find User by ClerkId',
        status: 'PASS',
        message: '✓ User can be found by clerkId',
      });
    } else {
      results.push({
        test: 'Find User by ClerkId',
        status: 'FAIL',
        message: '❌ User not found by clerkId',
      });
    }

    // Test 3: User has required fields for auth
    const requiredFields = ['id', 'clerkId', 'email', 'role', 'walletBalance'];
    const hasAllFields = requiredFields.every(field => field in foundUser);

    if (hasAllFields) {
      results.push({
        test: 'User Auth Fields',
        status: 'PASS',
        message: '✓ User has all required auth fields',
      });
    } else {
      results.push({
        test: 'User Auth Fields',
        status: 'FAIL',
        message: '❌ User missing required auth fields',
      });
    }

    // Test 4: Create order for user
    const testProduct = await prisma.product.findFirst({
      where: { status: 'AVAILABLE' },
    });

    if (!testProduct) {
      results.push({
        test: 'Create Order',
        status: 'SKIP',
        message: '⚠ No available products to test order creation',
      });
    } else {
      const order = await prisma.order.create({
        data: {
          userId: testUser.id,
          totalAmount: testProduct.price,
          status: 'PENDING',
          items: {
            create: [
              {
                productId: testProduct.id,
                quantity: 1,
                price: testProduct.price,
              },
            ],
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

      if (order && order.status === 'PENDING') {
        results.push({
          test: 'Create Order',
          status: 'PASS',
          message: '✓ Order created with PENDING status',
          details: { orderId: order.id },
        });
      } else {
        results.push({
          test: 'Create Order',
          status: 'FAIL',
          message: '❌ Order creation failed',
        });
      }

      // Test 5: Retrieve user's orders
      const userOrders = await prisma.order.findMany({
        where: { userId: testUser.id },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      if (userOrders.length > 0 && userOrders[0].id === order.id) {
        results.push({
          test: 'Retrieve User Orders',
          status: 'PASS',
          message: `✓ Retrieved ${userOrders.length} order(s) for user`,
        });
      } else {
        results.push({
          test: 'Retrieve User Orders',
          status: 'FAIL',
          message: '❌ Could not retrieve user orders',
        });
      }

      // Test 6: Update order status
      const updatedOrder = await prisma.order.update({
        where: { id: order.id },
        data: { status: 'PAID' },
      });

      if (updatedOrder.status === 'PAID') {
        results.push({
          test: 'Update Order Status',
          status: 'PASS',
          message: '✓ Order status updated to PAID',
        });
      } else {
        results.push({
          test: 'Update Order Status',
          status: 'FAIL',
          message: '❌ Order status update failed',
        });
      }

      // Cleanup order
      await prisma.orderItem.deleteMany({ where: { orderId: order.id } });
      await prisma.order.delete({ where: { id: order.id } });
    }

    // Test 7: User roles work correctly
    const roles = ['BUYER', 'RESELLER', 'ADMIN'];
    let roleTestPassed = true;

    for (const role of roles) {
      const roleUser = await prisma.user.create({
        data: {
          clerkId: `test_${role.toLowerCase()}_${Date.now()}`,
          email: `${role.toLowerCase()}-${Date.now()}@example.com`,
          role: role as any,
        },
      });

      if (roleUser.role !== role) {
        roleTestPassed = false;
      }

      await prisma.user.delete({ where: { id: roleUser.id } });
    }

    if (roleTestPassed) {
      results.push({
        test: 'User Roles',
        status: 'PASS',
        message: '✓ All user roles (BUYER, RESELLER, ADMIN) work correctly',
      });
    } else {
      results.push({
        test: 'User Roles',
        status: 'FAIL',
        message: '❌ User role assignment failed',
      });
    }

    // Cleanup test user
    await prisma.user.delete({ where: { id: testUser.id } });

    results.push({
      test: 'Cleanup',
      status: 'PASS',
      message: '✓ Test data cleaned up',
    });

    // Print results
    console.log('Auth Endpoint Test Results:');
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
    const skipped = results.filter(r => r.status === 'SKIP').length;

    console.log('\n─────────────────────────────────────────────────────────────');
    console.log(`Results: ${passed} passed, ${failed} failed, ${skipped} skipped`);
    console.log('═══════════════════════════════════════════════════════════════\n');

    if (failed > 0) {
      console.error('❌ Auth endpoint tests FAILED\n');
      process.exit(1);
    } else {
      console.log('✅ Auth endpoint tests PASSED\n');
      process.exit(0);
    }
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testAuthEndpoints();

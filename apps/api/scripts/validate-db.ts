import * as dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const prisma = new PrismaClient();

interface CheckResult {
  name: string;
  status: 'PASS' | 'FAIL' | 'WARN';
  message: string;
  details?: any;
}

const results: CheckResult[] = [];

async function checkTableExists(tableName: string, expectedCount?: number) {
  try {
    let count: number;

    switch (tableName) {
      case 'users':
        count = await prisma.user.count();
        break;
      case 'products':
        count = await prisma.product.count();
        break;
      case 'orders':
        count = await prisma.order.count();
        break;
      case 'order_items':
        count = await prisma.orderItem.count();
        break;
      case 'commissions':
        count = await prisma.commission.count();
        break;
      default:
        throw new Error(`Unknown table: ${tableName}`);
    }

    let status: 'PASS' | 'WARN' = 'PASS';
    let message = `✓ Table '${tableName}' exists (${count} rows)`;

    if (expectedCount !== undefined && count !== expectedCount) {
      status = 'WARN';
      message = `⚠ Table '${tableName}' exists but has ${count} rows (expected ${expectedCount})`;
    }

    results.push({ name: tableName, status, message, details: { count } });
    return true;
  } catch (error) {
    results.push({
      name: tableName,
      status: 'FAIL',
      message: `❌ Table '${tableName}' check failed: ${error.message}`,
    });
    return false;
  }
}

async function checkUserFields() {
  try {
    const user = await prisma.user.findFirst();

    if (!user) {
      results.push({
        name: 'User Schema',
        status: 'WARN',
        message: '⚠ No users in database to validate schema',
      });
      return true;
    }

    const requiredFields = [
      'id',
      'clerkId',
      'email',
      'role',
      'walletBalance',
      'referralCode',
      'createdAt',
      'updatedAt',
    ];

    const missingFields = requiredFields.filter(field => !(field in user));

    if (missingFields.length > 0) {
      results.push({
        name: 'User Schema',
        status: 'FAIL',
        message: `❌ User table missing fields: ${missingFields.join(', ')}`,
      });
      return false;
    }

    results.push({
      name: 'User Schema',
      status: 'PASS',
      message: '✓ User table has all required fields',
      details: { sampleUserId: user.id },
    });
    return true;
  } catch (error) {
    results.push({
      name: 'User Schema',
      status: 'FAIL',
      message: `❌ User schema validation failed: ${error.message}`,
    });
    return false;
  }
}

async function checkProductFields() {
  try {
    const product = await prisma.product.findFirst();

    if (!product) {
      results.push({
        name: 'Product Schema',
        status: 'FAIL',
        message: '❌ No products in database - expected at least 5 test products',
      });
      return false;
    }

    const requiredFields = [
      'id',
      'name',
      'price',
      'retailValue',
      'stock',
      'palletCount',
      'status',
      'images',
      'createdAt',
      'updatedAt',
    ];

    const missingFields = requiredFields.filter(field => !(field in product));

    if (missingFields.length > 0) {
      results.push({
        name: 'Product Schema',
        status: 'FAIL',
        message: `❌ Product table missing fields: ${missingFields.join(', ')}`,
      });
      return false;
    }

    results.push({
      name: 'Product Schema',
      status: 'PASS',
      message: '✓ Product table has all required fields',
      details: { sampleProductId: product.id },
    });
    return true;
  } catch (error) {
    results.push({
      name: 'Product Schema',
      status: 'FAIL',
      message: `❌ Product schema validation failed: ${error.message}`,
    });
    return false;
  }
}

async function checkRelations() {
  try {
    // Check if we can join orders with users
    const orderWithUser = await prisma.order.findFirst({
      include: { user: true },
    });

    if (orderWithUser && orderWithUser.user) {
      results.push({
        name: 'Order-User Relation',
        status: 'PASS',
        message: '✓ Order → User relation works',
      });
    } else if (orderWithUser) {
      results.push({
        name: 'Order-User Relation',
        status: 'FAIL',
        message: '❌ Order → User relation broken',
      });
      return false;
    } else {
      results.push({
        name: 'Order-User Relation',
        status: 'WARN',
        message: '⚠ No orders to test relation',
      });
    }

    // Check if we can join orderItems with products
    const orderItemWithProduct = await prisma.orderItem.findFirst({
      include: { product: true },
    });

    if (orderItemWithProduct && orderItemWithProduct.product) {
      results.push({
        name: 'OrderItem-Product Relation',
        status: 'PASS',
        message: '✓ OrderItem → Product relation works',
      });
    } else if (orderItemWithProduct) {
      results.push({
        name: 'OrderItem-Product Relation',
        status: 'FAIL',
        message: '❌ OrderItem → Product relation broken',
      });
      return false;
    } else {
      results.push({
        name: 'OrderItem-Product Relation',
        status: 'WARN',
        message: '⚠ No order items to test relation',
      });
    }

    // Check commission-reseller relation
    const commissionWithReseller = await prisma.commission.findFirst({
      include: { reseller: true },
    });

    if (commissionWithReseller && commissionWithReseller.reseller) {
      results.push({
        name: 'Commission-Reseller Relation',
        status: 'PASS',
        message: '✓ Commission → Reseller relation works',
      });
    } else if (commissionWithReseller) {
      results.push({
        name: 'Commission-Reseller Relation',
        status: 'FAIL',
        message: '❌ Commission → Reseller relation broken',
      });
      return false;
    } else {
      results.push({
        name: 'Commission-Reseller Relation',
        status: 'WARN',
        message: '⚠ No commissions to test relation',
      });
    }

    return true;
  } catch (error) {
    results.push({
      name: 'Relations',
      status: 'FAIL',
      message: `❌ Relation check failed: ${error.message}`,
    });
    return false;
  }
}

async function validateDatabase() {
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('PHASE 2: DATABASE VALIDATION');
  console.log('═══════════════════════════════════════════════════════════════\n');

  try {
    // Check all tables exist
    await checkTableExists('users');
    await checkTableExists('products', 5); // Expect 5 test products
    await checkTableExists('orders');
    await checkTableExists('order_items');
    await checkTableExists('commissions');

    // Check schema fields
    await checkUserFields();
    await checkProductFields();

    // Check relations
    await checkRelations();

    // Print results
    console.log('Database Checks:');
    console.log('─────────────────────────────────────────────────────────────\n');

    results.forEach(result => {
      console.log(result.message);
      if (result.details) {
        console.log('  ', JSON.stringify(result.details, null, 2));
      }
    });

    // Summary
    const passed = results.filter(r => r.status === 'PASS').length;
    const failed = results.filter(r => r.status === 'FAIL').length;
    const warnings = results.filter(r => r.status === 'WARN').length;

    console.log('\n─────────────────────────────────────────────────────────────');
    console.log(`Results: ${passed} passed, ${failed} failed, ${warnings} warnings`);
    console.log('═══════════════════════════════════════════════════════════════\n');

    if (failed > 0) {
      console.error('❌ Database validation FAILED\n');
      process.exit(1);
    } else {
      console.log('✅ Database validation PASSED\n');
      process.exit(0);
    }
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

validateDatabase();

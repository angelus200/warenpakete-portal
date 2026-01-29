import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('=== DATABASE STATUS CHECK ===\n');

  // Check users
  const userCount = await prisma.user.count();
  const users = await prisma.user.findMany({
    select: {
      id: true,
      clerkId: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      createdAt: true,
    },
    take: 10,
  });

  console.log(`📊 USERS: ${userCount} total`);
  console.log('Recent users:');
  users.forEach(user => {
    console.log(`  - ${user.email} (${user.clerkId}) - ${user.role}`);
  });
  console.log();

  // Check products
  const productCount = await prisma.product.count();
  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      price: true,
      stock: true,
      status: true,
    },
    take: 10,
  });

  console.log(`📦 PRODUCTS: ${productCount} total`);
  console.log('Recent products:');
  products.forEach(product => {
    console.log(`  - ${product.name}: €${product.price} (Stock: ${product.stock}, Status: ${product.status})`);
  });
  console.log();

  // Check orders
  const orderCount = await prisma.order.count();
  const orders = await prisma.order.findMany({
    select: {
      id: true,
      userId: true,
      totalAmount: true,
      status: true,
      createdAt: true,
    },
    take: 5,
    orderBy: { createdAt: 'desc' },
  });

  console.log(`🛒 ORDERS: ${orderCount} total`);
  console.log('Recent orders:');
  orders.forEach(order => {
    console.log(`  - ${order.id.substring(0, 8)}... - €${order.totalAmount} (${order.status})`);
  });
  console.log();
}

main()
  .catch(e => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

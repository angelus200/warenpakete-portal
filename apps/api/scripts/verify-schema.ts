import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('=== SCHEMA VERIFICATION ===\n');

  // Check if commission_contracts table exists
  try {
    const count = await prisma.commissionContract.count();
    console.log('✅ commission_contracts table exists');
    console.log(`   Current contracts: ${count}`);
  } catch (error) {
    console.error('❌ commission_contracts table ERROR:', error.message);
  }

  // Check if Order.fulfillmentType field exists
  try {
    const orders = await prisma.order.findMany({
      select: { id: true, fulfillmentType: true },
      take: 1,
    });
    console.log('✅ Order.fulfillmentType field exists');
    console.log(`   Sample: ${JSON.stringify(orders[0] || 'no orders yet')}`);
  } catch (error) {
    console.error('❌ Order.fulfillmentType field ERROR:', error.message);
  }

  console.log('\n✅ Schema verification complete!');
}

main()
  .catch(e => {
    console.error('❌ Verification failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

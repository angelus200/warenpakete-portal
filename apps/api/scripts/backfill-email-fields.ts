/**
 * Backfill Script für Email Automation Felder
 *
 * Dieses Script:
 * 1. Setzt User.firstOrderAt für bestehende User mit Orders
 * 2. Markiert bestehende User als emailSequenceCompleted = true (verhindert Spam)
 *
 * Run: npx ts-node scripts/backfill-email-fields.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function backfillEmailFields() {
  console.log('Starting email fields backfill...');

  try {
    // 1. Backfill User.firstOrderAt für bestehende User mit Orders
    console.log('\n1. Backfilling User.firstOrderAt...');

    const usersWithOrders = await prisma.user.findMany({
      where: {
        orders: {
          some: {
            status: 'PAID',
          },
        },
        firstOrderAt: null,
      },
      include: {
        orders: {
          where: {
            status: 'PAID',
          },
          orderBy: {
            createdAt: 'asc',
          },
          take: 1,
        },
      },
    });

    console.log(`Found ${usersWithOrders.length} users with orders but no firstOrderAt`);

    for (const user of usersWithOrders) {
      if (user.orders.length > 0) {
        const firstOrder = user.orders[0];
        await prisma.user.update({
          where: { id: user.id },
          data: {
            firstOrderAt: firstOrder.createdAt,
          },
        });
        console.log(`✓ Set firstOrderAt for user ${user.email}: ${firstOrder.createdAt.toISOString()}`);
      }
    }

    // 2. Markiere ALLE bestehenden User als emailSequenceCompleted = true
    console.log('\n2. Marking existing users as emailSequenceCompleted...');

    const updateResult = await prisma.user.updateMany({
      where: {
        emailSequenceCompleted: false,
      },
      data: {
        emailSequenceCompleted: true,
      },
    });

    console.log(`✓ Marked ${updateResult.count} existing users as emailSequenceCompleted`);

    console.log('\n✅ Backfill completed successfully!');
  } catch (error) {
    console.error('❌ Error during backfill:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

backfillEmailFields()
  .then(() => {
    console.log('\n🎉 Script finished');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });

/**
 * Sync Script: Clerk Users → PostgreSQL
 *
 * Holt alle User von Clerk API und gleicht sie mit der PostgreSQL DB ab.
 * Fehlende User werden automatisch angelegt.
 *
 * Usage:
 *   npx ts-node scripts/sync-clerk-users.ts
 *
 * Environment:
 *   Benötigt: CLERK_SECRET_KEY, DATABASE_URL
 */

import { PrismaClient } from '@prisma/client';
import { Clerk } from '@clerk/backend';
import { nanoid } from 'nanoid';

const prisma = new PrismaClient();
const clerk = Clerk({ secretKey: process.env.CLERK_SECRET_KEY });

interface SyncResult {
  total: number;
  existing: number;
  created: number;
  failed: number;
  users: {
    email: string;
    status: 'existing' | 'created' | 'failed';
    error?: string;
  }[];
}

async function syncClerkUsers(dryRun = false): Promise<SyncResult> {
  const result: SyncResult = {
    total: 0,
    existing: 0,
    created: 0,
    failed: 0,
    users: [],
  };

  try {
    console.log('🔄 Starting Clerk → PostgreSQL user sync...\n');

    // 1. Fetch all users from Clerk
    console.log('📥 Fetching all users from Clerk API...');
    const clerkUsers = await clerk.users.getUserList();
    result.total = clerkUsers.length;

    console.log(`✅ Found ${result.total} users in Clerk\n`);

    // 2. Get all existing clerkIds from database
    console.log('🔍 Checking existing users in PostgreSQL...');
    const dbUsers = await prisma.user.findMany({
      select: { clerkId: true, email: true },
    });

    const existingClerkIds = new Set(dbUsers.map((u) => u.clerkId));
    console.log(`✅ Found ${dbUsers.length} users in PostgreSQL\n`);

    // 3. Process each Clerk user
    console.log('⚙️  Processing users...\n');

    for (const clerkUser of clerkUsers) {
      const email = clerkUser.emailAddresses[0]?.emailAddress || 'no-email';
      const clerkId = clerkUser.id;

      // Check if user already exists
      if (existingClerkIds.has(clerkId)) {
        console.log(`✓ EXISTING: ${email} (${clerkId})`);
        result.existing++;
        result.users.push({
          email,
          status: 'existing',
        });
        continue;
      }

      // User missing in DB - create it
      try {
        if (dryRun) {
          console.log(`🔍 WOULD CREATE: ${email} (${clerkId})`);
          console.log(`   → Name: ${clerkUser.firstName || 'N/A'} ${clerkUser.lastName || 'N/A'}\n`);
        } else {
          const newUser = await prisma.user.create({
            data: {
              clerkId: clerkId,
              email: email,
              firstName: clerkUser.firstName || null,
              lastName: clerkUser.lastName || null,
              referralCode: nanoid(10),
              // Set default values for B2B fields
              isBusinessCustomer: false,
              role: 'BUYER',
            },
          });

          console.log(`✅ CREATED: ${email} (${clerkId})`);
          console.log(`   → DB ID: ${newUser.id}`);
          console.log(`   → Name: ${newUser.firstName || 'N/A'} ${newUser.lastName || 'N/A'}`);
          console.log(`   → Referral Code: ${newUser.referralCode}\n`);
        }

        result.created++;
        result.users.push({
          email,
          status: 'created',
        });
      } catch (error) {
        console.error(`❌ FAILED: ${email} (${clerkId})`);
        console.error(`   Error: ${error.message}\n`);

        result.failed++;
        result.users.push({
          email,
          status: 'failed',
          error: error.message,
        });
      }
    }

    return result;
  } catch (error) {
    console.error('💥 Fatal error during sync:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');

  console.log('═══════════════════════════════════════════════════');
  console.log('  CLERK → POSTGRESQL USER SYNC');
  if (dryRun) {
    console.log('  🔍 DRY RUN MODE (no changes will be made)');
  }
  console.log('═══════════════════════════════════════════════════\n');

  // Validate environment
  if (!process.env.CLERK_SECRET_KEY) {
    console.error('❌ ERROR: CLERK_SECRET_KEY not set in environment');
    process.exit(1);
  }

  if (!process.env.DATABASE_URL) {
    console.error('❌ ERROR: DATABASE_URL not set in environment');
    process.exit(1);
  }

  try {
    const result = await syncClerkUsers(dryRun);

    // Print summary
    console.log('\n═══════════════════════════════════════════════════');
    console.log('  SYNC SUMMARY');
    console.log('═══════════════════════════════════════════════════\n');

    console.log(`Total Clerk Users:    ${result.total}`);
    console.log(`Already in DB:        ${result.existing} ✓`);
    console.log(`Created in DB:        ${result.created} ✅`);
    console.log(`Failed:               ${result.failed} ❌\n`);

    if (result.created > 0) {
      console.log('📋 CREATED USERS:');
      result.users
        .filter((u) => u.status === 'created')
        .forEach((u) => {
          console.log(`   • ${u.email}`);
        });
      console.log('');
    }

    if (result.failed > 0) {
      console.log('⚠️  FAILED USERS:');
      result.users
        .filter((u) => u.status === 'failed')
        .forEach((u) => {
          console.log(`   • ${u.email}: ${u.error}`);
        });
      console.log('');
    }

    console.log('═══════════════════════════════════════════════════');
    console.log('✅ SYNC COMPLETED SUCCESSFULLY');
    console.log('═══════════════════════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ SYNC FAILED');
    console.error(error);
    process.exit(1);
  }
}

main();

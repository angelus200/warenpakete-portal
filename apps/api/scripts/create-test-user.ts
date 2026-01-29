import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Replace with your actual Clerk User ID
  const CLERK_USER_ID = process.argv[2];
  const EMAIL = process.argv[3] || 'test@example.com';

  if (!CLERK_USER_ID) {
    console.error('❌ Usage: npx tsx scripts/create-test-user.ts <CLERK_USER_ID> [EMAIL]');
    console.error('   Example: npx tsx scripts/create-test-user.ts user_2abc123 test@example.com');
    process.exit(1);
  }

  console.log('Creating test user...');
  console.log('Clerk ID:', CLERK_USER_ID);
  console.log('Email:', EMAIL);

  const user = await prisma.user.create({
    data: {
      clerkId: CLERK_USER_ID,
      email: EMAIL,
      firstName: 'Test',
      lastName: 'User',
      role: 'RESELLER',
    },
  });

  console.log('✅ User created:', user.id);
  console.log('Email:', user.email);
  console.log('Clerk ID:', user.clerkId);
}

main()
  .catch(e => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

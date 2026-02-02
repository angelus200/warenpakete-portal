import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔧 Mache BEIDE User zu ADMINs...\n');

  // Update office@angelus.group
  const user1 = await prisma.user.update({
    where: { email: 'office@angelus.group' },
    data: { role: 'ADMIN' },
  });
  console.log('✅ office@angelus.group → ADMIN');

  // Update thomas@commercehelden.com
  const user2 = await prisma.user.update({
    where: { email: 'thomas@commercehelden.com' },
    data: { role: 'ADMIN' },
  });
  console.log('✅ thomas@commercehelden.com → ADMIN');

  console.log('\n📊 Finale User-Rollen:');
  const allUsers = await prisma.user.findMany({
    select: { email: true, role: true },
  });
  console.table(allUsers);

  console.log('\n🎉 Beide User sind jetzt SUPERADMIN!');
  console.log('💡 Im Frontend neu laden (Ctrl+Shift+R) um Cache zu clearen.');
}

main()
  .catch((e) => {
    console.error('❌ Fehler:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

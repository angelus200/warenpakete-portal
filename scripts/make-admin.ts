import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Suche User thomas@commercehelden.com...\n');

  // SCHRITT 1: Finde User
  let user = await prisma.user.findUnique({
    where: { email: 'thomas@commercehelden.com' },
    select: { id: true, email: true, role: true, name: true },
  });

  if (!user) {
    console.log('❌ User thomas@commercehelden.com nicht gefunden!');
    console.log('\n📋 Verfügbare Users:');
    const allUsers = await prisma.user.findMany({
      select: { id: true, email: true, role: true, name: true },
    });
    console.table(allUsers);

    console.log('\n💡 Soll stattdessen office@angelus.group zum Admin gemacht werden?');

    // Versuche office@angelus.group
    user = await prisma.user.findFirst({
      where: { email: 'office@angelus.group' },
    });

    if (!user) {
      console.log('❌ Auch office@angelus.group nicht gefunden!');
      return;
    }
  }

  console.log('✅ User gefunden:');
  console.log(`   ID: ${user.id}`);
  console.log(`   Email: ${user.email}`);
  console.log(`   Name: ${user.name || 'N/A'}`);
  console.log(`   Rolle: ${user.role}`);

  // SCHRITT 2: Update zu ADMIN
  console.log('\n🔧 Setze Rolle auf ADMIN...');
  const updated = await prisma.user.update({
    where: { id: user.id },
    data: { role: 'ADMIN' },
  });

  // SCHRITT 3: Bestätige Update
  console.log('\n✅ Update erfolgreich!');
  console.log(`   ID: ${updated.id}`);
  console.log(`   Email: ${updated.email}`);
  console.log(`   Name: ${updated.name || 'N/A'}`);
  console.log(`   Rolle: ${updated.role} ⭐`);

  console.log('\n🎉 User ist jetzt SUPERADMIN!');
}

main()
  .catch((e) => {
    console.error('❌ Fehler:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

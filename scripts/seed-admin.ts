import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = 'thomas@commercehelden.com';
  const password = 'CommerceHelden2026!';
  const name = 'Thomas';

  console.log('🔐 Erstelle Admin-User...');
  console.log('─'.repeat(60));

  // Prüfe ob Admin schon existiert
  const existingAdmin = await prisma.adminUser.findUnique({
    where: { email },
  });

  if (existingAdmin) {
    console.log('⚠️  Admin existiert bereits!');
    console.log(`Email: ${existingAdmin.email}`);
    console.log(`Name: ${existingAdmin.name}`);
    console.log('\n💡 Admin-User updaten? Lösche zuerst den alten:');
    console.log(`   npx prisma studio`);
    console.log('   → admin_users table → delete row');
    return;
  }

  // Hash Passwort
  const hashedPassword = await bcrypt.hash(password, 10);

  // Erstelle Admin
  const admin = await prisma.adminUser.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role: 'admin',
    },
  });

  console.log('✅ Admin-User erfolgreich erstellt!');
  console.log('─'.repeat(60));
  console.log(`ID: ${admin.id}`);
  console.log(`Email: ${admin.email}`);
  console.log(`Name: ${admin.name}`);
  console.log(`Role: ${admin.role}`);
  console.log('─'.repeat(60));
  console.log('\n🔑 LOGIN-DATEN:');
  console.log(`Email: ${email}`);
  console.log(`Passwort: ${password}`);
  console.log('\n⚠️  WICHTIG: Ändere das Passwort in Production!');
  console.log('\n🌐 LOGIN-URL:');
  console.log('https://www.ecommercerente.com/admin/login');
}

main()
  .catch((e) => {
    console.error('❌ Fehler:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

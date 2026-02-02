import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Suche User "Thomas"...');

  // Finde User Thomas
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { name: { contains: 'Thomas', mode: 'insensitive' } },
        { firstName: { contains: 'Thomas', mode: 'insensitive' } },
        { email: { contains: 'thomas', mode: 'insensitive' } },
      ],
    },
  });

  if (!user) {
    console.error('❌ User "Thomas" nicht gefunden!');
    console.log('📋 Verfügbare Users:');
    const allUsers = await prisma.user.findMany({ select: { id: true, email: true, name: true, firstName: true } });
    console.table(allUsers);
    process.exit(1);
  }

  console.log(`✅ User gefunden: ${user.email} (${user.name || user.firstName})`);

  // Finde ein Produkt
  console.log('🔍 Suche verfügbares Produkt...');
  const product = await prisma.product.findFirst({
    where: { status: 'AVAILABLE' },
  });

  if (!product) {
    console.error('❌ Kein verfügbares Produkt gefunden!');
    process.exit(1);
  }

  console.log(`✅ Produkt gefunden: ${product.name} (€${product.price})`);

  // Erstelle Test-Order
  console.log('📦 Erstelle Test-Order...');
  const order = await prisma.order.create({
    data: {
      userId: user.id,
      status: 'PAID',
      totalAmount: product.price,
      paidAt: new Date(),
      fulfillmentType: null,
      stripePaymentId: `test_${Date.now()}`,
      items: {
        create: {
          productId: product.id,
          quantity: 1,
          price: product.price,
        },
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

  console.log('\n✅ Test-Order erfolgreich erstellt!');
  console.log('─'.repeat(60));
  console.log(`Order ID: ${order.id}`);
  console.log(`Status: ${order.status}`);
  console.log(`Fulfillment Type: ${order.fulfillmentType || 'NULL (korrekt!)'}`);
  console.log(`Produkt: ${order.items[0].product.name}`);
  console.log(`Betrag: €${order.totalAmount}`);
  console.log('─'.repeat(60));
  console.log('\n🌐 FULFILLMENT URL:');
  console.log(`https://www.ecommercerente.com/orders/${order.id}/fulfillment`);
  console.log('\n📋 Zum Testen:');
  console.log('1. Auf die URL klicken');
  console.log('2. Mit Thomas-Account einloggen');
  console.log('3. Prüfen: Keine 401 Fehler mehr!');
  console.log('4. "Lieferung" oder "Kommission" wählen');
  console.log('5. Flow durchgehen');
}

main()
  .catch((e) => {
    console.error('❌ Fehler:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

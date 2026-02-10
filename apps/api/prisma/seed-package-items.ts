import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Lösche alte PackageItems
  await prisma.packageItem.deleteMany({});

  // WARENPAKET 1 — SPORT
  const wp1 = await prisma.product.findFirst({
    where: { name: { contains: 'Warenpaket 1' } }
  });
  if (wp1) {
    await prisma.packageItem.createMany({
      data: [
        { productId: wp1.id, name: 'Kimengo Kniebandagen 4 Größen (S,M,L,XL)', quantity: 63 },
        { productId: wp1.id, name: 'Oxide Yogamatte Pink 6mm', quantity: 63 },
        { productId: wp1.id, name: 'Oxide Proteinshaker 3 Farben (Pink, Schwarz, Gelb)', quantity: 63 },
        { productId: wp1.id, name: 'Oxide Sporttasche Marine Blau', quantity: 63 },
        { productId: wp1.id, name: 'Natural Aid Powerbärchen Omega 3, Vitamin D3, K2', quantity: 63 },
      ]
    });
    console.log(`✅ Warenpaket 1 Sport: 5 PackageItems erstellt`);
  }

  // WARENPAKET 2 — BABY/KINDER
  const wp2 = await prisma.product.findFirst({
    where: { name: { contains: 'Warenpaket 2' } }
  });
  if (wp2) {
    await prisma.packageItem.createMany({
      data: [
        { productId: wp2.id, name: 'Windelbär Mullwindel 100% Bio Musselin-Baumwolle', quantity: 53 },
        { productId: wp2.id, name: 'Windelbär Spucktücher 100% Bio Musselin-Baumwolle', quantity: 53 },
        { productId: wp2.id, name: 'Windelbär Decke Bienen 100% Bio Musselin-Baumwolle', quantity: 53 },
        { productId: wp2.id, name: 'Daily Vegan for Kids Vitamine', quantity: 53 },
        { productId: wp2.id, name: 'Windelbär Baderobe Fisch/U-Boot Design', quantity: 53 },
      ]
    });
    console.log(`✅ Warenpaket 2 Baby/Kinder: 5 PackageItems erstellt`);
  }

  // WARENPAKET 3 — HAUSHALT
  const wp3 = await prisma.product.findFirst({
    where: { name: { contains: 'Warenpaket 3' } }
  });
  if (wp3) {
    await prisma.packageItem.createMany({
      data: [
        { productId: wp3.id, name: 'True North Trinkflasche Edelstahl 500ml', quantity: 65 },
        { productId: wp3.id, name: 'Daily Vegan Plus Eisen, Zink, B9, Folsäure', quantity: 65 },
        { productId: wp3.id, name: 'Oxide Freizeitrucksack Pink', quantity: 65 },
        { productId: wp3.id, name: 'Kimengo Schleifstein 1000/4000', quantity: 65 },
        { productId: wp3.id, name: 'Lexxup Kulturbeutel Schwarz/Rot', quantity: 65 },
      ]
    });
    console.log(`✅ Warenpaket 3 Haushalt: 5 PackageItems erstellt`);
  }

  console.log('\n📋 Alle PackageItems:');
  const items = await prisma.packageItem.findMany({
    include: { product: { select: { name: true } } }
  });
  items.forEach(i => console.log(`  ${i.product.name} → ${i.name} (${i.quantity}x)`));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

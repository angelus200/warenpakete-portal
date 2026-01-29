import { PrismaClient, ProductStatus } from '@prisma/client';

const prisma = new PrismaClient();

const realProducts = [
  {
    name: "Warenpaket 1 - Sport",
    description: "Hochwertige Sportartikel inkl. Trainings-/Yoga-Matten, Eiweiss-Shaker und mehr. Originalverpackte Markenware. Kategorie: Sport",
    price: 5000.00,
    retailValue: 12000.00,
    palletCount: 2,
    stock: 10,
    status: ProductStatus.AVAILABLE,
    images: [
      "https://brands-wanted.com/cdn/shop/files/EMO_12-2_Trainings-Yoga-Matte_pink_Bild_01.jpg?v=1758010765&width=3000",
      "https://brands-wanted.com/cdn/shop/files/EMO_13_Eiweiss-Shaker_schwarz_Bild_01.jpg?v=1758010765&width=3000"
    ]
  },
  {
    name: "Warenpaket 2 - Baby-/Kinderartikel",
    description: "Premium Baby- und Kinderartikel. Bademäntel, Lätzchen und mehr. Neuware in Originalverpackung. Kategorie: Baby & Kind",
    price: 5000.00,
    retailValue: 11500.00,
    palletCount: 2,
    stock: 8,
    status: ProductStatus.AVAILABLE,
    images: [
      "https://brands-wanted.com/cdn/shop/files/AMZListings_bathrobe.jpg?v=1758011010&width=2560",
      "https://brands-wanted.com/cdn/shop/files/AMZListings_bib_1.jpg?v=1758011010&width=2560"
    ]
  },
  {
    name: "Warenpaket 3 - Haushalt",
    description: "Haushaltsartikel Premium-Qualität. Wasserflaschen, Küchenutensilien und mehr. Markenware. Kategorie: Haushalt",
    price: 5000.00,
    retailValue: 11000.00,
    palletCount: 2,
    stock: 12,
    status: ProductStatus.AVAILABLE,
    images: [
      "https://brands-wanted.com/cdn/shop/files/DailyVeganPLUS-1-DailyVegan_1-2.png?v=1758011081&width=3000",
      "https://brands-wanted.com/cdn/shop/files/EMO_10_Wasserflasche_500ml_silber_Bild_01.jpg?v=1758011081&width=3000"
    ]
  }
];

async function main() {
  console.log('🗑️  Lösche alle existierenden Produkte...');

  // Lösche alle existierenden Produkte
  await prisma.orderItem.deleteMany({});
  await prisma.product.deleteMany({});

  console.log('✨ Erstelle 3 echte Warenpakete...');

  // Erstelle die echten Produkte
  for (const product of realProducts) {
    const created = await prisma.product.create({ data: product });
    console.log(`✅ ${created.name} erstellt`);
  }

  console.log('\n✅ 3 echte Warenpakete erstellt mit Original-Bildern von Brands Wanted');
}

main()
  .catch((error) => {
    console.error('❌ Fehler beim Seeding:', error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

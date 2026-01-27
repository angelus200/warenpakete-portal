import { PrismaClient, ProductStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create test products
  const products = [
    {
      name: 'Elektronik Mischpalette Premium',
      description:
        'Hochwertige Elektronik-Artikel aus Retouren und Überbeständen. Enthält Smartphones, Tablets, Laptops, Kopfhörer und Smart-Home-Geräte von Markenherstellern. Getestet und funktionsfähig. Ideal für Elektronik-Reseller.',
      price: 12500.0,
      retailValue: 28000.0,
      stock: 8,
      palletCount: 2,
      status: ProductStatus.AVAILABLE,
      images: [
        'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800',
      ],
    },
    {
      name: 'Haushaltswaren Großpaket XXL',
      description:
        'Umfangreiches Sortiment an Haushaltswaren und Küchenutensilien. Beinhaltet Töpfe, Pfannen, Geschirr, Besteck, Küchenhelfer und kleine Elektrogeräte. Neuware und A-Ware. Perfekt für Haushaltswaren-Händler und Discounter.',
      price: 8900.0,
      retailValue: 19500.0,
      stock: 15,
      palletCount: 3,
      status: ProductStatus.AVAILABLE,
      images: [
        'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800',
      ],
    },
    {
      name: 'Fashion & Textilien Markenware',
      description:
        'Aktuelle Mode und Textilien bekannter Marken. Mix aus Damen-, Herren- und Kindermode. Enthält Jeans, T-Shirts, Jacken, Schuhe und Accessoires. A-Ware aus Saisonüberhängen. Ideales Sortiment für Textil-Outlet-Stores.',
      price: 15800.0,
      retailValue: 42000.0,
      stock: 12,
      palletCount: 4,
      status: ProductStatus.AVAILABLE,
      images: [
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
      ],
    },
    {
      name: 'Spielwaren & Baby Komplettpaket',
      description:
        'Vielfältiges Spielwarensortiment für alle Altersgruppen. Enthält Lego, Playmobil, Puppen, Brettspiele, Outdoor-Spielzeug und Babyartikel. Neuware aus Lagerauflösungen. Top für Spielwarengeschäfte und Online-Shops.',
      price: 9500.0,
      retailValue: 24000.0,
      stock: 10,
      palletCount: 2,
      status: ProductStatus.AVAILABLE,
      images: [
        'https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=800',
      ],
    },
    {
      name: 'Werkzeug & Baumarkt Profi-Palette',
      description:
        'Hochwertige Werkzeuge und Baumarktartikel für Profis und Heimwerker. Umfasst Elektrowerkzeuge, Handwerkzeuge, Gartengeräte, Befestigungsmaterial und Zubehör. Markenqualität von Bosch, Makita, Einhell. Perfekt für Baumärkte.',
      price: 18900.0,
      retailValue: 45000.0,
      stock: 6,
      palletCount: 3,
      status: ProductStatus.AVAILABLE,
      images: [
        'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=800',
      ],
    },
  ];

  for (const product of products) {
    const created = await prisma.product.create({
      data: product,
    });
    console.log(`✅ Created product: ${created.name}`);
  }

  console.log('✨ Seeding completed!');
  console.log(`📦 Created ${products.length} products`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

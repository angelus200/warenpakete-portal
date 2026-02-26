import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding knowledge products...');

  const products = [
    {
      title: 'Amazon Seller Checkliste',
      description:
        'Vollständige Checkliste für den erfolgreichen Start als Amazon Seller. Schritt-für-Schritt Anleitung von der Registrierung bis zum ersten Verkauf.',
      category: 'template',
      price: 19,
      isFree: false,
      fileUrl: '/downloads/knowledge/amazon-seller-checkliste.pdf',
      isActive: true,
      sortOrder: 1,
    },
    {
      title: 'Produktrecherche Template',
      description:
        'Professionelles Excel-Template zur systematischen Produktrecherche. Inkl. ROI-Kalkulation, Konkurrenzanalyse und Markteintritts-Bewertung.',
      category: 'template',
      price: 29,
      isFree: false,
      fileUrl: '/downloads/knowledge/produktrecherche-template.xlsx',
      isActive: true,
      sortOrder: 2,
    },
    {
      title: 'Steuer-Guide Reverse Charge',
      description:
        'Umfassender Guide zum Reverse-Charge-Verfahren im E-Commerce. Praxisnahe Erklärungen mit Beispielen für den grenzüberschreitenden Handel.',
      category: 'guide',
      price: 29,
      isFree: false,
      fileUrl: '/downloads/knowledge/steuer-guide-reverse-charge.pdf',
      isActive: true,
      sortOrder: 3,
    },
    {
      title: 'ROI Kalkulations-Template',
      description:
        'Excel-Template zur präzisen ROI-Berechnung für Warenpaket-Deals. Berücksichtigt alle relevanten Kosten inkl. Versand, Lagerung und Marketplace-Gebühren.',
      category: 'template',
      price: 19,
      isFree: false,
      fileUrl: '/downloads/knowledge/roi-kalkulation.xlsx',
      isActive: true,
      sortOrder: 4,
    },
    {
      title: 'Amazon FBA Grundlagen',
      description:
        'Kostenloser Einsteiger-Guide zu Amazon FBA. Lernen Sie die Basics von Fulfillment by Amazon und entscheiden Sie, ob FBA das richtige Modell für Sie ist.',
      category: 'academy',
      price: null,
      isFree: true,
      fileUrl: '/downloads/knowledge/amazon-fba-grundlagen.pdf',
      isActive: true,
      sortOrder: 5,
    },
    {
      title: 'Marketplace Starter Guide',
      description:
        'Kompletter Leitfaden für den Einstieg in den Marketplace-Handel. Von der Plattformauswahl über Produktrecherche bis zur Skalierung Ihres Business.',
      category: 'guide',
      price: 49,
      isFree: false,
      fileUrl: '/downloads/knowledge/marketplace-starter-guide.pdf',
      isActive: true,
      sortOrder: 6,
    },
  ];

  for (const product of products) {
    await prisma.knowledgeProduct.upsert({
      where: { title: product.title },
      update: product,
      create: product,
    });
    console.log(`✓ ${product.title}`);
  }

  console.log('✅ Knowledge products seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding knowledge products:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

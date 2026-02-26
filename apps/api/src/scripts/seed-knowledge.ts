import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding knowledge products...');

  const products = [
    {
      title: 'Amazon Seller Checkliste',
      description:
        'Vollständige Checkliste für den erfolgreichen Start als Amazon Seller. 50+ Punkte aufgeteilt in 6 Kategorien: Konto & Registrierung, Produktrecherche, Listing-Optimierung, Logistik & FBA, Launch & Marketing, Rechtliches & Steuern.',
      category: 'template',
      price: 19.00,
      isFree: false,
      fileUrl: '/downloads/knowledge/amazon-seller-checkliste.pdf',
      isActive: true,
      sortOrder: 1,
    },
    {
      title: 'Produktrecherche Template',
      description:
        'Professionelles Excel-Template zur systematischen Produktrecherche. Inkl. ROI-Kalkulation, Konkurrenzanalyse, Markteintritts-Bewertung und Go/No-Go Entscheidungsmatrix.',
      category: 'template',
      price: 29.00,
      isFree: false,
      fileUrl: '/downloads/knowledge/produktrecherche-template.pdf',
      isActive: true,
      sortOrder: 2,
    },
    {
      title: 'Steuer-Guide Reverse Charge',
      description:
        'Umfassender Guide zum Reverse-Charge-Verfahren im E-Commerce. Praxisnahe Erklärungen mit Beispielen für den grenzüberschreitenden B2B-Handel innerhalb der EU und DACH-Region.',
      category: 'guide',
      price: 29.00,
      isFree: false,
      fileUrl: '/downloads/knowledge/steuer-guide-reverse-charge.pdf',
      isActive: true,
      sortOrder: 3,
    },
    {
      title: 'ROI Kalkulations-Template',
      description:
        'Excel-Template zur präzisen ROI-Berechnung für Warenpaket-Deals. Berücksichtigt alle relevanten Kosten inkl. Versand, Lagerung, Amazon-Gebühren und Marketplace-Gebühren.',
      category: 'template',
      price: 19.00,
      isFree: false,
      fileUrl: '/downloads/knowledge/roi-kalkulation.pdf',
      isActive: true,
      sortOrder: 4,
    },
    {
      title: 'Amazon FBA Grundlagen',
      description:
        'Kostenloser Einsteiger-Guide zu Amazon FBA. Lernen Sie die Basics von Fulfillment by Amazon, Gebührenstruktur, FBA vs. FBM Vergleich und entscheiden Sie, ob FBA das richtige Modell für Sie ist.',
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
        'Kompletter Leitfaden für den Einstieg in den Marketplace-Handel. Großer Vergleich der 3 wichtigsten DACH-Marktplätze (Amazon, eBay, Kaufland), inkl. Gebührenvergleich, Multi-Channel-Strategie und 90-Tage-Starter-Plan.',
      category: 'guide',
      price: 49.00,
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

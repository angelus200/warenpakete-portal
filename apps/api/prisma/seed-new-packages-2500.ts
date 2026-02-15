import { PrismaClient, ProductStatus } from '@prisma/client';

const prisma = new PrismaClient();

const WB = 'https://windelbaer.com/cdn/shop';
const FL = 'https://fitness-leben.com/cdn/shop';

const newPackages = [
  // ========================================
  // PAKET 4 – Baby Starter (Windelbär)
  // ========================================
  {
    product: {
      name: "Warenpaket 4 - Baby Starter",
      description: `Das perfekte Einstiegspaket für den Baby-Fachhandel.

Hochwertige Windelbär-Produkte aus 100% Bio-Baumwolle (GOTS & OEKO-TEX zertifiziert):
• 46× Mullwindeln 4er Set – saugstark, formstabil, vielseitig einsetzbar
• 35× Spucklätzchen 4er Set – weich und hautfreundlich für empfindliche Babyhaut
• 17× Babydecke Bienen 75×100cm – kuscheliges Musselin-Design
• 21× Baderobe Fische & U-Boot grün – praktisch und kindgerecht
• 51× Pumphose Fuchs blau (Größenmix) – bequem und stylisch

170 Artikel, originalverpackte Markenware. Ideal für den Wiederverkauf im Einzelhandel oder Online-Shop.`,
      price: 2500.00,
      retailValue: 4170.00,
      palletCount: 1,
      stock: 10,
      status: ProductStatus.AVAILABLE,
      images: [
        `${WB}/files/AMZ_Listings_diaper_24_1_2.png?width=1500`,
        `${WB}/files/AMZ_Listings_bib_24_1_2.png?width=1500`,
        `${WB}/products/SPY_listing_blanket_1_bienen.jpg?width=1500`,
        `${WB}/products/SPY_listing_bathrobe_1_Fische_U-Bootgrun.jpg?width=1500`,
        `${WB}/products/SPY_listing_baggytrousers_1_fuchs_blau.jpg?width=1500`,
      ],
    },
    items: [
      { name: "Windelbär Mullwindeln 4er Set - 100% Bio-Baumwolle", quantity: 46 },
      { name: "Windelbär Spucklätzchen 4er Set - 100% Bio-Baumwolle", quantity: 35 },
      { name: "Windelbär Babydecke Bienen 75×100cm", quantity: 17 },
      { name: "Windelbär Baderobe Fische & U-Boot grün", quantity: 21 },
      { name: "Windelbär Pumphose Fuchs blau (Größenmix)", quantity: 51 },
    ],
  },

  // ========================================
  // PAKET 5 – Baby Premium (Windelbär)
  // ========================================
  {
    product: {
      name: "Warenpaket 5 - Baby Premium",
      description: `Premium Baby-Textilien von Windelbär – 100% Bio-Baumwolle.

Exklusive Schlafsäcke und Babydecken aus nachhaltig produzierter Bio-Musselin-Baumwolle:
• 17× Schlafsack Bienen (Größe 62/68) – sicher und warm für Neugeborene
• 17× Schlafsack Wald (Größe 62/68) – naturinspiriertes Design
• 21× Babydecke Dschungel 75×100cm – kuschelig weiches Musselin
• 21× Babydecke Meer 75×100cm – maritimes Design für kleine Entdecker

76 Artikel, GOTS & OEKO-TEX zertifiziert. Hochwertige Geschenkartikel mit hoher Marge im Wiederverkauf.`,
      price: 2500.00,
      retailValue: 4040.00,
      palletCount: 1,
      stock: 10,
      status: ProductStatus.AVAILABLE,
      images: [
        `${WB}/products/SPY_listing_sleepingbag_1_bienen.jpg?width=1500`,
        `${WB}/products/SPY_listing_sleepingbag_1_wald.jpg?width=1500`,
        `${WB}/products/SPY_listing_blanket_1_dschungel.jpg?width=1500`,
        `${WB}/products/SPY_listing_blanket_1_meer.jpg?width=1500`,
      ],
    },
    items: [
      { name: "Windelbär Schlafsack Bienen - Größe 62/68", quantity: 17 },
      { name: "Windelbär Schlafsack Wald - Größe 62/68", quantity: 17 },
      { name: "Windelbär Babydecke Dschungel 75×100cm", quantity: 21 },
      { name: "Windelbär Babydecke Meer 75×100cm", quantity: 21 },
    ],
  },

  // ========================================
  // PAKET 6 – Outdoor & Camping (Fitness-Leben)
  // ========================================
  {
    product: {
      name: "Warenpaket 6 - Outdoor & Camping",
      description: `Outdoor-Essentials für Camping, Wandern und Freizeit.

Hochwertige Markenprodukte von True North, The Oregon Trail und OXIDE:
• 24× Camping Schlafsack 195cm – warm und kompakt für Outdoor-Abenteuer
• 29× True North Thermoskanne grün 500ml – doppelwandig, 12h warm/24h kalt
• 29× True North Thermoskanne lila 500ml – auslaufsicher, BPA-frei
• 33× True North Trinkflasche Edelstahl pink 500ml – nachhaltig und robust
• 37× OXIDE Freizeit Rucksack 20L gelb – leicht, wasserabweisend

152 Artikel, originalverpackte Neuware. Starkes Sortiment für Sport- und Outdoor-Händler.`,
      price: 2500.00,
      retailValue: 4120.00,
      palletCount: 1,
      stock: 10,
      status: ProductStatus.AVAILABLE,
      images: [
        `${FL}/files/camping-schlafsack-195.jpg?width=1500`,
        `${FL}/files/thermoskanne-truenorth-gruen.jpg?width=1500`,
        `${FL}/files/thermoskanne-truenorth-lila.jpg?width=1500`,
        `${FL}/files/trinkflasche-edelstahl-truenorth-pink.jpg?width=1500`,
        `${FL}/files/rucksack-20l-gelb.jpg?width=1500`,
      ],
    },
    items: [
      { name: "The Oregon Trail Camping Schlafsack 195cm", quantity: 24 },
      { name: "True North Thermoskanne grün 500ml", quantity: 29 },
      { name: "True North Thermoskanne lila 500ml", quantity: 29 },
      { name: "True North Trinkflasche Edelstahl pink 500ml", quantity: 33 },
      { name: "OXIDE Freizeit Rucksack 20L gelb", quantity: 37 },
    ],
  },

  // ========================================
  // PAKET 7 – Active Life (Fitness-Leben)
  // ========================================
  {
    product: {
      name: "Warenpaket 7 - Active Life",
      description: `Sport- und Fitness-Zubehör für einen aktiven Lebensstil.

Markenprodukte von OXIDE, KIMENGO und True North:
• 27× OXIDE Yoga Matte pink 6mm – rutschfest, hautfreundlich
• 56× KIMENGO Kniebandage (Größenmix S-XL) – medizinische Kompression
• 37× OXIDE Sporttasche 40L schwarz – geräumig mit Nassfach
• 33× True North Trinkflasche Edelstahl pink 500ml – BPA-frei
• 37× OXIDE Freizeit Rucksack 20L light pink – modisch und funktional

190 Artikel, originalverpackte Neuware. Perfekt für Fitness-Studios, Sport-Shops und Online-Handel.`,
      price: 2500.00,
      retailValue: 4110.00,
      palletCount: 1,
      stock: 10,
      status: ProductStatus.AVAILABLE,
      images: [
        `${FL}/files/EMO_12-1_Trainings-Yoga-Matte_pink_Bild_01_B.jpg?width=1500`,
        `${FL}/files/kniebandage_bild1a.jpg?width=1500`,
        `${FL}/files/sporttasche-schwarz.jpg?width=1500`,
        `${FL}/files/trinkflasche-edelstahl-truenorth-pink.jpg?width=1500`,
        `${FL}/files/rucksack-20l-rosa.jpg?width=1500`,
      ],
    },
    items: [
      { name: "OXIDE Yoga Matte pink 6mm", quantity: 27 },
      { name: "KIMENGO Kniebandage Größenmix S-XL", quantity: 56 },
      { name: "OXIDE Sporttasche 40L schwarz", quantity: 37 },
      { name: "True North Trinkflasche Edelstahl pink 500ml", quantity: 33 },
      { name: "OXIDE Freizeit Rucksack 20L light pink", quantity: 37 },
    ],
  },

  // ========================================
  // PAKET 8 – Hydration & Kitchen (Fitness-Leben)
  // ========================================
  {
    product: {
      name: "Warenpaket 8 - Hydration & Kitchen",
      description: `Praktische Alltagshelfer für Küche, Reise und unterwegs.

Hochwertige Markenprodukte von True North, KIMENGO und Lexxup:
• 33× True North Trinkflasche Edelstahl pink 500ml – nachhaltig und BPA-frei
• 29× True North Thermoskanne grün 500ml – doppelwandig isoliert
• 29× True North Thermoskanne lila 500ml – 12h heiß / 24h kalt
• 37× KIMENGO Schleifstein 1000/4000 2-in-1 – professionelle Messerpflege
• 27× Lexxup Kulturbeutel XXL schwarz – XXL-Format mit cleverer Fächeraufteilung

155 Artikel, originalverpackte Neuware. Vielseitiges Sortiment für Haushaltswaren-Händler.`,
      price: 2500.00,
      retailValue: 4115.00,
      palletCount: 1,
      stock: 10,
      status: ProductStatus.AVAILABLE,
      images: [
        `${FL}/files/trinkflasche-edelstahl-truenorth-pink.jpg?width=1500`,
        `${FL}/files/thermoskanne-truenorth-gruen.jpg?width=1500`,
        `${FL}/files/thermoskanne-truenorth-lila.jpg?width=1500`,
        `${FL}/files/KIMENGO_SchleifsteinSet_Bild1d.jpg?width=1500`,
        `${FL}/files/91NoVVWIrIL._AC_SX679.jpg?width=1500`,
      ],
    },
    items: [
      { name: "True North Trinkflasche Edelstahl pink 500ml", quantity: 33 },
      { name: "True North Thermoskanne grün 500ml", quantity: 29 },
      { name: "True North Thermoskanne lila 500ml", quantity: 29 },
      { name: "KIMENGO Schleifstein 1000/4000 2-in-1", quantity: 37 },
      { name: "Lexxup Kulturbeutel XXL schwarz", quantity: 27 },
    ],
  },

  // ========================================
  // PAKET 9 – Taschen & Reise (Fitness-Leben)
  // ========================================
  {
    product: {
      name: "Warenpaket 9 - Taschen & Reise",
      description: `Taschen, Rucksäcke und Reise-Accessoires – das komplette Sortiment.

Markenprodukte von OXIDE und Lexxup:
• 37× OXIDE Sporttasche 40L schwarz – geräumig mit Schuhfach
• 37× OXIDE Freizeit Rucksack 20L gelb – leicht und wasserabweisend
• 37× OXIDE Freizeit Rucksack 20L light pink – modisches Statement
• 27× Lexxup Kulturbeutel XXL schwarz – robustes Reiseformat
• 27× Lexxup Kulturbeutel XXL rot – auffälliges Design mit Aufhängefunktion

165 Artikel, originalverpackte Neuware. Ideal für Taschen-Shops, Reise-Zubehör und Mode-Handel.`,
      price: 2500.00,
      retailValue: 4110.00,
      palletCount: 1,
      stock: 10,
      status: ProductStatus.AVAILABLE,
      images: [
        `${FL}/files/sporttasche-schwarz.jpg?width=1500`,
        `${FL}/files/rucksack-20l-gelb.jpg?width=1500`,
        `${FL}/files/rucksack-20l-rosa.jpg?width=1500`,
        `${FL}/files/91NoVVWIrIL._AC_SX679.jpg?width=1500`,
        `${FL}/files/A13iGBpRq7L._AC_SX679.jpg?width=1500`,
      ],
    },
    items: [
      { name: "OXIDE Sporttasche 40L schwarz", quantity: 37 },
      { name: "OXIDE Freizeit Rucksack 20L gelb", quantity: 37 },
      { name: "OXIDE Freizeit Rucksack 20L light pink", quantity: 37 },
      { name: "Lexxup Kulturbeutel XXL schwarz", quantity: 27 },
      { name: "Lexxup Kulturbeutel XXL rot", quantity: 27 },
    ],
  },
];

async function main() {
  console.log('🚀 Starte Seed für 6 neue Warenpakete (€2.500)...\n');

  // Sicherheitscheck: Bestehende Produkte zählen
  const existingCount = await prisma.product.count();
  console.log(`📊 Bestehende Produkte in DB: ${existingCount}`);

  let created = 0;
  let skipped = 0;

  for (const pkg of newPackages) {
    // Idempotenz: Prüfen ob Paket bereits existiert
    const existing = await prisma.product.findFirst({
      where: { name: pkg.product.name },
    });

    if (existing) {
      console.log(`⏭️  ${pkg.product.name} existiert bereits (ID: ${existing.id}) — überspringe`);
      skipped++;
      continue;
    }

    // Transaktion: Product + PackageItems zusammen erstellen
    const result = await prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: pkg.product,
      });

      await tx.packageItem.createMany({
        data: pkg.items.map((item) => ({
          productId: product.id,
          name: item.name,
          quantity: item.quantity,
        })),
      });

      return product;
    });

    const totalItems = pkg.items.reduce((sum, item) => sum + item.quantity, 0);
    console.log(`✅ ${result.name} erstellt (ID: ${result.id}) — ${pkg.items.length} Artikel, ${totalItems} Stück`);
    created++;
  }

  // Abschluss-Statistik
  const finalProductCount = await prisma.product.count();
  const finalPackageItemCount = await prisma.packageItem.count();
  console.log(`\n========================================`);
  console.log(`📊 ERGEBNIS:`);
  console.log(`   Neu erstellt: ${created}`);
  console.log(`   Übersprungen: ${skipped}`);
  console.log(`   Produkte gesamt: ${finalProductCount}`);
  console.log(`   PackageItems gesamt: ${finalPackageItemCount}`);
  console.log(`========================================`);

  // Detaillierte Übersicht aller Produkte mit PackageItems
  const allProducts = await prisma.product.findMany({
    include: { packageItems: true },
    orderBy: { name: 'asc' },
  });

  console.log('\n📋 ALLE PRODUKTE:');
  for (const p of allProducts) {
    const totalQty = p.packageItems.reduce((sum: number, pi: any) => sum + pi.quantity, 0);
    console.log(`   ${p.name} — €${p.price} — ${p.packageItems.length} Artikel — ${totalQty} Stück — ${(p.images as string[])?.length || 0} Bilder`);
  }
}

main()
  .catch((e) => {
    console.error('❌ Fehler:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

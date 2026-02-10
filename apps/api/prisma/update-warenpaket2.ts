import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const product = await prisma.product.findFirst({
    where: { name: { contains: 'Warenpaket 2' } }
  });

  if (!product) {
    console.error('❌ Warenpaket 2 nicht gefunden!');
    const all = await prisma.product.findMany({ select: { id: true, name: true } });
    console.log('Vorhandene Produkte:', all);
    return;
  }

  console.log(`✅ Gefunden: ${product.name} (ID: ${product.id})`);

  await prisma.product.update({
    where: { id: product.id },
    data: {
      description: `Das Rundum-Sorglos-Paket für Babys und Kinder – Komfort, Pflege und Gesundheit in einem Set

Das Kinderpaket vereint alles, was Eltern für die tägliche Pflege und das Wohlbefinden ihrer Kinder brauchen:

• Sanfte Pflegeprodukte wie Mullwindeln, Spucklätzchen und eine kuschelige Babydecke aus nachhaltiger Bio-Baumwolle – ideal für empfindliche Babyhaut.
• Praktischer Badeponcho für Wärme und Komfort nach dem Baden, leicht anzuziehen und mit süßen kindgerechten Motiven.
• Natürliche Nahrungsergänzung: Die veganen Multivitamine für Kinder liefern wichtige Vitamine, Mineralstoffe und Omega-3 für Wachstum, Konzentration und ein starkes Immunsystem.

Dieses Paket bietet Eltern die perfekte Kombination aus Alltagstauglichkeit, Qualität und kindgerechtem Design – alles in einem liebevoll zusammengestellten Set, um das Leben von Eltern und Kindern einfacher und gesünder zu machen.

Inhalt des Warenpakets:
• Windelbär Mullwindel 100% Bio Musselin-Baumwolle — 53 Stück
• Windelbär Spucktücher 100% Bio Musselin-Baumwolle — 53 Stück
• Windelbär Decke Bienen 100% Bio Musselin-Baumwolle — 53 Stück
• Daily Vegan for Kids Vitamine — 53 Stück
• Windelbär Baderobe Fisch/U-Boot Design — 53 Stück`,

      // EXAKT diese 5 URLs — KOMPLETT ERSETZEN, nichts hinzufügen!
      images: [
        "https://brands-wanted.com/cdn/shop/files/AMZListings_bathrobe.jpg?v=1758011010&width=3000",
        "https://brands-wanted.com/cdn/shop/files/AMZListings_bib_1.jpg?v=1758011010&width=3000",
        "https://brands-wanted.com/cdn/shop/files/AMZListings_blanket_Bienen.jpg?v=1758011010&width=3000",
        "https://brands-wanted.com/cdn/shop/files/AMZListings_diaper.jpg?v=1758011010&width=3000",
        "https://brands-wanted.com/cdn/shop/files/DailyVegan4kids-1-DailyVegan_1.png?v=1758011010&width=3000"
      ]
    }
  });

  console.log(`✅ Warenpaket 2 Baby-/Kinderartikel aktualisiert!`);

  // Kontrolle
  const updated = await prisma.product.findUnique({
    where: { id: product.id },
    select: { name: true, images: true, description: true }
  });
  console.log(`   Bilder: ${(updated?.images as string[])?.length}`);
  console.log(`   Beschreibung: ${updated?.description?.substring(0, 60)}...`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

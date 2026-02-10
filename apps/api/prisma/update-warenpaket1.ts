import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const product = await prisma.product.findFirst({
    where: { name: { contains: 'Warenpaket 1' } }
  });

  if (!product) {
    console.error('❌ Warenpaket 1 nicht gefunden!');
    const all = await prisma.product.findMany({ select: { id: true, name: true } });
    console.log('Vorhandene Produkte:', all);
    return;
  }

  console.log(`✅ Gefunden: ${product.name} (ID: ${product.id})`);

  const updatedProduct = await prisma.product.update({
    where: { id: product.id },
    data: {
      description: `Das Rundum-Paket für Fitness, Wohlbefinden und aktive Lifestyle-Fans

Das Sport Paket vereint alles, was Sportbegeisterte für Training, Erholung und einen gesunden Alltag brauchen:

• Optimale Unterstützung dank hochwertiger Kniebandagen für mehr Stabilität und Schutz bei jeder Bewegung.
• Komfort beim Training mit einer rutschfesten, hautfreundlichen Yoga-Matte und einem praktischen Protein-Shaker für deine Shakes ohne Klumpen.
• Perfekte Organisation mit der leichten und robusten Sporttasche für Kleidung, Schuhe und Zubehör.
• Gesunde Ernährung durch leckere, vegane Power-Bärchen mit Vitamin D3, K2 und Omega-3 für Immunsystem, Knochen und Herz.

Dieses Paket ist ideal für alle, die Aktivität, Komfort und Gesundheit in einem praktischen Set kombinieren möchten. Perfekt als Startpaket für Fitnessstudio, Home-Workouts oder Outdoor-Aktivitäten!

Inhalt des Warenpakets:
• Kimengo Kniebandagen 4 verschiedene Größen (S,M,L,XL) — 63 Stück
• Oxide Yogamatte Pink 6mm — 63 Stück
• Oxide Proteinshaker 3 verschiedene Farben (Pink, Schwarz, Gelb) — 63 Stück
• Oxide Sporttasche Marine Blau — 63 Stück
• Natural Aid Powerbärchen Omega 3, Vitamin D3, Vitamin K2 — 63 Stück`,

      images: [
        "/images/products/warenpaket1/EMO_12-2_Trainings-Yoga-Matte_pink_Bild_01.jpg.avif",
        "/images/products/warenpaket1/EMO_13_Eiweiss-Shaker_schwarz_Bild_01.jpg.avif",
        "/images/products/warenpaket1/EMO_17_Sporttasche_navy_Bild_01.jpg.avif",
        "/images/products/warenpaket1/bild1.avif",
        "/images/products/warenpaket1/bild2.avif"
      ]
    }
  });

  console.log(`✅ Warenpaket 1 aktualisiert!`);
  console.log(`   Beschreibung: ${updatedProduct.description?.substring(0, 80)}...`);
  console.log(`   Bilder (${(updatedProduct.images as string[]).length}):`, updatedProduct.images);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

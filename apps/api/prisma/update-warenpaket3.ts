import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const product = await prisma.product.findFirst({
    where: { name: { contains: 'Warenpaket 3' } }
  });

  if (!product) {
    console.error('❌ Warenpaket 3 nicht gefunden!');
    const all = await prisma.product.findMany({ select: { id: true, name: true } });
    console.log('Vorhandene Produkte:', all);
    return;
  }

  console.log(`✅ Gefunden: ${product.name} (ID: ${product.id})`);

  const updatedProduct = await prisma.product.update({
    where: { id: product.id },
    data: {
      description: `Das perfekte All-in-One-Paket für Küche, Reisen und den Alltag

Mit dem Haushaltspaket erhältst du eine sorgfältig zusammengestellte Auswahl an praktischen Alltagshelfern und hochwertigen Produkten für Gesundheit, Ordnung und Wohlbefinden:

• Ordnung und Hygiene mit dem geräumigen Lexxup Kulturbeutel – ideal für Reisen und Alltag, mit cleverer Fächeraufteilung und robustem Material.
• Gesunde Ernährung dank Natural Aid Vegan Plus, den veganen Multivitaminen mit allen wichtigen Nährstoffen für Energie, Immunsystem und Vitalität.
• Scharfe Präzision mit dem Kimengo Schleifstein-Set, das Küchenmesser und Werkzeuge im Handumdrehen wieder rasiermesserscharf macht.
• Flexibilität und Outdoor-Komfort durch den True North Rucksack, der leicht, robust und wasserabweisend ist – perfekt für Freizeit, Schule und Beruf.
• Nachhaltige Trinkflasche aus Edelstahl: geruchsneutral, BPA-frei und wiederverwendbar, ideal für unterwegs oder im Büro.

Dieses Paket bietet Qualität, Funktionalität und Langlebigkeit für alle, die ihren Alltag komfortabler und gesünder gestalten möchten – vom Haushalt bis zur Freizeit perfekt ausgestattet!

Inhalt des Warenpakets:
• True North Trinkflasche Edelstahl 500ml — 65 Stück
• Daily Vegan Plus Eisen, Zink, B9, Folsäure, etc. — 65 Stück
• Oxide Freizeitrucksack Pink — 65 Stück
• Kimengo Schleifstein 1000/4000 — 65 Stück
• Lexxup Kulturbeutel Schwarz/Rot — 65 Stück`,

      images: [
        "/images/products/warenpaket3/LEXXUP_KulturbeutelXXL_rot_Bild1.jpg.avif",
        "/images/products/warenpaket3/EMO_15_Rucksack_lightpink_Bild_01.jpg.avif",
        "/images/products/warenpaket3/Bild3.jpg.avif",
        "/images/products/warenpaket3/daily-vegan.png",
        "/images/products/warenpaket3/wasserflasche.jpg"
      ]
    }
  });

  console.log(`✅ Warenpaket 3 aktualisiert!`);
  console.log(`   Beschreibung: ${updatedProduct.description?.substring(0, 80)}...`);
  console.log(`   Bilder (${(updatedProduct.images as string[]).length}):`, updatedProduct.images);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

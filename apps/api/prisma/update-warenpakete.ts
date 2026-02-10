import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Warenpaket 1 (Sport) aktualisieren
  const warenpaket1 = await prisma.product.findFirst({
    where: { name: { contains: 'Warenpaket 1' } }
  });

  if (!warenpaket1) {
    console.error('❌ Warenpaket 1 nicht gefunden!');
  } else {
    console.log(`✅ Gefunden: ${warenpaket1.name} (ID: ${warenpaket1.id})`);

    const updated1 = await prisma.product.update({
      where: { id: warenpaket1.id },
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
          "https://brands-wanted.com/cdn/shop/files/EMO_12-2_Trainings-Yoga-Matte_pink_Bild_01.jpg?v=1758010765&width=3000",
          "https://brands-wanted.com/cdn/shop/files/EMO_13_Eiweiss-Shaker_schwarz_Bild_01.jpg?v=1758010704&width=3000",
          "https://brands-wanted.com/cdn/shop/files/EMO_17_Sporttasche_navy_Bild_01.jpg?v=1758010652&width=3000",
          "https://brands-wanted.com/cdn/shop/files/EMO_23_KniebandegeInnenansicht_Bild_01.jpg?v=1758010592&width=3000",
          "https://brands-wanted.com/cdn/shop/files/Screenshot2024-04-30um13.56.16.png?v=1714481824&width=3000"
        ]
      }
    });

    console.log(`✅ Warenpaket 1 aktualisiert!`);
    console.log(`   Bilder (${(updated1.images as string[]).length}):`, updated1.images);
  }

  // Warenpaket 3 (Haushalt) aktualisieren
  const warenpaket3 = await prisma.product.findFirst({
    where: { name: { contains: 'Warenpaket 3' } }
  });

  if (!warenpaket3) {
    console.error('❌ Warenpaket 3 nicht gefunden!');
  } else {
    console.log(`\n✅ Gefunden: ${warenpaket3.name} (ID: ${warenpaket3.id})`);

    const updated3 = await prisma.product.update({
      where: { id: warenpaket3.id },
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
          "https://brands-wanted.com/cdn/shop/files/LEXXUP_KulturbeutelXXL_rot_Bild1.jpg?v=1758010902&width=3000",
          "https://brands-wanted.com/cdn/shop/files/EMO_15_Rucksack_lightpink_Bild_01.jpg?v=1758010880&width=3000",
          "https://brands-wanted.com/cdn/shop/files/Screenshot2024-05-03um13.12.17.png?v=1714739554&width=3000",
          "https://brands-wanted.com/cdn/shop/files/Screenshot2024-05-03um13.12.39.png?v=1714739576&width=3000",
          "https://brands-wanted.com/cdn/shop/files/Screenshot2024-05-03um13.13.02.png?v=1714739599&width=3000"
        ]
      }
    });

    console.log(`✅ Warenpaket 3 aktualisiert!`);
    console.log(`   Bilder (${(updated3.images as string[]).length}):`, updated3.images);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

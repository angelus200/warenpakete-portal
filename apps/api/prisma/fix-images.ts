import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // WARENPAKET 1 — SPORT
  // Exakt diese 5 URLs, nichts anderes!
  const wp1 = await prisma.product.findFirst({
    where: { name: { contains: 'Warenpaket 1' } }
  });

  if (wp1) {
    await prisma.product.update({
      where: { id: wp1.id },
      data: {
        images: [
          "https://brands-wanted.com/cdn/shop/files/EMO_12-2_Trainings-Yoga-Matte_pink_Bild_01.jpg?v=1758010765&width=3000",
          "https://brands-wanted.com/cdn/shop/files/EMO_13_Eiweiss-Shaker_schwarz_Bild_01.jpg?v=1758010765&width=3000",
          "https://brands-wanted.com/cdn/shop/files/EMO_17_Sporttasche_navy_Bild_01.jpg?v=1758010765&width=3000",
          "https://brands-wanted.com/cdn/shop/files/Bild1.jpg?v=1758010798&width=3000",
          "https://brands-wanted.com/cdn/shop/files/Bild2.jpg?v=1758010798&width=3000"
        ]
      }
    });
    console.log(`✅ Warenpaket 1 Sport — 5 Bilder korrigiert`);
  }

  // WARENPAKET 3 — HAUSHALT
  // Exakt diese 5 URLs, nichts anderes!
  const wp3 = await prisma.product.findFirst({
    where: { name: { contains: 'Warenpaket 3' } }
  });

  if (wp3) {
    await prisma.product.update({
      where: { id: wp3.id },
      data: {
        images: [
          "https://brands-wanted.com/cdn/shop/files/DailyVeganPLUS-1-DailyVegan_1-2.png?v=1758011081&width=3000",
          "https://brands-wanted.com/cdn/shop/files/EMO_10_Wasserflasche_500ml_silber_Bild_01.jpg?v=1758011081&width=3000",
          "https://brands-wanted.com/cdn/shop/files/EMO_15_Rucksack_lightpink_Bild_01.jpg?v=1758011081&width=3000",
          "https://brands-wanted.com/cdn/shop/files/LEXXUP_KulturbeutelXXL_rot_Bild1.jpg?v=1758011081&width=3000",
          "https://brands-wanted.com/cdn/shop/files/Bild3.jpg?v=1758011090&width=3000"
        ]
      }
    });
    console.log(`✅ Warenpaket 3 Haushalt — 5 Bilder korrigiert`);
  }

  // Kontrolle: Zeige alle Bilder
  const products = await prisma.product.findMany({
    select: { name: true, images: true }
  });
  products.forEach(p => {
    console.log(`\n${p.name}:`);
    (p.images as string[])?.forEach((img, i) => console.log(`  ${i+1}. ${img}`));
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

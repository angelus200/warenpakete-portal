const { PrismaClient } = require("@prisma/client");

async function main() {
  const prisma = new PrismaClient();

  console.log("🔍 Prüfe User...");
  const users = await prisma.$queryRawUnsafe(
    `SELECT id, email FROM users WHERE email = 'thomas@commercehelden.com'`
  );
  console.log("User:", users);
  const userId = users[0]?.id;
  if (!userId) {
    console.error("❌ USER NOT FOUND!");
    process.exit(1);
  }

  console.log("\n📦 Erstelle finale Test-Order für DELIVERY-FLOW...");
  const order = await prisma.$queryRawUnsafe(`
    INSERT INTO orders (id, "userId", status, "totalAmount", "fulfillmentType", "createdAt", "updatedAt", "stripePaymentId", "paidAt")
    VALUES (gen_random_uuid(), $1, 'PAID', 8500, NULL, NOW(), NOW(), 'pi_test_delivery_flow_' || EXTRACT(EPOCH FROM NOW())::bigint, NOW())
    RETURNING id
  `, userId);
  const orderId = order[0]?.id;
  console.log("✅ Order erstellt:", orderId);

  console.log("\n🛍️ Füge OrderItem hinzu...");
  const products = await prisma.$queryRawUnsafe(`SELECT id, name FROM products WHERE name LIKE '%3%' OR name LIKE '%Haushalt%' LIMIT 1`);
  console.log("Product gefunden:", products);

  let productId = products[0]?.id;
  if (!productId) {
    // Fallback: Nimm das dritte Produkt
    const anyProduct = await prisma.$queryRawUnsafe(`SELECT id, name FROM products LIMIT 1 OFFSET 2`);
    productId = anyProduct[0]?.id;
    console.log("Fallback Product:", anyProduct);
  }

  if (productId) {
    await prisma.$queryRawUnsafe(`
      INSERT INTO order_items (id, "orderId", "productId", quantity, price, "createdAt")
      VALUES (gen_random_uuid(), $1, $2, 1, 8500, NOW())
    `, orderId, productId);
    console.log("✅ OrderItem erstellt");
  }

  console.log("\n==========================================");
  console.log("✅ FINALE TEST-ORDER FÜR DELIVERY ERSTELLT!");
  console.log("==========================================");
  console.log("Order ID:", orderId);
  console.log("Status: PAID");
  console.log("FulfillmentType: NULL");
  console.log("Betrag: €85.00");
  console.log("\n🔗 TEST URL:");
  console.log("https://www.ecommercerente.com/orders/" + orderId + "/fulfillment");
  console.log("\n📋 TEST SCHRITTE:");
  console.log("1. Als thomas@commercehelden.com einloggen");
  console.log("2. 'Sofortige Lieferung' wählen");
  console.log("3. Lieferadresse eingeben:");
  console.log("   - Straße: Teststraße 123");
  console.log("   - PLZ: 1010");
  console.log("   - Ort: Wien");
  console.log("   - Land: Österreich");
  console.log("   - Telefon: +43 123 456789");
  console.log("4. 'Weiter' klicken");
  console.log("5. Prüfen: Bestätigungsseite mit Order-Details und Lieferadresse");
  console.log("==========================================\n");

  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});

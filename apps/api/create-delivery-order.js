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

  console.log("\n📦 Erstelle neue Order für AUSLIEFERUNG...");
  const order = await prisma.$queryRawUnsafe(`
    INSERT INTO orders (id, "userId", status, "totalAmount", "fulfillmentType", "createdAt", "updatedAt", "stripePaymentId", "paidAt")
    VALUES (gen_random_uuid(), $1, 'PAID', 7500, NULL, NOW(), NOW(), 'pi_test_delivery_' || EXTRACT(EPOCH FROM NOW())::bigint, NOW())
    RETURNING id
  `, userId);
  const orderId = order[0]?.id;
  console.log("✅ Order erstellt:", orderId);

  console.log("\n🛍️ Füge OrderItem hinzu...");
  const products = await prisma.$queryRawUnsafe(`SELECT id, name FROM products WHERE name LIKE '%Elektronik%' OR name LIKE '%2%' LIMIT 1`);
  console.log("Product gefunden:", products);

  let productId = products[0]?.id;
  if (!productId) {
    // Fallback: Nimm irgendein Produkt
    const anyProduct = await prisma.$queryRawUnsafe(`SELECT id, name FROM products LIMIT 1 OFFSET 1`);
    productId = anyProduct[0]?.id;
    console.log("Fallback Product:", anyProduct);
  }

  await prisma.$queryRawUnsafe(`
    INSERT INTO order_items (id, "orderId", "productId", quantity, price, "createdAt")
    VALUES (gen_random_uuid(), $1, $2, 1, 7500, NOW())
  `, orderId, productId);
  console.log("✅ OrderItem erstellt");

  console.log("\n==========================================");
  console.log("✅ TEST-ORDER FÜR AUSLIEFERUNG ERSTELLT!");
  console.log("==========================================");
  console.log("Order ID:", orderId);
  console.log("Status: PAID");
  console.log("FulfillmentType: NULL (Auswahl zwischen Kommission/Auslieferung)");
  console.log("Betrag: €75.00");
  console.log("\n🔗 TEST URL:");
  console.log("https://www.ecommercerente.com/orders/" + orderId + "/fulfillment");
  console.log("==========================================\n");

  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});

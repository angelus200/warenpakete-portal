const { PrismaClient } = require("@prisma/client");

async function main() {
  const prisma = new PrismaClient();

  // 1. Schema prüfen
  const cols = await prisma.$queryRawUnsafe(
    `SELECT column_name FROM information_schema.columns WHERE table_name = 'orders' ORDER BY ordinal_position`
  );
  console.log("Orders columns:", cols);

  // 2. User holen
  const users = await prisma.$queryRawUnsafe(
    `SELECT id, email FROM users WHERE email = 'thomas@commercehelden.com'`
  );
  console.log("User:", users);
  const userId = users[0]?.id;
  if (!userId) {
    console.error("USER NOT FOUND!");
    process.exit(1);
  }

  // 3. Neue Order (fulfillmentType=NULL = wichtig für Fulfillment-Seite)
  const order = await prisma.$queryRawUnsafe(`
    INSERT INTO orders (id, "userId", status, "totalAmount", "fulfillmentType", "createdAt", "updatedAt", "stripePaymentId", "paidAt")
    VALUES (gen_random_uuid(), $1, 'PAID', 5000, NULL, NOW(), NOW(), 'pi_test_e2e_' || EXTRACT(EPOCH FROM NOW())::bigint, NOW())
    RETURNING id
  `, userId);
  console.log("New order:", order);
  const orderId = order[0]?.id;

  // 4. OrderItem hinzufügen
  const products = await prisma.$queryRawUnsafe(`SELECT id, name FROM products LIMIT 1`);
  console.log("Product:", products);
  if (products[0]?.id) {
    await prisma.$queryRawUnsafe(`
      INSERT INTO order_items (id, "orderId", "productId", quantity, price, "createdAt", "updatedAt")
      VALUES (gen_random_uuid(), $1, $2, 1, 5000, NOW(), NOW())
    `, orderId, products[0].id);
    console.log("OrderItem created ✅");
  }

  console.log("\n==========================================");
  console.log("✅ TEST-ORDER ERSTELLT!");
  console.log("Order ID:", orderId);
  console.log("TEST URL: https://www.ecommercerente.com/orders/" + orderId + "/fulfillment");
  console.log("==========================================\n");

  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});

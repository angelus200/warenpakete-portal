-- AlterTable User: Add affiliateReferredBy field
ALTER TABLE "users" ADD COLUMN "affiliateReferredBy" TEXT;

-- AlterTable AffiliateConversion: Remove unique constraint from orderId
ALTER TABLE "affiliate_conversions" DROP CONSTRAINT IF EXISTS "affiliate_conversions_orderId_key";

-- AlterTable AffiliateConversion: Add tier column
ALTER TABLE "affiliate_conversions" ADD COLUMN "tier" INTEGER NOT NULL DEFAULT 1;

-- CreateIndex: Add composite unique constraint (linkId, orderId)
CREATE UNIQUE INDEX "affiliate_conversions_linkId_orderId_key" ON "affiliate_conversions"("linkId", "orderId");

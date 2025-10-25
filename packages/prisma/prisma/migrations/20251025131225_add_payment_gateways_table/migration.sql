/*
  Warnings:

  - You are about to drop the column `payment_method` on the `user_wallet_transactions` table. All the data in the column will be lost.
  - You are about to drop the column `reference` on the `user_wallet_transactions` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."user_wallet_transactions_payment_method_idx";

-- AlterTable
ALTER TABLE "public"."user_wallet_transactions" DROP COLUMN "payment_method",
DROP COLUMN "reference",
ADD COLUMN     "order_id" TEXT,
ADD COLUMN     "payment_gateway_id" TEXT;

-- CreateTable
CREATE TABLE "public"."payment_gateways" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "label" TEXT NOT NULL,
    "text" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "payment_gateways_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "payment_gateways_isActive_idx" ON "public"."payment_gateways"("isActive");

-- CreateIndex
CREATE INDEX "user_wallet_transactions_payment_gateway_id_idx" ON "public"."user_wallet_transactions"("payment_gateway_id");

-- AddForeignKey
ALTER TABLE "public"."user_wallet_transactions" ADD CONSTRAINT "user_wallet_transactions_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_wallet_transactions" ADD CONSTRAINT "user_wallet_transactions_payment_gateway_id_fkey" FOREIGN KEY ("payment_gateway_id") REFERENCES "public"."payment_gateways"("id") ON DELETE SET NULL ON UPDATE CASCADE;

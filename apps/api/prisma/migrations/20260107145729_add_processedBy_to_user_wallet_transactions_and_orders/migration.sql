-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "processedAt" TIMESTAMP(3),
ADD COLUMN     "processedBy_id" TEXT;

-- AlterTable
ALTER TABLE "user_wallet_transactions" ADD COLUMN     "processedAt" TIMESTAMP(3),
ADD COLUMN     "processedBy_id" TEXT;

-- CreateIndex
CREATE INDEX "user_wallet_transactions_processedBy_id_idx" ON "user_wallet_transactions"("processedBy_id");

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_processedBy_id_fkey" FOREIGN KEY ("processedBy_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_wallet_transactions" ADD CONSTRAINT "user_wallet_transactions_processedBy_id_fkey" FOREIGN KEY ("processedBy_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

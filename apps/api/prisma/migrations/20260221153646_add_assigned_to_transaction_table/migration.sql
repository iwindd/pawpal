-- AlterTable
ALTER TABLE "user_wallet_transactions" ADD COLUMN     "assigned_at" TIMESTAMP(3),
ADD COLUMN     "assigned_id" TEXT;

-- CreateIndex
CREATE INDEX "user_wallet_transactions_assigned_id_idx" ON "user_wallet_transactions"("assigned_id");

-- AddForeignKey
ALTER TABLE "user_wallet_transactions" ADD CONSTRAINT "user_wallet_transactions_assigned_id_fkey" FOREIGN KEY ("assigned_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

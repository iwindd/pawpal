/*
  Warnings:

  - A unique constraint covering the columns `[user_id,walletType]` on the table `user_wallets` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "user_wallets_user_id_walletType_key" ON "user_wallets"("user_id", "walletType");

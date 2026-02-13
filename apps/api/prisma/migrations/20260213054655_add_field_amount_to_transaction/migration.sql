/*
  Warnings:

  - Added the required column `amount` to the `user_wallet_transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user_wallet_transactions" ADD COLUMN     "amount" DECIMAL(10,2) NOT NULL;

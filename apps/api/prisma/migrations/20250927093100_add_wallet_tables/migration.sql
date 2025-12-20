/*
  Warnings:

  - You are about to drop the column `coins` on the `users` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."WalletType" AS ENUM ('MAIN');

-- CreateEnum
CREATE TYPE "public"."TransactionType" AS ENUM ('TOPUP', 'PURCHASE', 'TOPUP_FOR_PURCHASE');

-- CreateEnum
CREATE TYPE "public"."TransactionStatus" AS ENUM ('CREATED', 'PENDING', 'SUCCESS', 'FAILED');

-- AlterTable
ALTER TABLE "public"."users" DROP COLUMN "coins";

-- CreateTable
CREATE TABLE "public"."user_wallets" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "walletType" "public"."WalletType" NOT NULL DEFAULT 'MAIN',
    "balance" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'THB',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_wallets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_wallet_transactions" (
    "id" TEXT NOT NULL,
    "type" "public"."TransactionType" NOT NULL DEFAULT 'TOPUP',
    "wallet_id" TEXT NOT NULL,
    "balance_before" DECIMAL(10,2) NOT NULL,
    "balance_after" DECIMAL(10,2) NOT NULL,
    "reference" TEXT,
    "status" "public"."TransactionStatus" NOT NULL DEFAULT 'CREATED',
    "currency" TEXT NOT NULL DEFAULT 'THB',
    "payment_method" TEXT NOT NULL DEFAULT 'unknown',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_wallet_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_wallet_transactions_wallet_id_idx" ON "public"."user_wallet_transactions"("wallet_id");

-- CreateIndex
CREATE INDEX "user_wallet_transactions_type_idx" ON "public"."user_wallet_transactions"("type");

-- CreateIndex
CREATE INDEX "user_wallet_transactions_payment_method_idx" ON "public"."user_wallet_transactions"("payment_method");

-- AddForeignKey
ALTER TABLE "public"."user_wallets" ADD CONSTRAINT "user_wallets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_wallet_transactions" ADD CONSTRAINT "user_wallet_transactions_wallet_id_fkey" FOREIGN KEY ("wallet_id") REFERENCES "public"."user_wallets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

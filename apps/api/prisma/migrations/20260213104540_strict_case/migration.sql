/*
  Warnings:

  - The values [SUCCESS] on the enum `TransactionStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `createdAt` on the `carousels` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `carousels` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `order_packages` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `order_packages` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `processedAt` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `processedBy_id` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `packages` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `packages` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `payment_gateways` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `payment_gateways` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `payment_gateways` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `permissions` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `permissions` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `product_fields` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `product_fields` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `product_tags` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `product_tags` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `resources` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `resources` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `roles` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `roles` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `sales` table. All the data in the column will be lost.
  - You are about to drop the column `discountType` on the `sales` table. All the data in the column will be lost.
  - You are about to drop the column `endAt` on the `sales` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `sales` table. All the data in the column will be lost.
  - You are about to drop the column `startAt` on the `sales` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `sales` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `expiresAt` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `user_suspensions` table. All the data in the column will be lost.
  - You are about to drop the column `performedById` on the `user_suspensions` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `user_suspensions` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `user_wallet_transactions` table. All the data in the column will be lost.
  - You are about to drop the column `processedAt` on the `user_wallet_transactions` table. All the data in the column will be lost.
  - You are about to drop the column `processedBy_id` on the `user_wallet_transactions` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `user_wallet_transactions` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `user_wallets` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `user_wallets` table. All the data in the column will be lost.
  - You are about to drop the column `walletType` on the `user_wallets` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `displayName` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id,wallet_type]` on the table `user_wallets` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updated_at` to the `carousels` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `categories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `order_packages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `packages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `payment_gateways` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `permissions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `product_fields` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `product_tags` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `resources` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `roles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `end_at` to the `sales` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_at` to the `sales` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `sales` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expires_at` to the `sessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `sessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `performed_by_id` to the `user_suspensions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `user_suspensions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `user_wallet_transactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `user_wallets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `display_name` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TransactionStatus_new" AS ENUM ('CREATED', 'PENDING', 'SUCCEEDED', 'FAILED');
ALTER TABLE "public"."user_wallet_transactions" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "user_wallet_transactions" ALTER COLUMN "status" TYPE "TransactionStatus_new" USING ("status"::text::"TransactionStatus_new");
ALTER TYPE "TransactionStatus" RENAME TO "TransactionStatus_old";
ALTER TYPE "TransactionStatus_new" RENAME TO "TransactionStatus";
DROP TYPE "public"."TransactionStatus_old";
ALTER TABLE "user_wallet_transactions" ALTER COLUMN "status" SET DEFAULT 'CREATED';
COMMIT;

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_processedBy_id_fkey";

-- DropForeignKey
ALTER TABLE "user_suspensions" DROP CONSTRAINT "user_suspensions_performedById_fkey";

-- DropForeignKey
ALTER TABLE "user_suspensions" DROP CONSTRAINT "user_suspensions_userId_fkey";

-- DropForeignKey
ALTER TABLE "user_wallet_transactions" DROP CONSTRAINT "user_wallet_transactions_processedBy_id_fkey";

-- DropIndex
DROP INDEX "payment_gateways_isActive_idx";

-- DropIndex
DROP INDEX "products_createdAt_idx";

-- DropIndex
DROP INDEX "sales_discountType_idx";

-- DropIndex
DROP INDEX "sales_endAt_idx";

-- DropIndex
DROP INDEX "sales_isActive_idx";

-- DropIndex
DROP INDEX "sales_startAt_idx";

-- DropIndex
DROP INDEX "user_wallet_transactions_processedBy_id_idx";

-- DropIndex
DROP INDEX "user_wallets_user_id_walletType_key";

-- AlterTable
ALTER TABLE "carousels" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "categories" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "order_packages" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "createdAt",
DROP COLUMN "processedAt",
DROP COLUMN "processedBy_id",
DROP COLUMN "updatedAt",
ADD COLUMN     "cancelled_at" TIMESTAMP(3),
ADD COLUMN     "cancelled_by_id" TEXT,
ADD COLUMN     "completed_at" TIMESTAMP(3),
ADD COLUMN     "completed_by_id" TEXT,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "packages" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "payment_gateways" DROP COLUMN "createdAt",
DROP COLUMN "isActive",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "permissions" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "product_fields" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "product_tags" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "products" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "resources" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "roles" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "sales" DROP COLUMN "createdAt",
DROP COLUMN "discountType",
DROP COLUMN "endAt",
DROP COLUMN "isActive",
DROP COLUMN "startAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "discount_type" "DiscountType" NOT NULL DEFAULT 'PERCENT',
ADD COLUMN     "end_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "start_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "sessions" DROP COLUMN "createdAt",
DROP COLUMN "expiresAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "expires_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "user_suspensions" DROP COLUMN "createdAt",
DROP COLUMN "performedById",
DROP COLUMN "userId",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "performed_by_id" TEXT NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "user_wallet_transactions" DROP COLUMN "createdAt",
DROP COLUMN "processedAt",
DROP COLUMN "processedBy_id",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "failed_at" TIMESTAMP(3),
ADD COLUMN     "failed_by_id" TEXT,
ADD COLUMN     "succeeded_at" TIMESTAMP(3),
ADD COLUMN     "succeeded_by_id" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "user_wallets" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
DROP COLUMN "walletType",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "wallet_type" "WalletType" NOT NULL DEFAULT 'MAIN';

-- AlterTable
ALTER TABLE "users" DROP COLUMN "createdAt",
DROP COLUMN "displayName",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "display_name" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "payment_gateways_is_active_idx" ON "payment_gateways"("is_active");

-- CreateIndex
CREATE INDEX "products_created_at_idx" ON "products"("created_at");

-- CreateIndex
CREATE INDEX "sales_start_at_idx" ON "sales"("start_at");

-- CreateIndex
CREATE INDEX "sales_end_at_idx" ON "sales"("end_at");

-- CreateIndex
CREATE INDEX "sales_is_active_idx" ON "sales"("is_active");

-- CreateIndex
CREATE INDEX "sales_discount_type_idx" ON "sales"("discount_type");

-- CreateIndex
CREATE INDEX "user_wallet_transactions_succeeded_by_id_idx" ON "user_wallet_transactions"("succeeded_by_id");

-- CreateIndex
CREATE INDEX "user_wallet_transactions_failed_by_id_idx" ON "user_wallet_transactions"("failed_by_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_wallets_user_id_wallet_type_key" ON "user_wallets"("user_id", "wallet_type");

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_cancelled_by_id_fkey" FOREIGN KEY ("cancelled_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_completed_by_id_fkey" FOREIGN KEY ("completed_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_wallet_transactions" ADD CONSTRAINT "user_wallet_transactions_succeeded_by_id_fkey" FOREIGN KEY ("succeeded_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_wallet_transactions" ADD CONSTRAINT "user_wallet_transactions_failed_by_id_fkey" FOREIGN KEY ("failed_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_suspensions" ADD CONSTRAINT "user_suspensions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_suspensions" ADD CONSTRAINT "user_suspensions_performed_by_id_fkey" FOREIGN KEY ("performed_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

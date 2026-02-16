/*
  Warnings:

  - You are about to alter the column `price` on the `packages` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - The primary key for the `products` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `product_types` table. If the table is not empty, all the data it contains will be lost.
  - The required column `id` was added to the `categories` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `products` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- CreateEnum
CREATE TYPE "public"."DiscountType" AS ENUM ('PERCENT', 'FIXED');

-- DropForeignKey
ALTER TABLE "public"."_ProductTags" DROP CONSTRAINT "_ProductTags_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_ProductTags" DROP CONSTRAINT "_ProductTags_B_fkey";

-- DropForeignKey
ALTER TABLE "public"."packages" DROP CONSTRAINT "packages_product_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."products" DROP CONSTRAINT "products_category_id_fkey";

-- AlterTable
ALTER TABLE "public"."categories" ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "categories_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."packages" ADD COLUMN     "description" TEXT,
ALTER COLUMN "price" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "public"."products" DROP CONSTRAINT "products_pkey",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "products_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "public"."product_types";

-- CreateTable
CREATE TABLE "public"."product_tags" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "type" "public"."TagType" NOT NULL DEFAULT 'USER_DEFINED',

    CONSTRAINT "product_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sales" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "discountType" "public"."DiscountType" NOT NULL DEFAULT 'PERCENT',
    "discount" DECIMAL(10,2) NOT NULL,
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_SalePackages" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_SalePackages_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "product_tags_slug_key" ON "public"."product_tags"("slug");

-- CreateIndex
CREATE INDEX "product_tags_slug_idx" ON "public"."product_tags"("slug");

-- CreateIndex
CREATE INDEX "product_tags_type_idx" ON "public"."product_tags"("type");

-- CreateIndex
CREATE INDEX "sales_startAt_idx" ON "public"."sales"("startAt");

-- CreateIndex
CREATE INDEX "sales_endAt_idx" ON "public"."sales"("endAt");

-- CreateIndex
CREATE INDEX "sales_isActive_idx" ON "public"."sales"("isActive");

-- CreateIndex
CREATE INDEX "sales_discountType_idx" ON "public"."sales"("discountType");

-- CreateIndex
CREATE INDEX "_SalePackages_B_index" ON "public"."_SalePackages"("B");

-- CreateIndex
CREATE INDEX "categories_slug_idx" ON "public"."categories"("slug");

-- CreateIndex
CREATE INDEX "categories_name_idx" ON "public"."categories"("name");

-- CreateIndex
CREATE INDEX "packages_product_id_idx" ON "public"."packages"("product_id");

-- CreateIndex
CREATE INDEX "packages_price_idx" ON "public"."packages"("price");

-- CreateIndex
CREATE INDEX "products_slug_idx" ON "public"."products"("slug");

-- CreateIndex
CREATE INDEX "products_category_id_idx" ON "public"."products"("category_id");

-- CreateIndex
CREATE INDEX "products_createdAt_idx" ON "public"."products"("createdAt");

-- AddForeignKey
ALTER TABLE "public"."products" ADD CONSTRAINT "products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."packages" ADD CONSTRAINT "packages_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_ProductTags" ADD CONSTRAINT "_ProductTags_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_ProductTags" ADD CONSTRAINT "_ProductTags_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."product_tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_SalePackages" ADD CONSTRAINT "_SalePackages_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."packages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_SalePackages" ADD CONSTRAINT "_SalePackages_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."sales"("id") ON DELETE CASCADE ON UPDATE CASCADE;

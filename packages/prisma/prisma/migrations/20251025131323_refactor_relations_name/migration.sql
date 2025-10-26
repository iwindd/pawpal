/*
  Warnings:

  - You are about to drop the `_SalePackages` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."_SalePackages" DROP CONSTRAINT "_SalePackages_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_SalePackages" DROP CONSTRAINT "_SalePackages_B_fkey";

-- DropTable
DROP TABLE "public"."_SalePackages";

-- CreateTable
CREATE TABLE "public"."_PackageSales" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PackageSales_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_PackageSales_B_index" ON "public"."_PackageSales"("B");

-- AddForeignKey
ALTER TABLE "public"."_PackageSales" ADD CONSTRAINT "_PackageSales_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."packages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_PackageSales" ADD CONSTRAINT "_PackageSales_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."sales"("id") ON DELETE CASCADE ON UPDATE CASCADE;

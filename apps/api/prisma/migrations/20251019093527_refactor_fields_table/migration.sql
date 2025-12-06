/*
  Warnings:

  - You are about to drop the column `field_id` on the `product_fields` table. All the data in the column will be lost.
  - You are about to drop the `fields` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `label` to the `product_fields` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `product_fields` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."fields" DROP CONSTRAINT "fields_creator_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."product_fields" DROP CONSTRAINT "product_fields_field_id_fkey";

-- DropIndex
DROP INDEX "public"."product_fields_product_id_field_id_key";

-- AlterTable
ALTER TABLE "public"."product_fields" DROP COLUMN "field_id",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "creator_id" TEXT,
ADD COLUMN     "label" TEXT NOT NULL,
ADD COLUMN     "metadata" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "optional" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "placeholder" TEXT,
ADD COLUMN     "type" "public"."FieldType" NOT NULL DEFAULT 'TEXT',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "public"."fields";

-- AddForeignKey
ALTER TABLE "public"."product_fields" ADD CONSTRAINT "product_fields_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

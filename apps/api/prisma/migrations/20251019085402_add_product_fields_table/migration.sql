-- CreateEnum
CREATE TYPE "public"."FieldType" AS ENUM ('TEXT', 'EMAIL', 'SELECT', 'PASSWORD');

-- AlterTable
ALTER TABLE "public"."carousels" ALTER COLUMN "order" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "public"."products" ADD COLUMN     "image_id" TEXT;

-- CreateTable
CREATE TABLE "public"."order_fields" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "field_id" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "order_fields_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."fields" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "placeholder" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "type" "public"."FieldType" NOT NULL DEFAULT 'TEXT',
    "creator_id" TEXT,
    "optional" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fields_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."product_fields" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "field_id" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "product_fields_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "product_fields_product_id_field_id_key" ON "public"."product_fields"("product_id", "field_id");

-- AddForeignKey
ALTER TABLE "public"."products" ADD CONSTRAINT "products_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "public"."resources"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."order_fields" ADD CONSTRAINT "order_fields_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."order_fields" ADD CONSTRAINT "order_fields_field_id_fkey" FOREIGN KEY ("field_id") REFERENCES "public"."product_fields"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."fields" ADD CONSTRAINT "fields_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."product_fields" ADD CONSTRAINT "product_fields_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."product_fields" ADD CONSTRAINT "product_fields_field_id_fkey" FOREIGN KEY ("field_id") REFERENCES "public"."fields"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

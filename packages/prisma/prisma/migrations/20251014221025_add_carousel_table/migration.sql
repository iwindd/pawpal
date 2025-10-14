-- CreateEnum
CREATE TYPE "public"."CarouselStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "public"."carousels" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" "public"."CarouselStatus" NOT NULL DEFAULT 'DRAFT',
    "resource_id" TEXT NOT NULL,
    "product_id" TEXT,
    "creator_id" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT -1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "carousels_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."carousels" ADD CONSTRAINT "carousels_resource_id_fkey" FOREIGN KEY ("resource_id") REFERENCES "public"."resources"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."carousels" ADD CONSTRAINT "carousels_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."carousels" ADD CONSTRAINT "carousels_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateEnum
CREATE TYPE "public"."ResourceType" AS ENUM ('RESOURCE_IMAGE', 'PRODUCT_IMAGE');

-- CreateTable
CREATE TABLE "public"."resources" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" "public"."ResourceType" NOT NULL DEFAULT 'RESOURCE_IMAGE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,  
    "user_id" TEXT NOT NULL,

    CONSTRAINT "resources_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."resources" ADD CONSTRAINT "resources_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateEnum
CREATE TYPE "public"."OrderStatus" AS ENUM ('CREATED', 'PENDING', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "public"."orders" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "total" DECIMAL(10,2) NOT NULL,
    "status" "public"."OrderStatus" NOT NULL DEFAULT 'CREATED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."order_packages" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "package_id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "order_packages_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."order_packages" ADD CONSTRAINT "order_packages_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."order_packages" ADD CONSTRAINT "order_packages_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "public"."packages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('CUSTOMER', 'EMPLOYEE');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "user_type" "UserType" NOT NULL DEFAULT 'CUSTOMER';

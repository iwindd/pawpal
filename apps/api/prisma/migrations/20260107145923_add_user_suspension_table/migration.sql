-- CreateEnum
CREATE TYPE "UserSuspensionType" AS ENUM ('SUSPENDED', 'UNSUSPENDED');

-- CreateTable
CREATE TABLE "user_suspensions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "UserSuspensionType" NOT NULL,
    "note" TEXT,
    "performedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_suspensions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user_suspensions" ADD CONSTRAINT "user_suspensions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_suspensions" ADD CONSTRAINT "user_suspensions_performedById_fkey" FOREIGN KEY ("performedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

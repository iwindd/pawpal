-- CreateEnum
CREATE TYPE "AuditActionType" AS ENUM ('CREATED', 'UPDATED', 'DELETED');

-- CreateEnum
CREATE TYPE "UserSecurityEvent" AS ENUM ('EMAIL_CHANGED', 'PASSWORD_CHANGED');

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "model_name" TEXT NOT NULL,
    "record_id" TEXT NOT NULL,
    "action" "AuditActionType" NOT NULL,
    "old_data" JSONB,
    "new_data" JSONB,
    "performed_by_id" TEXT,
    "performed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip_address" TEXT,
    "user_agent" TEXT,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_security_logs" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "event_type" "UserSecurityEvent" NOT NULL,
    "old_email" TEXT,
    "new_email" TEXT,
    "performed_by_id" TEXT,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_security_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "audit_logs_model_name_record_id_idx" ON "audit_logs"("model_name", "record_id");

-- CreateIndex
CREATE INDEX "user_security_logs_user_id_created_at_idx" ON "user_security_logs"("user_id", "created_at");

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_performed_by_id_fkey" FOREIGN KEY ("performed_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_security_logs" ADD CONSTRAINT "user_security_logs_performed_by_id_fkey" FOREIGN KEY ("performed_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_security_logs" ADD CONSTRAINT "user_security_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

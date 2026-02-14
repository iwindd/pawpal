export type PrismaAuditInfo = UserSecurityLogAuditInfo;

export type UserSecurityLogAuditInfo = {
  performedById?: string;
  ipAddress?: string;
  userAgent?: string;
};

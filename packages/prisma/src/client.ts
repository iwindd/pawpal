import { PrismaClient } from "../generated/client";

// Constants
const MAX_CONNECTIONS = 20;
const CONNECTION_TIMEOUT = 10000;
const QUERY_TIMEOUT = 30000;

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
    errorFormat: "pretty",
  });

// Connection pooling configuration
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

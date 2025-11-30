import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "./prisma",
  migrations: {
    path: "prisma/migrations",
    seed: `ts-node src/seed.ts`,
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});

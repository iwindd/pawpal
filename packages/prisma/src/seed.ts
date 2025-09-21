import bcrypt from "bcrypt";
import { PrismaClient } from "../generated/client";
import users from "./seeds/users.json";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  await prisma.$transaction(async () => {
    for (const user of users) {
      await prisma.user.upsert({
        where: { email: user.email },
        update: {},
        create: {
          ...user,
          password: await bcrypt.hash(user.password, 12),
        },
      });
    }
  });

  console.log("✅ Seed completed successfully!");
  console.log(
    `Created ${await prisma.user.count()} users (hashed passwords: base on 12 rounds)`
  );
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

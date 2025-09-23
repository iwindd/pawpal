import bcrypt from "bcrypt";
import { DiscountType, PrismaClient } from "../generated/client";
import categories from "./seeds/categories.json";
import products from "./seeds/products.json";
import productTags from "./seeds/productTags.json";
import sales from "./seeds/sales.json";
import users from "./seeds/users.json";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Seed users
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

  // Seed categories
  await prisma.$transaction(async () => {
    for (const category of categories) {
      await prisma.category.upsert({
        where: { slug: category.slug },
        update: {},
        create: {
          ...category,
        },
      });
    }
  });

  // Seed Product Tags
  await prisma.$transaction(async () => {
    for (const tag of productTags) {
      await prisma.productTags.upsert({
        where: { slug: tag.slug },
        update: {},
        create: {
          ...tag,
        },
      });
    }
  });

  // Seed products
  await prisma.$transaction(async () => {
    for (const product of products) {
      await prisma.product.upsert({
        where: { slug: product.slug },
        update: {},
        create: {
          ...product,
          category: {
            connect: { slug: product.category },
          },
          productTags: {
            connect: product.productTags.map((tag) => ({ slug: tag })),
          },
          packages: {
            create: product.packages.map((pkg) => ({ ...pkg })),
          },
        },
      });
    }
  });

  await prisma.$transaction(async () => {
    for (const sale of sales) {
      await prisma.sale.upsert({
        where: { id: sale.id },
        update: {},
        create: {
          id: sale.id,
          name: sale.name,
          discountType: sale.discountType as DiscountType,
          discount: sale.discount,
          startAt: new Date(sale.startAt),
          endAt: new Date(sale.endAt),
          package: {
            connect: sale.packages.map((pkg: string) => ({ id: pkg })),
          },
        },
      });
    }
  });

  console.log(
    `✅ Seed completed successfully!\n`,
    `--------------------------------\n`,
    `Created ${await prisma.user.count()} users (hashed passwords: base on 12 rounds) \n`,
    `Created ${await prisma.product.count()} products\n`,
    `Created ${await prisma.category.count()} categories\n`,
    `Created ${await prisma.productTags.count()} product tags\n`,
    `Created ${await prisma.package.count()} packages\n`,
    `Created ${await prisma.sale.count()} sales\n`,
    `--------------------------------\n`
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

import bcrypt from "bcrypt";
import { DiscountType, FieldType, PrismaClient } from "../generated/client";
import categories from "./seeds/categories.json";
import products from "./seeds/products.json";
import productTags from "./seeds/productTags.json";
import roles from "./seeds/roles.json";
import sales from "./seeds/sales.json";
import users from "./seeds/users.json";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Seed permissions
  await prisma.$transaction(async () => {
    for (const permission of roles.permissions) {
      await prisma.permission.upsert({
        where: { name: permission.name },
        update: {},
        create: { ...permission },
      });
    }
  });

  // Seed roles
  await prisma.$transaction(async () => {
    for (const role of roles.roles) {
      await prisma.role.upsert({
        where: { name: role.name },
        update: {},
        create: {
          ...role,
          permissions: {
            connect: role.permissions.map((permission) => ({
              name: permission,
            })),
          },
        },
      });
    }
  });

  // Seed users
  await prisma.$transaction(async () => {
    for (const user of users) {
      await prisma.user.upsert({
        where: { email: user.email },
        update: {},
        create: {
          email: user.email,
          password: await bcrypt.hash(user.password, 12),
          displayName: user.displayName,
          avatar: user.avatar ?? null,
          userWallets: user.userWallets
            ? {
                create: user.userWallets.map((wallet: any) => ({
                  walletType: wallet.walletType,
                  balance: wallet.balance,
                })),
              }
            : undefined,
          roles: {
            connect: user.roles.map((role) => ({ name: role.name })),
          },
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
      await prisma.productTag.upsert({
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
      const createdProduct = await prisma.product.upsert({
        where: { slug: product.slug },
        update: {},
        create: {
          slug: product.slug,
          name: product.name,
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

      if (product.fields && product.fields.length > 0) {
        for (const field of product.fields) {
          const createdField = await prisma.field.create({
            data: {
              label: field.label,
              placeholder: field.placeholder,
              type: field.type as FieldType,
              optional: field.optional,
            },
          });

          await prisma.productField.create({
            data: {
              product: {
                connect: { id: createdProduct.id },
              },
              field: {
                connect: { id: createdField.id },
              },
            },
          });
        }
      }
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
    `Created ${await prisma.permission.count()} permissions\n`,
    `Created ${await prisma.role.count()} roles\n`,
    `Created ${await prisma.user.count()} users (hashed passwords: base on 12 rounds) \n`,
    `Created ${await prisma.product.count()} products\n`,
    `Created ${await prisma.category.count()} categories\n`,
    `Created ${await prisma.productTag.count()} product tags\n`,
    `Created ${await prisma.package.count()} packages\n`,
    `Created ${await prisma.sale.count()} sales\n`,
    `Created ${await prisma.field.count()} fields\n`,
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

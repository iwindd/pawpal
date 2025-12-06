import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcrypt';
import { env } from 'prisma/config';
import {
  DiscountType,
  FieldType,
  PrismaClient,
} from '../src/generated/prisma/client';
import categories from './data/categories.json';
import paymentGateways from './data/paymentGateways.json';
import products from './data/products.json';
import productTags from './data/productTags.json';
import roles from './data/roles.json';
import sales from './data/sales.json';
import users from './data/users.json';

const adapter = new PrismaPg({
  connectionString: env('DATABASE_URL'),
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting seed...');

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
      const fields = product.fields || [];
      await prisma.product.upsert({
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
          fields: {
            create: fields.map((field) => ({
              ...field,
              type: field.type as FieldType,
            })),
          },
        },
      });
    }
  });

  // Seed sales
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
          packages: {
            connect: sale.packages.map((pkg: string) => ({ id: pkg })),
          },
        },
      });

      console.log(
        `  - Seeded sale: ${sale.name} including packages (${sale.packages.join(', ')})`,
      );
    }
  });

  // Seed Payment Gateways
  await prisma.$transaction(async () => {
    for (const gateway of paymentGateways) {
      await prisma.paymentGateway.upsert({
        where: { id: gateway.id },
        update: {},
        create: {
          ...gateway,
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
    `Created ${await prisma.productField.count()} fields\n`,
    `Created ${await prisma.paymentGateway.count()} payment gateways\n`,
    `--------------------------------\n`,
  );
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

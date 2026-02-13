import { Prisma } from '@/generated/prisma/client';

// order.response.ts
export class OrderResponseMapper {
  static get SELECT() {
    return {
      id: true,
      total: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      user: {
        select: {
          id: true,
          email: true,
          displayName: true,
        },
      },
      orderPackages: {
        select: {
          id: true,
          amount: true,
          price: true,
          package: {
            select: {
              id: true,
              name: true,
              product: {
                select: {
                  id: true,
                  name: true,
                  category: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
      orderFields: {
        select: {
          field: {
            select: {
              label: true,
              metadata: true,
              placeholder: true,
              type: true,
            },
          },
          value: true,
        },
      },
      userWalletTransactions: {
        select: {
          id: true,
          type: true,
          status: true,
          balanceBefore: true,
          balanceAfter: true,
          createdAt: true,
          payment: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    } satisfies Prisma.OrderSelect;
  }

  static fromQuery(
    order: Prisma.OrderGetPayload<{
      select: typeof OrderResponseMapper.SELECT;
    }>,
  ) {
    return {
      id: order.id,
      total: order.total.toNumber(),
      status: order.status,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
      customer: order.user,
      cart: order.orderPackages.map((op) => ({
        id: op.id,
        amount: op.amount,
        price: op.price.toNumber(),
        package: {
          id: op.package.id,
          name: op.package.name,
        },
        product: {
          id: op.package.product.id,
          name: op.package.product.name,
        },
        category: {
          id: op.package.product.category.id,
          name: op.package.product.category.name,
        },
      })),
      fields: order.orderFields.map((of) => ({
        label: of.field.label,
        metadata: of.field.metadata,
        placeholder: of.field.placeholder,
        type: of.field.type,
        value: of.value,
      })),
      transactions: order.userWalletTransactions.map((tx) => ({
        id: tx.id,
        type: tx.type,
        status: tx.status,
        balanceBefore: tx.balanceBefore.toNumber(),
        balanceAfter: tx.balanceAfter.toNumber(),
        createdAt: tx.createdAt.toISOString(),
        payment: tx.payment
          ? {
              id: tx.payment.id,
              name: tx.payment.name,
            }
          : null,
      })),
    };
  }
}

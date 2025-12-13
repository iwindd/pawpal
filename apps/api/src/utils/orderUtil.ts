import { FieldAfterParse } from '@/common/pipes/PurchasePipe';
import { Prisma } from '@/generated/prisma/client';
import { PurchaseInput, Session } from '@pawpal/shared';

export class OrderUtil {
  static getOrderConnection(
    session: Session,
    body: PurchaseInput<FieldAfterParse>,
  ) {
    const user: Prisma.OrderCreateInput['user'] = {
      connect: {
        id: session.id,
      },
    };

    const orderPackages: Prisma.OrderCreateInput['orderPackages'] = {
      create: {
        package: {
          connect: {
            id: body.packageId,
          },
        },
        amount: body.amount,
        price: body.amount,
      },
    };

    const orderFields: Prisma.OrderCreateInput['orderFields'] = {
      create: body.fields.map((field) => ({
        field: {
          connect: {
            id: field.id,
          },
        },
        value: field.value,
      })),
    };

    return {
      user,
      orderPackages,
      orderFields,
    };
  }
}

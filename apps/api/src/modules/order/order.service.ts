import { Injectable } from '@nestjs/common';

import { OrderFilterBuilder } from '@/common/filters/orderFilter';
import { DatatableQuery } from '@/common/pipes/DatatablePipe';
import { FieldAfterParse } from '@/common/pipes/PurchasePipe';
import { OrderExtension } from '@/utils/prisma/order';
import { AdminOrderResponse, PurchaseInput } from '@pawpal/shared';
import { PackageService } from '../package/package.service';
import { PrismaService } from '../prisma/prisma.service';
import { WalletService } from '../wallet/wallet.service';

@Injectable()
export class OrderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly packageService: PackageService,
    private readonly walletService: WalletService,
  ) {}

  async getProductPackage(packageId: string) {
    return this.prisma.package.findUnique({
      where: {
        id: packageId,
      },
    });
  }

  async createOrder(userId: string, body: PurchaseInput<FieldAfterParse>) {
    const pkg = await this.packageService.getPackage(body.packageId);
    /*     const total = +pkg.price * body.amount;

    console.warn(pkg);

    const order = await this.prisma.order.create({
      data: {
        user: {
          connect: {
            id: userId,
          },
        },
        total: total.toString(),
        status: OrderStatus.PENDING_PAYMENT,
        orderPackages: {
          create: {
            package: {
              connect: {
                id: pkg.id,
              },
            },
            amount: total,
            price: pkg.price,
          },
        },
        orderFields: {
          create: body.fields.map((field) => ({
            field: {
              connect: {
                id: field.id,
              },
            },
            value: field.value,
          })),
        },
      },
    });

    await this.walletService.createChargeIfMissingAmount(
      userId,
      total,
      order.id,
      'wallet',
    );
 */
    return pkg;
  }

  async getTopupOrders({ take, search, orderBy, skip }: DatatableQuery) {
    const where = new OrderFilterBuilder()
      .onlyActiveStatuses()
      .searchUser(search)
      .build();

    const orders = await this.prisma.order.findMany({
      where,
      skip,
      take,
      orderBy,
      include: {
        ...OrderExtension.withUserAndPackages(),
      },
    });

    return {
      data: orders,
      total: await this.prisma.order.count({ where }),
    };
  }

  async findOne(id: string): Promise<AdminOrderResponse> {
    const order = await this.prisma.order.findUnique({
      where: {
        id,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            displayName: true,
          },
        },
        orderPackages: {
          include: {
            package: {
              include: {
                product: {
                  include: {
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
      },
    });

    return {
      ...order,
      total: order.total.toString(),
      orderPackages: order.orderPackages.map((op) => ({
        ...op,
        price: op.price.toString(),
      })),
    } as AdminOrderResponse;
  }
}

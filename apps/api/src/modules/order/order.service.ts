import { Injectable } from '@nestjs/common';

import { OrderFilterBuilder } from '@/common/filters/orderFilter';
import { DatatableQuery } from '@/common/pipes/DatatablePipe';
import { FieldAfterParse } from '@/common/pipes/PurchasePipe';
import { OrderExtension } from '@/utils/prisma/order';
import { OrderStatus } from '@pawpal/prisma';
import { AdminOrderResponse, PurchaseInput } from '@pawpal/shared';
import { PackageService } from '../package/package.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly packageService: PackageService,
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
    const price = +pkg.price;
    const amount = +body.amount;
    const total = price * amount;

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
            amount: amount,
            price: price.toString(),
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

    return order;
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

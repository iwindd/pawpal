import { Injectable } from '@nestjs/common';

import { OrderFilterBuilder } from '@/common/filters/orderFilter';
import { DatatableQuery } from '@/common/pipes/DatatablePipe';
import { FieldAfterParse } from '@/common/pipes/PurchasePipe';
import { OrderStatus, TransactionType } from '@/generated/prisma/client';
import { OrderUtil } from '@/utils/orderUtil';
import { OrderExtension } from '@/utils/prisma/order';
import { AdminOrderResponse, PurchaseInput, Session } from '@pawpal/shared';
import { PackageService } from '../package/package.service';
import { PaymentService } from '../payment/payment.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly packageService: PackageService,
    private readonly paymentService: PaymentService,
  ) {}

  async getProductPackage(packageId: string) {
    return this.prisma.package.findUnique({
      where: {
        id: packageId,
      },
    });
  }

  async createOrder(user: Session, body: PurchaseInput<FieldAfterParse>) {
    const _package = await this.prisma.package.getPackage(body.packageId);
    const connectionData = OrderUtil.getOrderConnection(user, body);
    const totalPrice = +_package.price;
    const missingBalance =
      body.includeWalletBalance &&
      (await this.prisma.userWallet.getMissingAmount(totalPrice, user.id));
    const topupAmount = body.includeWalletBalance ? missingBalance : totalPrice;

    const order = await this.prisma.order.create({
      data: {
        total: _package.price.toString(),
        status: OrderStatus.CREATED,
        ...connectionData,
      },
    });

    if (topupAmount > 0) {
      return {
        type: 'topup',
        charge: await this.paymentService.topup(
          user,
          topupAmount,
          body.paymentMethod,
          order.id,
        ),
      };
    } else {
      const userWallet = await this.prisma.userWallet.getWalletOrCreate(
        user.id,
      );

      const transaction = await this.prisma.userWalletTransaction.create({
        data: {
          amount: totalPrice,
          type: TransactionType.PURCHASE,
          order: {
            connect: {
              id: order.id,
            },
          },
          wallet: {
            connect: {
              id: userWallet.id,
            },
          },
          balance_after: +userWallet.balance - totalPrice,
          balance_before: userWallet.balance,
          payment: {
            connect: {
              id: body.paymentMethod,
            },
          },
        },
      });

      return {
        type: 'purchase',
        transaction,
      };
    }
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

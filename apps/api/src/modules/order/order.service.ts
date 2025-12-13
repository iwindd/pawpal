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
import { WalletRepository } from '../wallet/wallet.repository';

@Injectable()
export class OrderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly packageService: PackageService,
    private readonly paymentService: PaymentService,
    private readonly walletRepository: WalletRepository,
  ) {}

  async getProductPackage(packageId: string) {
    return this.prisma.package.findUnique({
      where: {
        id: packageId,
      },
    });
  }

  async createOrder(user: Session, body: PurchaseInput<FieldAfterParse>) {
    const productPackage = await this.prisma.package.getPackage(body.packageId);
    const connectionData = OrderUtil.getOrderConnection(user, body);
    const userWallet = await this.walletRepository.getWallet(user.id);
    const topupAmount = body.includeWalletBalance
      ? await userWallet.getMissingAmount(productPackage.price)
      : productPackage.price;

    const order = await this.prisma.order.create({
      data: {
        total: productPackage.price.toString(),
        status: OrderStatus.CREATED,
        ...connectionData,
      },
    });

    if (topupAmount.greaterThan(0)) {
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
      const balanceAfter = userWallet.balance.minus(productPackage.price);

      const transaction = await this.prisma.userWalletTransaction.create({
        data: {
          type: TransactionType.PURCHASE,
          balance_after: balanceAfter,
          balance_before: userWallet.balance,
          status: TransactionStatus.SUCCESS,
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
          payment: {
            connect: {
              id: body.paymentMethod,
            },
          },
        },
      });

      await userWallet.updateBalance(balanceAfter);
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

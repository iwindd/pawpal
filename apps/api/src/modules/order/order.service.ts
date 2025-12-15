import { Injectable, Logger } from '@nestjs/common';

import { DatatableQuery } from '@/common/pipes/DatatablePipe';
import { FieldAfterParse } from '@/common/pipes/PurchasePipe';
import {
  OrderStatus,
  TransactionStatus,
  TransactionType,
} from '@/generated/prisma/client';
import { OrderUtil } from '@/utils/orderUtil';
import { AdminOrderResponse, PurchaseInput, Session } from '@pawpal/shared';
import { PaymentService } from '../payment/payment.service';
import { PrismaService } from '../prisma/prisma.service';
import { UserWalletTransactionRepository } from '../wallet/repositories/userWalletTransaction.repository';
import { WalletRepository } from '../wallet/repositories/wallet.repository';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly paymentService: PaymentService,
    private readonly walletRepo: WalletRepository,
    private readonly userWalletTransactionRepo: UserWalletTransactionRepository,
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
    const userWallet = await this.walletRepo.find(user.id);
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

      const transaction = await this.userWalletTransactionRepo.create({
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
      });

      await userWallet.updateBalance(balanceAfter);
      await transaction.order.updateStatus(OrderStatus.PENDING);

      return {
        type: 'purchase',
        transaction,
      };
    }
  }

  /**
   * Get topup order datatable
   * @param query datatable query
   * @returns datatable response
   */
  async getTopupOrderDatatable(query: DatatableQuery) {
    return this.prisma.order.getDatatable({
      select: {
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
      query: {
        ...query,
        where: {
          status: OrderStatus.PENDING,
        },
      },
      search: {
        total: 'insensitive',
        'user.displayName': 'insensitive',
        'user.email': 'insensitive',
        'orderPackages.package.product.name': 'insensitive',
      },
    });
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

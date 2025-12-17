import { BadRequestException, Injectable, Logger } from '@nestjs/common';

import { TransactionEntity } from '@/common/entities/user-wallet-transaction.entity';
import { OrderResponseMapper } from '@/common/mappers/OrderResponseMapper';
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
import { WalletRepository } from '../wallet/wallet.repository';
import { OrderRepository } from './order.repository';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly paymentService: PaymentService,
    private readonly walletRepo: WalletRepository,
    private readonly orderRepo: OrderRepository,
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
      const transaction = await this.prisma.userWalletTransaction.create({
        data: {
          type: TransactionType.PURCHASE,
          balance_after: balanceAfter,
          balance_before: userWallet.balance,
          status: TransactionStatus.SUCCESS,
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
          order: {
            connect: {
              id: order.id,
            },
          },
        },
        select: TransactionEntity.SELECT,
      });

      await userWallet.updateBalance(balanceAfter);
      await this.orderRepo.updateStatusOrThrow(order.id, OrderStatus.PENDING);

      return {
        type: 'purchase',
        transaction: TransactionEntity.toJson(transaction),
      };
    }
  }

  /**
   * Get topup order datatable
   * @param query datatable query
   * @returns datatable response
   */
  async getTopupOrderDatatable(query: DatatableQuery) {
    const datatable = await this.prisma.order.getDatatable({
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
            balance_before: true,
            balance_after: true,
            createdAt: true,
            payment: {
              select: {
                id: true,
                name: true,
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

    return {
      data: datatable.data.map(OrderResponseMapper.fromQuery),
      total: datatable.total,
    };
  }

  /**
   * Get order by id
   * @param id order id
   * @returns order
   */
  async findOne(id: string): Promise<AdminOrderResponse> {
    const order = await this.prisma.order.findUnique({
      where: {
        id,
      },
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
            balance_before: true,
            balance_after: true,
            createdAt: true,
            payment: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      throw new BadRequestException('Order not found');
    }

    return OrderResponseMapper.fromQuery(order);
  }

  /**
   * Complete Order
   * @param id order id
   * @param status order status
   * @returns updated order
   */
  async completeOrder(id: string): Promise<AdminOrderResponse> {
    try {
      const order = await this.orderRepo.find(id, {
        status: OrderStatus.PENDING,
      });
      await order.updateStatus(OrderStatus.COMPLETED);

      this.logger.log(`Completed order ${order.id}`);
      return this.findOne(order.id);
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException('invalid_order');
    }
  }

  /**
   * Cancel Order
   * @param id order id
   * @returns updated order
   */
  async cancelOrder(id: string): Promise<AdminOrderResponse> {
    try {
      const order = await this.orderRepo.find(id);
      await order.updateStatus(OrderStatus.CANCELLED);

      this.logger.log(`Canceling order ${order.id}`);
      return this.findOne(order.id);
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException('invalid_order');
    }
  }
}

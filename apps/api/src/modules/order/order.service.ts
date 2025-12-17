import { BadRequestException, Injectable, Logger } from '@nestjs/common';

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
import { OrderRepository } from './order.repository';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly paymentService: PaymentService,
    private readonly walletRepo: WalletRepository,
    private readonly orderRepo: OrderRepository,
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
        balance_before: tx.balance_before.toNumber(),
        balance_after: tx.balance_after.toNumber(),
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

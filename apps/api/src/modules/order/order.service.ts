import { BadRequestException, Injectable, Logger } from '@nestjs/common';

import { OrderResponseMapper } from '@/common/mappers/OrderResponseMapper';
import { TransactionResponseMapper } from '@/common/mappers/TransactionResponseMapper';
import { DatatableQuery } from '@/common/pipes/DatatablePipe';
import { FieldAfterParse } from '@/common/pipes/PurchasePipe';
import {
  OrderStatus,
  Prisma,
  TransactionStatus,
  TransactionType,
} from '@/generated/prisma/client';
import {
  AdminOrderResponse,
  ENUM_ORDER_STATUS,
  PurchaseInput,
  Session,
} from '@pawpal/shared';
import { EventService } from '../event/event.service';
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
    private readonly eventService: EventService,
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
    const totalPrice = productPackage.price.mul(body.amount);
    const userWallet = await this.walletRepo.find(user.id);
    const topupAmount = body.includeWalletBalance
      ? await userWallet.getMissingAmount(totalPrice)
      : totalPrice;

    const order = await this.prisma.order.create({
      data: {
        total: totalPrice.toString(),
        status: OrderStatus.CREATED,
        user: {
          connect: {
            id: user.id,
          },
        },
        orderPackages: {
          create: {
            amount: body.amount,
            price: productPackage.price,
            package: {
              connect: {
                id: productPackage.id,
              },
            },
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
      select: OrderResponseMapper.SELECT,
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
      const balanceAfter = userWallet.balance.minus(totalPrice);
      const transaction = await this.prisma.userWalletTransaction.create({
        data: {
          type: TransactionType.PURCHASE,
          balance_after: balanceAfter,
          balance_before: userWallet.balance,
          status: TransactionStatus.PENDING,
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
        select: TransactionResponseMapper.SELECT,
      });

      await userWallet.updateBalance(balanceAfter);
      await this.prisma.order.pending(order.id);
      order.status = OrderStatus.PENDING;

      this.eventService.admin.onNewJobOrder(
        OrderResponseMapper.fromQuery(order),
      );

      return {
        type: 'purchase',
        transaction: TransactionResponseMapper.fromQuery(transaction),
        wallet: {
          balance: userWallet.balance.toNumber(),
          type: userWallet.walletType,
        },
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
      query: query,
      where: {
        status: OrderStatus.PENDING,
      },
      searchable: {
        user: {
          displayName: {
            mode: 'insensitive',
          },
          email: {
            mode: 'insensitive',
          },
        },
        orderPackages: {
          some: {
            package: {
              product: {
                name: {
                  mode: 'insensitive',
                },
              },
            },
          },
        },
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
   * @param processedBy processed by user id
   * @returns updated order
   */
  async completeOrder(
    id: string,
    processedBy: string,
  ): Promise<AdminOrderResponse> {
    const order = await this.orderRepo.find(id, {
      status: OrderStatus.PENDING,
    });
    if (!order) throw new BadRequestException('invalid_order');

    const purchaseTransaction = order.purchaseTransaction;
    if (!purchaseTransaction) throw new BadRequestException('invalid_order');

    await this.prisma.userWalletTransaction.success(
      purchaseTransaction.id,
      processedBy,
    );

    await this.prisma.order.complete(id, processedBy);
    const orderResponse = await this.orderRepo.toOrderResponse(order.id);
    this.eventService.admin.onFinishedJobOrder(orderResponse);
    this.eventService.user.onPurchaseTransactionUpdated(order.userId, {
      id: order.id,
      status: OrderStatus.COMPLETED,
      wallet: {
        balance: purchaseTransaction.balanceAfter.toNumber(),
        type: purchaseTransaction.wallet.walletType,
      },
    });

    this.logger.log(`Completed order ${order.id}`);
    return this.findOne(order.id);
  }

  /**
   * Cancel Order
   * @param id order id
   * @param processedBy processed by user id
   * @returns updated order
   */
  async cancelOrder(
    id: string,
    processedBy: string,
  ): Promise<AdminOrderResponse> {
    const order = await this.orderRepo.find(id);
    if (!order) throw new BadRequestException('invalid_order');

    const purchaseTransaction = order.purchaseTransaction;
    if (!purchaseTransaction) throw new BadRequestException('invalid_order');

    await this.prisma.userWalletTransaction.update({
      where: {
        id: purchaseTransaction.id,
      },
      data: {
        status: TransactionStatus.FAILED,
      },
    });

    await this.walletRepo.updateWalletBalanceOrThrow(
      purchaseTransaction.balanceBefore,
      order.userId,
      purchaseTransaction.wallet.walletType,
    );

    await this.prisma.order.cancel(id, processedBy);
    this.eventService.user.onPurchaseTransactionUpdated(order.userId, {
      id: order.id,
      status: OrderStatus.CANCELLED,
      wallet: {
        balance: purchaseTransaction.balanceBefore.toNumber(),
        type: purchaseTransaction.wallet.walletType,
      },
    });

    this.logger.log(`Canceling order ${order.id}`);
    return this.findOne(order.id);
  }

  /**
   * Get order history datatable
   * @param userId user id
   * @param query datatable query
   * @returns order history datatable
   */
  async getOrderHistoryDatatable(userId: string, query?: DatatableQuery) {
    this.logger.debug(query);

    const where: Prisma.OrderWhereInput = {
      user: {
        id: userId,
      },
    };

    if (
      query.filter &&
      Object.values(ENUM_ORDER_STATUS).includes(query.filter)
    ) {
      where.status = query.filter as OrderStatus;
    }

    const { data, total } = await this.prisma.order.getDatatable({
      query: query,
      select: OrderResponseMapper.SELECT,
      searchable: {
        orderPackages: {
          some: {
            package: {
              product: {
                name: {
                  mode: 'insensitive',
                },
                category: {
                  name: {
                    mode: 'insensitive',
                  },
                },
              },
            },
          },
        },
      },
      where,
    });

    return {
      data: data.map(OrderResponseMapper.fromQuery),
      total,
    };
  }
}

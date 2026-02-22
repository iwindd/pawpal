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
import { Injectable, Logger } from '@nestjs/common';
import { ENUM_ORDER_STATUS, PurchaseInput } from '@pawpal/shared';
import { PrismaService } from '../../../prisma/prisma.service';
import { Order, OrderTransaction } from '../../domain/entities/order';
import { IOrderRepository } from '../../domain/repository.port';

@Injectable()
export class PrismaOrderRepository implements IOrderRepository {
  private readonly logger = new Logger(PrismaOrderRepository.name);
  constructor(private readonly prisma: PrismaService) {}

  static get SELECT() {
    return {
      id: true,
      status: true,
      total: true,
      user_id: true,
      userWalletTransactions: {
        select: {
          id: true,
          type: true,
          status: true,
          balanceBefore: true,
          balanceAfter: true,
          wallet: {
            select: {
              balance: true,
              walletType: true,
            },
          },
        },
      },
    } satisfies Prisma.OrderSelect;
  }

  public from(
    order: Prisma.OrderGetPayload<{
      select: typeof PrismaOrderRepository.SELECT;
    }>,
  ): Order {
    const transactions: OrderTransaction[] = order.userWalletTransactions.map(
      (transaction) => ({
        id: transaction.id,
        type: transaction.type as any,
        status: transaction.status as any,
        balanceBefore: transaction.balanceBefore,
        balanceAfter: transaction.balanceAfter,
        wallet: {
          balance: transaction.wallet.balance,
          walletType: transaction.wallet.walletType as any,
        },
      }),
    );

    return new Order(
      order.id,
      order.status as any,
      order.total,
      order.user_id,
      transactions,
    );
  }

  public async find(
    orderId: string,
    where?: Prisma.OrderWhereInput,
  ): Promise<Order | null> {
    const order = await this.prisma.order.findUnique({
      where: {
        ...where,
        id: orderId,
      },
      select: PrismaOrderRepository.SELECT,
    });

    return order ? this.from(order) : null;
  }

  public async toOrderResponse(orderId: string) {
    const order = await this.prisma.order.findFirstOrThrow({
      where: {
        id: orderId,
      },
      select: OrderResponseMapper.SELECT,
    });

    return OrderResponseMapper.fromQuery(order);
  }

  public async getProductPackage(packageId: string): Promise<any> {
    return this.prisma.package.findUnique({
      where: { id: packageId },
    });
  }

  public async createOrderAndTransaction(
    userId: string,
    body: PurchaseInput<FieldAfterParse>,
    productPackage: any,
    totalPrice: any,
    userWallet: any,
    topupAmount: any,
  ): Promise<{ order: Order; transaction: any; balanceAfter: any }> {
    const order = await this.prisma.order.create({
      data: {
        total: totalPrice.toString(),
        status: OrderStatus.CREATED,
        user: { connect: { id: userId } },
        orderPackages: {
          create: {
            amount: body.amount,
            price: productPackage.price,
            package: { connect: { id: productPackage.id } },
          },
        },
        orderFields: {
          create: body.fields.map((field) => ({
            field: { connect: { id: field.id } },
            value: field.value,
          })),
        },
      },
      select: PrismaOrderRepository.SELECT,
    });

    const balanceAfter = userWallet.balance.minus(totalPrice);
    const transaction = await this.prisma.userWalletTransaction.create({
      data: {
        type: TransactionType.PURCHASE,
        balanceAfter: balanceAfter,
        balanceBefore: userWallet.balance,
        amount: totalPrice,
        status: TransactionStatus.PENDING,
        wallet: { connect: { id: userWallet.id } },
        payment: { connect: { id: body.paymentMethod } },
        order: { connect: { id: order.id } },
      },
      select: TransactionResponseMapper.SELECT,
    });

    return { order: this.from(order), transaction, balanceAfter };
  }

  public async getTopupOrderDatatable(
    query: DatatableQuery,
  ): Promise<{ data: any[]; total: number }> {
    const datatable = await this.prisma.order.getDatatable({
      select: {
        id: true,
        total: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        user: { select: { id: true, email: true, displayName: true } },
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
                    category: { select: { id: true, name: true } },
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
            payment: { select: { id: true, name: true } },
          },
        },
      },
      query,
      where: { status: OrderStatus.PENDING },
      searchable: {
        user: {
          displayName: { mode: 'insensitive' },
          email: { mode: 'insensitive' },
        },
        orderPackages: {
          some: { package: { product: { name: { mode: 'insensitive' } } } },
        },
      },
    });

    return {
      data: datatable.data.map(OrderResponseMapper.fromQuery),
      total: datatable.total,
    };
  }

  public async getOrderHistoryDatatable(
    userId: string,
    query?: DatatableQuery,
  ): Promise<{ data: any[]; total: number }> {
    const where: Prisma.OrderWhereInput = { user: { id: userId } };
    if (
      query?.filter &&
      Object.values(ENUM_ORDER_STATUS).includes(query.filter)
    ) {
      where.status = query.filter as any;
    }
    const { data, total } = await this.prisma.order.getDatatable({
      query,
      select: OrderResponseMapper.SELECT,
      searchable: {
        orderPackages: {
          some: {
            package: {
              product: {
                name: { mode: 'insensitive' },
                category: { name: { mode: 'insensitive' } },
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

  public async setPending(orderId: string): Promise<void> {
    await this.prisma.order.pending(orderId);
  }

  public async complete(orderId: string, processedBy: string): Promise<void> {
    await this.prisma.order.complete(orderId, processedBy);
  }

  public async cancel(orderId: string, processedBy: string): Promise<void> {
    await this.prisma.order.cancel(orderId, processedBy);
  }

  public async failTransaction(transactionId: string): Promise<void> {
    await this.prisma.userWalletTransaction.update({
      where: { id: transactionId },
      data: { status: TransactionStatus.FAILED },
    });
  }

  public async successTransaction(
    transactionId: string,
    processedBy: string,
  ): Promise<void> {
    await this.prisma.userWalletTransaction.success(transactionId, processedBy);
  }
}

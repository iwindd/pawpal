import { WalletEntity } from '@/common/entities/wallet.entity';
import { OrderStatus, Prisma } from '@/generated/prisma/client';
import { Injectable, Logger } from '@nestjs/common';
import { OrderEntity } from '../../common/entities/order.entity';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrderRepository {
  private readonly logger = new Logger(OrderRepository.name);
  constructor(private readonly prisma: PrismaService) {}

  static get DEFAULT_SELECT() {
    return {
      ...OrderEntity.SELECT,
      userWalletTransactions: {
        select: WalletEntity.SELECT,
      },
    } satisfies Prisma.OrderSelect;
  }

  /**
   * Create order entity from order
   * @param order order
   * @returns order entity
   */
  public from(
    order: Prisma.OrderGetPayload<{
      select: typeof OrderRepository.DEFAULT_SELECT;
    }>,
  ) {
    return new OrderEntity(order, this);
  }

  /**
   * Find order by id
   * @param orderId
   * @returns
   */
  public async find(orderId: string, where?: Prisma.OrderWhereInput) {
    const order = await this.prisma.order.findFirstOrThrow({
      where: {
        ...where,
        id: orderId,
      },
      select: OrderRepository.DEFAULT_SELECT,
    });

    return this.from(order);
  }

  /**
   * Update order status
   * @param orderId order id
   * @param status order status
   * @returns updated order
   */
  public async updateStatusOrThrow(orderId: string, status: OrderStatus) {
    this.logger.log(`Setting order ${orderId} status to ${status}`);
    return this.prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        status,
      },
    });
  }
}

import { OrderStatus, Prisma } from '@/generated/prisma/client';
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderEntity } from './order.entity';

export const DEFAULT_ORDER_SELECT = {
  id: true,
  status: true,
  total: true,
} satisfies Prisma.OrderSelect;

@Injectable()
export class OrderRepository {
  private readonly logger = new Logger(OrderRepository.name);
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create order entity from order
   * @param order order
   * @returns order entity
   */
  public from(
    order: Prisma.OrderGetPayload<{
      select: typeof DEFAULT_ORDER_SELECT;
    }>,
  ) {
    return new OrderEntity(order, this);
  }

  /**
   * Find order by id
   * @param orderId
   * @returns
   */
  public async find(orderId: string) {
    const order = await this.prisma.order.findFirstOrThrow({
      where: {
        id: orderId,
      },
      select: DEFAULT_ORDER_SELECT,
    });

    return this.from(order);
  }

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

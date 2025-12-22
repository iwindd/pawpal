import { OrderResponseMapper } from '@/common/mappers/OrderResponseMapper';
import { Prisma } from '@/generated/prisma/client';
import { Injectable, Logger } from '@nestjs/common';
import { OrderEntity } from '../../common/entities/order.entity';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrderRepository {
  private readonly logger = new Logger(OrderRepository.name);
  constructor(private readonly prisma: PrismaService) {}

  static get DEFAULT_SELECT() {
    return OrderEntity.SELECT satisfies Prisma.OrderSelect;
  }

  /**
   * Create order entity from order
   * @param order order
   * @returns order entity
   */
  public from(
    order: Prisma.OrderGetPayload<{
      select: typeof OrderEntity.SELECT;
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
    const order = await this.prisma.order.findUnique({
      where: {
        ...where,
        id: orderId,
      },
      select: OrderRepository.DEFAULT_SELECT,
    });

    return this.from(order);
  }

  /**
   * Convert order to admin order response
   * @param orderId order id
   * @returns admin order response
   */
  public async toOrderResponse(orderId: string) {
    const order = await this.prisma.order.findFirstOrThrow({
      where: {
        id: orderId,
      },
      select: OrderResponseMapper.SELECT,
    });

    return OrderResponseMapper.fromQuery(order);
  }
}

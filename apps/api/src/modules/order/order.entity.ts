import { OrderStatus, Prisma } from '@/generated/prisma/client';
import { DEFAULT_ORDER_SELECT, OrderRepository } from './order.repository';

export type OrderEntityProps = Prisma.OrderGetPayload<{
  select: typeof DEFAULT_ORDER_SELECT;
}>;

export class OrderEntity {
  constructor(
    private readonly order: OrderEntityProps,
    private readonly repo: OrderRepository,
  ) {}

  public get id() {
    return this.order.id;
  }

  public get total() {
    return this.order.total;
  }

  public async updateStatus(status: OrderStatus) {
    this.order.status = status;
    return this.repo.updateStatusOrThrow(this.order.id, status);
  }
}

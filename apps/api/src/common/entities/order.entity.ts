import { OrderStatus, Prisma } from '@/generated/prisma/client';
import { OrderRepository } from '../../modules/order/order.repository';

export type OrderEntityProps = Prisma.OrderGetPayload<{
  select: typeof OrderEntity.SELECT;
}>;

export class OrderEntity {
  constructor(
    private readonly order: OrderEntityProps,
    private readonly repo: OrderRepository,
  ) {}

  static get SELECT() {
    return {
      id: true,
      status: true,
      total: true,
    } satisfies Prisma.OrderSelect;
  }

  public get id() {
    return this.order.id;
  }

  public get total() {
    return this.order.total;
  }

  public get status() {
    return this.order.status;
  }

  public async updateStatus(status: OrderStatus) {
    this.order.status = status;
    return this.repo.updateStatusOrThrow(this.order.id, status);
  }

  public async refundPurchaseTransaction() {}
}

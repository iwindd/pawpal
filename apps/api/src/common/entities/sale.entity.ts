import { Prisma } from '@/generated/prisma/client';
import { SaleRepository } from '../../modules/sale/sale.repository';

export type SaleEntityProps = Prisma.SaleGetPayload<{
  select: typeof SaleEntity.SELECT;
}>;

export class SaleEntity {
  constructor(
    private readonly sale: SaleEntityProps,
    private readonly repo: SaleRepository,
  ) {}

  static get SELECT() {
    return {
      id: true,
      discount: true,
      discountType: true,
      startAt: true,
      endAt: true,
    } satisfies Prisma.SaleSelect;
  }

  get id() {
    return this.sale.id;
  }
}

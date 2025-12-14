import { Prisma } from '@/generated/prisma/client';
import {
  DEFAULT_SALE_SELECT,
  SaleRepository,
} from '../../modules/sale/sale.repository';

export type SaleEntityProps = Prisma.SaleGetPayload<{
  select: typeof DEFAULT_SALE_SELECT;
}>;

export class SaleEntity {
  constructor(
    private readonly sale: SaleEntityProps,
    private readonly repo: SaleRepository,
  ) {}

  get id() {
    return 'test';
  }
}

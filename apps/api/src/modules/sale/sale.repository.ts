import { Prisma } from '@/generated/prisma/client';
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SaleEntity } from './sale.entity';

export const DEFAULT_SALE_SELECT = {
  discount: true,
  discountType: true,
  startAt: true,
  endAt: true,
} satisfies Prisma.SaleSelect;

@Injectable()
export class SaleRepository {
  private readonly logger = new Logger(SaleRepository.name);
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a UserWalletTransactionEntity from a Prisma.UserWalletTransactionGetPayload
   * @param transaction Prisma.UserWalletTransactionGetPayload
   * @returns UserWalletTransactionEntity
   */
  public from(
    sale: Prisma.SaleGetPayload<{
      select: typeof DEFAULT_SALE_SELECT;
    }>,
  ) {
    return new SaleEntity(sale, this);
  }
}

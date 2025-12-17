import { Prisma } from '@/generated/prisma/client';
import { Injectable, Logger } from '@nestjs/common';
import { SaleEntity } from '../../common/entities/sale.entity';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SaleRepository {
  private readonly logger = new Logger(SaleRepository.name);
  constructor(private readonly prisma: PrismaService) {}

  static get DEFAULT_SELECT() {
    return SaleEntity.SELECT satisfies Prisma.SaleSelect;
  }

  /**
   * Create a UserWalletTransactionEntity from a Prisma.UserWalletTransactionGetPayload
   * @param transaction Prisma.UserWalletTransactionGetPayload
   * @returns UserWalletTransactionEntity
   */
  public from(
    sale: Prisma.SaleGetPayload<{
      select: typeof SaleRepository.DEFAULT_SELECT;
    }>,
  ) {
    return new SaleEntity(sale, this);
  }
}

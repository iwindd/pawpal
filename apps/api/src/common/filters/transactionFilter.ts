import { Prisma } from '@/generated/prisma/client';
import { ENUM_TRANSACTION_STATUS } from '@pawpal/shared';
import { BaseFilterBuilder } from './BaseFilterBuilder';

export class TransactionFilterBuilder extends BaseFilterBuilder<Prisma.UserWalletTransactionWhereInput> {
  onlyPendingStatus() {
    return this.status('status', [ENUM_TRANSACTION_STATUS.PENDING]);
  }

  searchUser(term?: string) {
    if (!term) return this;
    return this.merge({
      OR: [
        {
          wallet: { user: { email: { contains: term, mode: 'insensitive' } } },
        },
        {
          wallet: {
            user: { displayName: { contains: term, mode: 'insensitive' } },
          },
        },
      ],
    });
  }
}

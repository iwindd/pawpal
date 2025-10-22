import { Prisma } from '@pawpal/prisma';
import { BaseFilterBuilder } from './BaseFilterBuilder';

export class OrderFilterBuilder extends BaseFilterBuilder<Prisma.OrderWhereInput> {
  onlyActiveStatuses() {
    return this.status('status', ['PAID', 'PROCESSING']);
  }

  onlyPendingPayment() {
    return this.status('status', ['PENDING_PAYMENT']);
  }

  searchUser(term?: string) {
    if (!term) return this;
    return this.merge({
      OR: [
        { user: { email: { contains: term, mode: 'insensitive' } } },
        { user: { displayName: { contains: term, mode: 'insensitive' } } },
      ],
    });
  }
}

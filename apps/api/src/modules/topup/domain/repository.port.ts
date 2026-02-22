import { DatatableQuery } from '@/common/pipes/DatatablePipe';
import { TransactionStatus } from '@/generated/prisma/enums';
import { TopupStatus } from '@pawpal/shared';

export const TOPUP_REPOSITORY = Symbol('TOPUP_REPOSITORY');

export interface ITopupRepository {
  /**
   * Get paginated topup history table
   */
  getTopupHistoryDatatable(
    userId: string,
    query: DatatableQuery,
    statusFilter?: TopupStatus,
  ): Promise<{ data: any[]; total: number }>;

  /**
   * Create new topup charge transaction
   */
  createCharge(
    userId: string,
    amount: any,
    paymentGatewayId: string,
    walletId: string,
    walletBalance: any,
    orderId?: string,
    status?: typeof TransactionStatus | string,
  ): Promise<any>;

  /**
   * Confirm pending charge
   */
  confirm(chargeId: string): Promise<any>;
}
